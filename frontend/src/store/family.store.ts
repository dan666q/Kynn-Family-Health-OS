import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Family, Member } from '../types/family.types';
import familyApi from '../api/family.api';

interface FamilyActions {
  fetchFamily: () => Promise<void>;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (inviteCode: string) => Promise<void>;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<Member, 'id' | 'familyId'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => Member | undefined;
}

interface FamilyState {
  currentFamily: Family | null;
  members: Member[];
}

export const useFamilyStore = create<FamilyState & FamilyActions>()(
  persist(
    (set, get) => ({
      currentFamily: null,
      members: [],
  
  fetchFamily: async () => {
    try {
      const res = await familyApi.getFamily();
      if (res.status === 'success') {
        // Backend returns { family: ... } or null
        const family = res.data.family;
        set({ currentFamily: family });
      }
    } catch (err) {
      console.error('Failed to fetch family:', err);
    }
  },

  createFamily: async (name) => {
    try {
      const res = await familyApi.createFamily(name);
      if (res.status === 'success' && res.data) {
        set({ currentFamily: res.data.family });
      }
    } catch (err) {
      console.error('Failed to create family:', err);
      throw err;
    }
  },

  joinFamily: async (inviteCode) => {
    try {
      const res = await familyApi.joinFamily(inviteCode);
      if (res.status === 'success' && res.data) {
        set({ currentFamily: res.data.family });
        // Retrieve new family members
        await get().fetchMembers();
      }
    } catch (err) {
      console.error('Failed to join family:', err);
      throw err;
    }
  },

  fetchMembers: async () => {
    try {
      const res = await familyApi.getMembers();
      if (res.status === 'success' && res.data) {
        set({ members: res.data.members });
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  },
  
  addMember: async (memberData) => {
    try {
      const res = await familyApi.createMember(memberData as any);
      if (res.status === 'success') {
        await get().fetchMembers();
      }
    } catch (err) {
      console.error('Failed to add member:', err);
      throw err;
    }
  },
  
  updateMember: async (id, updates) => {
    try {
      const res = await familyApi.updateMember(id, updates);
      if (res.status === 'success') {
        await get().fetchMembers();
      }
    } catch (err) {
      console.error('Failed to update member:', err);
      throw err;
    }
  },

  deleteMember: async (id) => {
    try {
      const res = await familyApi.deleteMember(id);
      if (res.status === 'success') {
        await get().fetchMembers();
      }
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  },
  
  getMemberById: (id) => {
    return get().members.find((m) => m.id === id || (m as any)._id === id);
  }
    }),
    {
      name: 'kynn-family-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useFamilyStore;
