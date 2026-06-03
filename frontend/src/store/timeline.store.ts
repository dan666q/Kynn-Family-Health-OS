import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CareActivity, MedicalDocument } from '../types/timeline.types';
import timelineApi from '../api/timeline.api';

interface TimelineActions {
  fetchActivities: () => Promise<void>;
  addActivity: (act: Omit<CareActivity, 'id' | 'createdAt'>) => void;
  addDocument: (doc: Omit<MedicalDocument, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: string) => void;
}

const MOCK_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-presc-1',
    memberId: 'member-grandpa',
    uploadedBy: 'Lê Hoàng Lan',
    type: 'prescription',
    fileUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', // Mock Image placeholder
    fileName: 'Toa thuốc Tim mạch - BV Bạch Mai',
    notes: 'Toa thuốc huyết áp của bác sĩ điều trị cấp tháng 5/2026.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'doc-lab-1',
    memberId: 'member-grandpa',
    uploadedBy: 'Lê Hoàng Lan',
    type: 'lab_result',
    fileUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600',
    fileName: 'Phiếu xét nghiệm máu định kỳ',
    notes: 'Chỉ số đường huyết HbA1c hơi cao (6.8), cần bám sát lịch uống thuốc.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'doc-insur-1',
    memberId: 'member-grandpa',
    uploadedBy: 'Lê Hoàng Lan',
    type: 'insurance',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    fileName: 'Thẻ BHYT Ông Nội',
    expiryDate: '2027-12-31',
    notes: 'Bảo hiểm y tế hộ gia đình mức hưởng 80%.',
    createdAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'doc-id-1',
    memberId: 'member-daughter',
    uploadedBy: 'Lê Hoàng Lan',
    type: 'id_card',
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
    fileName: 'Giấy khai sinh Bé Út',
    notes: 'Bản sao công chứng dùng khi đi tiêm chủng.',
    createdAt: '2026-05-15T09:00:00Z'
  }
];

interface TimelineState {
  activities: CareActivity[];
  documents: MedicalDocument[];
}

export const useTimelineStore = create<TimelineState & TimelineActions>()(
  persist(
    (set, get) => ({
      activities: [],
      documents: MOCK_DOCUMENTS,
      
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
          console.log('[Timeline Store] Fetch activities failed (offline mode). Using cached state.', err);
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
      
      addDocument: (doc) => {
        const docId = `doc-${Date.now()}`;
        set((state) => ({
          documents: [
            {
              ...doc,
              id: docId,
              createdAt: new Date().toISOString(),
            },
            ...state.documents
          ]
        }));
        
        // Push to local timeline view immediately
        get().addActivity({
          familyId: 'current-family',
          actorId: 'current-user',
          actorName: doc.uploadedBy,
          type: 'document_uploaded',
          targetId: docId,
          targetName: doc.fileName,
          subjectName: doc.memberId === 'member-grandpa' ? 'Ông nội' : (doc.memberId === 'member-daughter' ? 'Bé Út' : 'Papa'),
          message: `${doc.uploadedBy} đã tải lên tài liệu mới: ${doc.fileName}`,
        });
      },
      
      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter((d) => d.id !== id)
      }))
    }),
    {
      name: 'kynn-timeline-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useTimelineStore;
