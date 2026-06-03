import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, MedicationLog } from '../types/medication.types';
import medicationApi from '../api/medication.api';
import useTimelineStore from './timeline.store';
import useSyncStore from './sync.store';
import useFamilyStore from './family.store';
import notificationService from '../services/notification.service';

interface MedicationActions {
  fetchMedications: () => Promise<void>;
  fetchLogs: (dateStr?: string) => Promise<void>;
  addMedication: (med: Omit<Medication, 'id' | 'createdAt'>) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  toggleTaken: (medicationId: string, timeSlot: string, checkedBy: string, dateStr?: string) => Promise<void>;
  getLogsForDate: (dateStr: string) => MedicationLog[];
}

interface MedicationState {
  medications: Medication[];
  logs: MedicationLog[];
}

export const useMedicationStore = create<MedicationState & MedicationActions>()(
  persist(
    (set, get) => ({
      medications: [],
      logs: [],
      
      fetchMedications: async () => {
        try {
          const res = await medicationApi.getMedications();
          if (res.status === 'success' && res.data) {
            // Map _id from backend to id for frontend compatibility
            const mapped = res.data.medications.map((m: any) => ({
              ...m,
              id: m._id
            }));
            set({ medications: mapped });
            // Reschedule local reminders
            notificationService.scheduleAllMedicationReminders(mapped, useFamilyStore.getState().members).catch(() => {});
          }
        } catch (err) {
          console.log('[Medication Store] Fetch medications failed (offline mode). Using cached state.', err);
        }
      },

      fetchLogs: async (dateStr) => {
        try {
          const res = await medicationApi.getLogs(dateStr);
          if (res.status === 'success' && res.data) {
            const mapped = res.data.logs.map((l: any) => ({
              ...l,
              id: l._id
            }));
            set({ logs: mapped });
          }
        } catch (err) {
          console.log('[Medication Store] Fetch logs failed (offline mode). Using cached state.', err);
        }
      },

      addMedication: async (medData) => {
        try {
          const res = await medicationApi.createMedication(medData as any);
          if (res.status === 'success') {
            await get().fetchMedications();
            useTimelineStore.getState().fetchActivities().catch(() => {});
          }
        } catch (err) {
          console.warn('[Medication Store] Failed to save online. Queuing to sync offline...', err);
          
          // Add to offline sync queue
          useSyncStore.getState().addToQueue('create_medication', medData);

          // Optimistic UI Update: Add medication locally immediately
          const mockMedId = `med-offline-${Date.now()}`;
          const newMed: Medication = {
            ...medData,
            id: mockMedId,
            createdAt: new Date().toISOString()
          };
          set((state) => {
            const updated = [...state.medications, newMed];
            // Reschedule local reminders for offline optimistic update
            notificationService.scheduleAllMedicationReminders(updated, useFamilyStore.getState().members).catch(() => {});
            return { medications: updated };
          });
        }
      },
      
      updateMedication: async (id, updates) => {
        try {
          const res = await medicationApi.updateMedication(id, updates);
          if (res.status === 'success') {
            await get().fetchMedications();
            useTimelineStore.getState().fetchActivities().catch(() => {});
          }
        } catch (err) {
          console.error('[Medication Store] Update medication failed:', err);
          throw err;
        }
      },
      
      deleteMedication: async (id) => {
        try {
          const res = await medicationApi.deleteMedication(id);
          if (res.status === 'success') {
            await get().fetchMedications();
            useTimelineStore.getState().fetchActivities().catch(() => {});
          }
        } catch (err) {
          console.error('[Medication Store] Delete medication failed:', err);
          throw err;
        }
      },
      
      toggleTaken: async (medicationId, timeSlot, checkedBy, dateStr) => {
        const todayStr = dateStr || new Date().toISOString().split('T')[0];
        
        try {
          const res = await medicationApi.toggleLog(medicationId, 'taken', timeSlot, todayStr);
          if (res.status === 'success') {
            await get().fetchLogs(todayStr);
            useTimelineStore.getState().fetchActivities().catch(() => {});
          }
        } catch (err) {
          console.warn('[Medication Store] Toggle log online failed. Queuing for sync and updating UI optimistically...', err);
          
          // Add to offline sync queue
          useSyncStore.getState().addToQueue('toggle_medication_log', {
            medicationId,
            status: 'taken',
            timeSlot,
            dateStr: todayStr
          });

          // Optimistic UI Update: Toggle confirmation logs state locally
          const existingLog = get().logs.find(
            (l) => l.medicationId === medicationId && l.takenAt.startsWith(todayStr)
          );

          if (existingLog) {
            // Delete log locally
            set((state) => ({
              logs: state.logs.filter((l) => l.id !== existingLog.id)
            }));
          } else {
            // Add log locally
            const newLog: MedicationLog = {
              id: `log-offline-${Date.now()}`,
              medicationId,
              memberId: get().medications.find(m => m.id === medicationId)?.memberId || '',
              checkedBy,
              status: 'taken',
              takenAt: new Date().toISOString()
            };
            set((state) => ({
              logs: [...state.logs, newLog]
            }));
          }
        }
      },
      
      getLogsForDate: (dateStr) => {
        return get().logs.filter((l) => l.takenAt.startsWith(dateStr));
      }
    }),
    {
      name: 'kynn-medications-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useMedicationStore;
