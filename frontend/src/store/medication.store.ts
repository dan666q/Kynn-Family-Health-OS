import { create } from 'zustand';
import { Medication, MedicationLog } from '../types/medication.types';
import useTimelineStore from './timeline.store';

interface MedicationActions {
  addMedication: (med: Omit<Medication, 'id' | 'createdAt'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  toggleTaken: (medicationId: string, timeSlot: string, checkedBy: string) => void;
  getLogsForDate: (dateStr: string) => MedicationLog[];
}

const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'med-metformin',
    memberId: 'member-grandpa',
    name: 'Metformin 500mg (Trị tiểu đường)',
    dosage: '1 viên',
    frequency: 'daily',
    schedule: ['08:00', '20:00'],
    notes: 'Uống ngay sau khi ăn sáng và ăn tối no. Không uống khi đói.',
    active: true,
    voiceNoteUrl: 'mock-audio-metformin-123',
    voiceDuration: 8,
    createdAt: '2026-05-15T08:00:00Z',
  },
  {
    id: 'med-amlodipine',
    memberId: 'member-grandpa',
    name: 'Amlodipine 5mg (Huyết áp)',
    dosage: '1 viên',
    frequency: 'daily',
    schedule: ['08:00'],
    notes: 'Uống vào buổi sáng sau thức dậy.',
    active: true,
    voiceNoteUrl: 'mock-audio-amlodipine-456',
    voiceDuration: 5,
    createdAt: '2026-05-15T08:00:00Z',
  },
  {
    id: 'med-ventolin',
    memberId: 'member-daughter',
    name: 'Ventolin Inhaler 100mcg (Xịt hen)',
    dosage: 'Xịt 1 nhát',
    frequency: 'custom',
    schedule: ['Khi khò khè / Khó thở'],
    notes: 'Lắc kỹ trước khi xịt, súc miệng lại bằng nước ấm sau xịt.',
    active: true,
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'med-colchicine',
    memberId: 'member-father',
    name: 'Colchicine 1mg (Gout)',
    dosage: '1 viên',
    frequency: 'daily',
    schedule: ['20:00'],
    notes: 'Uống buổi tối sau ăn.',
    active: true,
    createdAt: '2026-05-25T12:00:00Z',
  }
];

// Seed initial logs for today (morning medicine taken, evening pending)
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const INITIAL_LOGS: MedicationLog[] = [
  {
    id: 'log-metformin-morning',
    medicationId: 'med-metformin',
    memberId: 'member-grandpa',
    checkedBy: 'Lê Hoàng Lan (Con gái)',
    status: 'taken',
    takenAt: `${getTodayDateString()}T08:05:00Z`
  },
  {
    id: 'log-amlodipine-morning',
    medicationId: 'med-amlodipine',
    memberId: 'member-grandpa',
    checkedBy: 'Lê Hoàng Lan (Con gái)',
    status: 'taken',
    takenAt: `${getTodayDateString()}T08:06:00Z`
  }
];

interface MedicationState {
  medications: Medication[];
  logs: MedicationLog[];
}

export const useMedicationStore = create<MedicationState & MedicationActions>((set, get) => ({
  medications: MOCK_MEDICATIONS,
  logs: INITIAL_LOGS,
  
  addMedication: (medData) => set((state) => ({
    medications: [
      ...state.medications,
      {
        ...medData,
        id: `med-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
    ]
  })),
  
  updateMedication: (id, updates) => set((state) => ({
    medications: state.medications.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),
  
  deleteMedication: (id) => set((state) => ({
    medications: state.medications.filter((m) => m.id !== id)
  })),
  
  toggleTaken: (medicationId, timeSlot, checkedBy) => {
    const today = getTodayDateString();
    const existingLog = get().logs.find(
      (l) => l.medicationId === medicationId && 
             l.takenAt.startsWith(today) && 
             (timeSlot === 'Khi khò khè / Khó thở' || new Date(l.takenAt).getUTCHours() === parseInt(timeSlot.split(':')[0]))
    );

    const med = get().medications.find(m => m.id === medicationId);
    if (!med) return;

    if (existingLog) {
      // Toggle back to pending (delete the log)
      set((state) => ({
        logs: state.logs.filter((l) => l.id !== existingLog.id)
      }));
      
      // Log to timeline
      useTimelineStore.getState().addActivity({
        familyId: 'fam-hanoi-99',
        actorId: 'user-lan-123',
        actorName: checkedBy,
        type: 'medication_missed',
        targetId: medicationId,
        targetName: med.name,
        subjectName: med.memberId === 'member-grandpa' ? 'Ông nội' : (med.memberId === 'member-daughter' ? 'Bé Út' : 'Papa'),
        message: `${checkedBy} đã hủy đánh dấu uống thuốc ${med.name} của ${med.memberId === 'member-grandpa' ? 'Ông nội' : (med.memberId === 'member-daughter' ? 'Bé Út' : 'Papa')}`,
      });
    } else {
      // Add taken log
      const newLog: MedicationLog = {
        id: `log-${Date.now()}`,
        medicationId,
        memberId: med.memberId,
        checkedBy,
        status: 'taken',
        takenAt: new Date().toISOString()
      };
      
      set((state) => ({
        logs: [...state.logs, newLog]
      }));

      // Add to care activities timeline
      useTimelineStore.getState().addActivity({
        familyId: 'fam-hanoi-99',
        actorId: 'user-lan-123',
        actorName: checkedBy,
        type: 'medication_taken',
        targetId: medicationId,
        targetName: med.name,
        subjectName: med.memberId === 'member-grandpa' ? 'Ông nội' : (med.memberId === 'member-daughter' ? 'Bé Út' : 'Papa'),
        message: `${checkedBy} đã xác nhận cho ${med.memberId === 'member-grandpa' ? 'Ông nội' : (med.memberId === 'member-daughter' ? 'Bé Út' : 'Papa')} uống ${med.name}`,
      });
    }
  },
  
  getLogsForDate: (dateStr) => {
    return get().logs.filter((l) => l.takenAt.startsWith(dateStr));
  }
}));

export default useMedicationStore;
