import { create } from 'zustand';
import { Family, Member } from '../types/family.types';

interface FamilyActions {
  setCurrentFamily: (family: Family) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  getMemberById: (id: string) => Member | undefined;
}

const MOCK_FAMILY: Family = {
  id: 'fam-hanoi-99',
  name: 'Gia Đình Hoàng Hà',
  avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?w=200',
  ownerId: 'user-lan-123',
  inviteCode: 'KYNN-HANOI-88',
  createdAt: '2026-05-01T00:00:00Z',
};

const MOCK_MEMBERS: Member[] = [
  {
    id: 'member-grandpa',
    familyId: 'fam-hanoi-99',
    role: 'Ông',
    fullName: 'Hoàng Văn Nội (Ông Nội)',
    birthday: '1945-10-12',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Cua biển'],
    chronicDiseases: ['Cao huyết áp', 'Tiểu đường Type 2'],
    emergencyContact: {
      name: 'Lê Hoàng Lan (Con gái)',
      relationship: 'Con gái',
      phone: '0987.654.321',
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', // Elder grandfather avatar
    insuranceId: 'GD4010123456789',
    idCardNumber: '001045000123'
  },
  {
    id: 'member-daughter',
    familyId: 'fam-hanoi-99',
    role: 'Em',
    fullName: 'Hoàng Bé Bắp (Bé Út)',
    birthday: '2020-05-15',
    bloodType: 'O+',
    allergies: ['Bột giặt Comfort', 'Đậu phộng'],
    chronicDiseases: ['Hen phế quản nhẹ'],
    emergencyContact: {
      name: 'Lê Hoàng Lan (Mẹ)',
      relationship: 'Mẹ',
      phone: '0987.654.321',
    },
    avatar: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150',
    insuranceId: 'TE1010567890123',
    idCardNumber: 'Chưa có'
  },
  {
    id: 'member-father',
    familyId: 'fam-hanoi-99',
    role: 'Ba',
    fullName: 'Hoàng Văn Sơn (Papa)',
    birthday: '1972-03-24',
    bloodType: 'A+',
    allergies: ['Không dị ứng'],
    chronicDiseases: ['Gout nhẹ'],
    emergencyContact: {
      name: 'Lê Hoàng Lan (Vợ)',
      relationship: 'Vợ',
      phone: '0987.654.321',
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    insuranceId: 'DN4010155556666',
    idCardNumber: '001072000456'
  }
];

interface FamilyState {
  currentFamily: Family | null;
  members: Member[];
}

export const useFamilyStore = create<FamilyState & FamilyActions>((set, get) => ({
  currentFamily: MOCK_FAMILY,
  members: MOCK_MEMBERS,
  
  setCurrentFamily: (family) => set({ currentFamily: family }),
  
  addMember: (memberData) => set((state) => ({
    members: [
      ...state.members,
      {
        ...memberData,
        id: `member-${Date.now()}`,
      }
    ]
  })),
  
  updateMember: (id, updates) => set((state) => ({
    members: state.members.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),
  
  getMemberById: (id) => {
    return get().members.find((m) => m.id === id);
  }
}));

export default useFamilyStore;
