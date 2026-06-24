export type ActivityType =
  | 'medication_taken'
  | 'medication_missed'
  | 'medication_added'
  | 'medication_updated'
  | 'medication_deleted'
  | 'document_uploaded'
  | 'document_deleted'
  | 'symptom_logged'
  | 'symptom_log'
  | 'voice_added'
  | 'voice_note_added'
  | 'member_created'
  | 'member_updated'
  | 'appointment_created'
  | 'appointment_deleted';

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
  isOfflinePending?: boolean;
}
