import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CareActivity, MedicalDocument } from '../types/timeline.types';
import timelineApi from '../api/timeline.api';
import documentApi from '../api/document.api';
import { useSyncStore } from './sync.store';

interface TimelineActions {
  fetchActivities: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  addActivity: (act: Omit<CareActivity, 'id' | 'createdAt'>) => void;
  addDocument: (doc: {
    memberId: string;
    type: string; // backend type: 'toa_thuoc' | 'xet_nghiem' | 'bhyt' | 'cccd' | 'ho_so_benh_vien' | 'khac'
    fileName: string;
    expiryDate?: string;
    notes?: string;
    localUri?: string;
  }) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  addSymptomLog: (data: {
    memberId: string;
    symptoms: string | string[];
    temperature?: number;
    notes?: string;
  }) => Promise<void>;
}

interface TimelineState {
  activities: CareActivity[];
  documents: (MedicalDocument & { isOfflinePending?: boolean })[];
}

const mapBackendDocType = (backendType: string): MedicalDocument['type'] => {
  switch (backendType) {
    case 'toa_thuoc':
      return 'prescription';
    case 'xet_nghiem':
      return 'lab_result';
    case 'bhyt':
      return 'insurance';
    case 'cccd':
      return 'id_card';
    case 'ho_so_benh_vien':
      return 'hospital_record';
    default:
      return 'prescription';
  }
};

export const useTimelineStore = create<TimelineState & TimelineActions>()(
  persist(
    (set, get) => ({
      activities: [],
      documents: [],

      fetchActivities: async () => {
        try {
          const res = await timelineApi.getActivities();
          if (res.status === 'success' && res.data) {
            const mapped = res.data.activities.map((act: any) => ({
              id: act._id,
              familyId: act.familyId,
              actorId: act.actorId?._id || act.actorId,
              actorName: act.actorId?.name || 'Thành viên',
              type: act.type,
              targetId: act.targetId,
              message: act.message,
              createdAt: act.createdAt
            }));
            set({ activities: mapped });
          }
        } catch (err) {
          console.log('[Timeline Store] Fetch activities failed. Offline mode active.', err);
        }
      },

      fetchDocuments: async () => {
        try {
          const syncQueue = useSyncStore.getState().queue;
          
          // 1. Get online documents
          let onlineDocs: MedicalDocument[] = [];
          try {
            const res = await documentApi.getDocuments();
            if (res.status === 'success' && res.data) {
              onlineDocs = res.data.documents.map((doc: any) => ({
                id: doc._id,
                memberId: doc.memberId?._id || doc.memberId,
                uploadedBy: doc.uploadedBy?.name || 'Thành viên',
                type: mapBackendDocType(doc.type),
                fileUrl: doc.fileUrl,
                fileName: doc.fileName,
                expiryDate: doc.expiryDate ? doc.expiryDate.split('T')[0] : undefined,
                notes: doc.notes,
                createdAt: doc.createdAt
              }));
            }
          } catch (err) {
            console.log('[Timeline Store] Failed to fetch documents online. Using cached state.');
            onlineDocs = get().documents.filter(d => !d.isOfflinePending);
          }

          // 2. Filter out documents with pending offline deletes
          const pendingDeletes = new Set(
            syncQueue
              .filter(item => item.action === 'delete_document')
              .map(item => item.payload.id)
          );
          const filteredOnlineDocs = onlineDocs.filter(d => !pendingDeletes.has(d.id));

          // 3. Map pending offline uploads
          const offlineUploads = syncQueue
            .filter(item => item.action === 'upload_document')
            .map(item => ({
              id: item.id,
              memberId: item.payload.memberId,
              uploadedBy: 'Đang chờ đồng bộ...',
              type: mapBackendDocType(item.payload.type),
              fileUrl: item.payload.localUri || '',
              fileName: item.payload.fileName,
              expiryDate: item.payload.expiryDate,
              notes: item.payload.notes,
              createdAt: item.createdAt,
              isOfflinePending: true
            }));

          set({ documents: [...offlineUploads, ...filteredOnlineDocs] });
        } catch (err) {
          console.error('[Timeline Store] fetchDocuments error:', err);
        }
      },

      addActivity: (act) => set((state) => ({
        activities: [
          {
            ...act,
            id: `act-${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
          ...state.activities
        ]
      })),

      addDocument: async (doc) => {
        const isOnline = useSyncStore.getState().isOnline;

        if (isOnline) {
          try {
            const formData = new FormData();
            formData.append('memberId', doc.memberId);
            formData.append('type', doc.type);
            formData.append('fileName', doc.fileName);
            if (doc.expiryDate) formData.append('expiryDate', doc.expiryDate);
            formData.append('notes', doc.notes || '');

            if (doc.localUri) {
              const filename = doc.localUri.split('/').pop() || `doc-${Date.now()}`;
              const fileParts = filename.split('.');
              const fileType = fileParts.length > 1 ? fileParts.pop() : 'jpeg';

              // @ts-ignore
              formData.append('file', {
                uri: doc.localUri,
                name: filename,
                type: fileType === 'pdf' ? 'application/pdf' : `image/${fileType}`
              });
            }

            await documentApi.uploadDocument(formData);
            await get().fetchDocuments();
            await get().fetchActivities();
          } catch (err) {
            console.error('[Timeline Store] Failed to upload document online. Saving offline.', err);
            // Fallback to offline
            useSyncStore.getState().addToQueue('upload_document', doc);
            await get().fetchDocuments();
          }
        } else {
          // Offline queue path
          useSyncStore.getState().addToQueue('upload_document', doc);
          await get().fetchDocuments();
        }
      },

      deleteDocument: async (id) => {
        const isOnline = useSyncStore.getState().isOnline;

        if (id.startsWith('sync-')) {
          // It's an offline pending upload. Just remove it from sync queue.
          useSyncStore.getState().removeFromQueue(id);
          await get().fetchDocuments();
          return;
        }

        if (isOnline) {
          try {
            await documentApi.deleteDocument(id);
            await get().fetchDocuments();
            await get().fetchActivities();
          } catch (err) {
            console.error('[Timeline Store] Failed to delete document online. Saving offline.', err);
            useSyncStore.getState().addToQueue('delete_document', { id });
            await get().fetchDocuments();
          }
        } else {
          useSyncStore.getState().addToQueue('delete_document', { id });
          await get().fetchDocuments();
        }
      },

      addSymptomLog: async (data) => {
        const isOnline = useSyncStore.getState().isOnline;

        if (isOnline) {
          try {
            await timelineApi.logSymptom(data);
            await get().fetchActivities();
          } catch (err) {
            console.error('[Timeline Store] logSymptom failed online. Queuing offline.', err);
            useSyncStore.getState().addToQueue('log_symptom', data);
            
            // Add optimistic local activity
            const symptomsText = Array.isArray(data.symptoms) ? data.symptoms.join(', ') : data.symptoms;
            get().addActivity({
              familyId: 'offline',
              actorId: 'offline',
              actorName: 'Bạn (Offline)',
              type: 'symptom_log' as any,
              targetId: data.memberId,
              targetName: symptomsText,
              subjectName: '',
              message: `Đã ghi nhận triệu chứng (Chờ đồng bộ): ${symptomsText}`
            });
          }
        } else {
          useSyncStore.getState().addToQueue('log_symptom', data);
          
          // Add optimistic local activity
          const symptomsText = Array.isArray(data.symptoms) ? data.symptoms.join(', ') : data.symptoms;
          get().addActivity({
            familyId: 'offline',
            actorId: 'offline',
            actorName: 'Bạn (Offline)',
            type: 'symptom_log' as any,
            targetId: data.memberId,
            targetName: symptomsText,
            subjectName: '',
            message: `Đã ghi nhận triệu chứng (Chờ đồng bộ): ${symptomsText}`
          });
        }
      }
    }),
    {
      name: 'kynn-timeline-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useTimelineStore;
