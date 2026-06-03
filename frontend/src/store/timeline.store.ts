import { create } from 'zustand';
import { CareActivity, MedicalDocument } from '../types/timeline.types';

interface TimelineActions {
  addActivity: (act: Omit<CareActivity, 'id' | 'createdAt'>) => void;
  addDocument: (doc: Omit<MedicalDocument, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: string) => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const MOCK_ACTIVITIES: CareActivity[] = [
  {
    id: 'act-1',
    familyId: 'fam-hanoi-99',
    actorId: 'user-lan-123',
    actorName: 'Lê Hoàng Lan (Con gái)',
    type: 'medication_taken',
    targetId: 'med-amlodipine',
    targetName: 'Amlodipine 5mg',
    subjectName: 'Ông nội',
    message: 'Lê Hoàng Lan (Con gái) đã xác nhận cho Ông nội uống Amlodipine 5mg',
    createdAt: `${getTodayDateString()}T08:06:00Z`
  },
  {
    id: 'act-2',
    familyId: 'fam-hanoi-99',
    actorId: 'user-lan-123',
    actorName: 'Lê Hoàng Lan (Con gái)',
    type: 'medication_taken',
    targetId: 'med-metformin',
    targetName: 'Metformin 500mg',
    subjectName: 'Ông nội',
    message: 'Lê Hoàng Lan (Con gái) đã xác nhận cho Ông nội uống Metformin 500mg',
    createdAt: `${getTodayDateString()}T08:05:00Z`
  },
  {
    id: 'act-3',
    familyId: 'fam-hanoi-99',
    actorId: 'user-lan-123',
    actorName: 'Lê Hoàng Lan (Mẹ)',
    type: 'voice_note_added',
    targetId: 'med-metformin',
    targetName: 'Metformin 500mg',
    subjectName: 'Ông nội',
    message: 'Lê Hoàng Lan đã ghi âm Hướng dẫn giọng nói cho thuốc Metformin 500mg',
    metadata: { text: '“Thuốc trắng to tròn uống sau ăn sáng nha bố”' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: 'act-4',
    familyId: 'fam-hanoi-99',
    actorId: 'user-lan-123',
    actorName: 'Lê Hoàng Lan (Con gái)',
    type: 'document_uploaded',
    targetId: 'doc-presc-1',
    targetName: 'Toa thuốc Tim mạch - BV Bạch Mai',
    subjectName: 'Ông nội',
    message: 'Lê Hoàng Lan đã tải lên tài liệu mới: Toa thuốc Tim mạch - BV Bạch Mai',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  }
];

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

export const useTimelineStore = create<TimelineState & TimelineActions>((set, get) => ({
  activities: MOCK_ACTIVITIES,
  documents: MOCK_DOCUMENTS,
  
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
    
    // Also push to timeline
    get().addActivity({
      familyId: 'fam-hanoi-99',
      actorId: 'user-lan-123',
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
}));

export default useTimelineStore;
