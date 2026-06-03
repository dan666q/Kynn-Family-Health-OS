export type ActivityType = 'medication_taken' | 'medication_missed' | 'symptom_log' | 'document_uploaded' | 'voice_note_added' | 'appointment_created';

export interface CareActivity {
  id: string;
  familyId: string;
  actorId: string;    // Person who did the action
  actorName: string;  // e.g. "Lan"
  type: ActivityType;
  targetId: string;   // The related medicine, document, or member
  targetName: string; // e.g. "Metformin", "Kết quả xét nghiệm máu"
  subjectName: string;// The patient e.g. "Ông nội"
  message: string;    // e.g. "Lan đã cho Ông nội uống Metformin"
  metadata?: any;     // Extra info
  createdAt: string;  // ISO DateTime
}
export interface MedicalDocument {
  id: string;
  memberId: string;
  uploadedBy: string;
  type: 'prescription' | 'lab_result' | 'insurance' | 'id_card' | 'hospital_record';
  fileUrl: string;
  fileName: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}
