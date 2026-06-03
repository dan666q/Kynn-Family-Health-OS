export type FamilyRole = 'Ông' | 'Bà' | 'Ba' | 'Mẹ' | 'Anh' | 'Chị' | 'Em' | 'Bác sĩ' | 'Người chăm sóc';

export interface Member {
  id: string;
  familyId: string;
  userId?: string; // Links to a registered account, optional for offline/elderly members
  role: FamilyRole;
  fullName: string;
  birthday: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  avatar: string; // URL or local asset key
  insuranceId?: string; // BHYT
  idCardNumber?: string; // CCCD
}

export interface Family {
  id: string;
  name: string;
  avatar: string;
  ownerId: string;
  inviteCode: string;
  createdAt: string;
}
