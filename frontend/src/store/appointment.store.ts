import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appointmentApi, { CreateAppointmentDto } from '../api/appointment.api';
import { useSyncStore } from './sync.store';
import useTimelineStore from './timeline.store';

export interface Appointment {
  id: string;
  memberId: any; // Populated member or string ID
  hospital: string;
  doctor?: string;
  appointmentDate: string;
  notes?: string;
  createdAt: string;
  isOfflinePending?: boolean;
}

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
}

interface AppointmentActions {
  fetchAppointments: () => Promise<void>;
  addAppointment: (dto: CreateAppointmentDto) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState & AppointmentActions>()(
  persist(
    (set, get) => ({
      appointments: [],
      isLoading: false,

      fetchAppointments: async () => {
        set({ isLoading: true });
        try {
          const syncQueue = useSyncStore.getState().queue;

          // 1. Fetch online appointments
          let onlineAppointments: Appointment[] = [];
          try {
            const res = await appointmentApi.getAppointments();
            if (res.status === 'success' && res.data) {
              onlineAppointments = res.data.appointments.map((app: any) => ({
                id: app._id,
                memberId: app.memberId,
                hospital: app.hospital,
                doctor: app.doctor,
                appointmentDate: app.appointmentDate,
                notes: app.notes,
                createdAt: app.createdAt
              }));
            }
          } catch (err) {
            console.log('[Appointment Store] Failed to fetch online. Using cached state.');
            onlineAppointments = get().appointments.filter(a => !a.isOfflinePending);
          }

          // 2. Filter out appointments with pending deletes
          const pendingDeletes = new Set(
            syncQueue
              .filter(item => item.action === 'delete_appointment')
              .map(item => item.payload.id)
          );
          const filteredOnline = onlineAppointments.filter(app => !pendingDeletes.has(app.id));

          // 3. Map pending offline appointments
          const offlineAppointments = syncQueue
            .filter(item => item.action === 'create_appointment')
            .map(item => ({
              id: item.id,
              memberId: item.payload.memberId,
              hospital: item.payload.hospital,
              doctor: item.payload.doctor,
              appointmentDate: item.payload.appointmentDate,
              notes: item.payload.notes,
              createdAt: item.createdAt,
              isOfflinePending: true
            }));

          set({
            appointments: [...offlineAppointments, ...filteredOnline].sort(
              (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
            ),
            isLoading: false
          });
        } catch (err) {
          console.error('[Appointment Store] fetchAppointments error:', err);
          set({ isLoading: false });
        }
      },

      addAppointment: async (dto) => {
        const isOnline = useSyncStore.getState().isOnline;

        if (isOnline) {
          try {
            await appointmentApi.createAppointment(dto);
            await get().fetchAppointments();
            // Refresh activities to show the appointment creation log
            await useTimelineStore.getState().fetchActivities();
          } catch (err) {
            console.error('[Appointment Store] createAppointment failed online. Saving offline.', err);
            useSyncStore.getState().addToQueue('create_appointment', dto);
            await get().fetchAppointments();
          }
        } else {
          useSyncStore.getState().addToQueue('create_appointment', dto);
          await get().fetchAppointments();

          // Optimistically add to local timeline
          useTimelineStore.getState().addActivity({
            familyId: 'offline',
            actorId: 'offline',
            actorName: 'Bạn (Offline)',
            type: 'appointment_created' as any,
            targetId: dto.memberId,
            targetName: dto.hospital,
            subjectName: '',
            message: `Lên lịch hẹn khám (Chờ đồng bộ): ${dto.hospital} vào ${new Date(dto.appointmentDate).toLocaleString('vi-VN')}`
          });
        }
      },

      deleteAppointment: async (id) => {
        const isOnline = useSyncStore.getState().isOnline;

        if (id.startsWith('sync-')) {
          // If offline pending item, just remove it from queue
          useSyncStore.getState().removeFromQueue(id);
          await get().fetchAppointments();
          return;
        }

        if (isOnline) {
          try {
            await appointmentApi.deleteAppointment(id);
            await get().fetchAppointments();
            await useTimelineStore.getState().fetchActivities();
          } catch (err) {
            console.error('[Appointment Store] deleteAppointment failed online. Queuing offline.', err);
            useSyncStore.getState().addToQueue('delete_appointment', { id });
            await get().fetchAppointments();
          }
        } else {
          useSyncStore.getState().addToQueue('delete_appointment', { id });
          await get().fetchAppointments();
        }
      }
    }),
    {
      name: 'kynn-appointment-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useAppointmentStore;
