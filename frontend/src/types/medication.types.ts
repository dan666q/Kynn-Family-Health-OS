export type MedicationStatus = 'taken' | 'pending' | 'missed';

export interface Medication {
  id: string;
  memberId: string; // The person taking this medicine (e.g. Grandfather)
  name: string;
  dosage: string;   // e.g. "1 viên", "2 muỗng cafe"
  frequency: 'daily' | 'weekly' | 'custom';
  schedule: string[]; // e.g. ["08:00", "20:00"]
  notes?: string;   // e.g. "Uống sau khi ăn no"
  active: boolean;
  voiceNoteUrl?: string; // Voice instructions link
  voiceDuration?: number; // Duration of voice note in seconds
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  memberId: string;
  checkedBy: string; // Name of person who checked off (e.g. "Con Gái Lan")
  status: MedicationStatus;
  takenAt: string; // ISO DateTime
}
