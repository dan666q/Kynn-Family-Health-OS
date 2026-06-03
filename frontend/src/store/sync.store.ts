import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicationApi from '../api/medication.api';

export interface SyncItem {
  id: string;
  action: 'toggle_medication_log' | 'create_medication';
  payload: any;
  createdAt: string;
}

interface SyncState {
  queue: SyncItem[];
  isOnline: boolean;
  isSyncing: boolean;
}

interface SyncActions {
  addToQueue: (action: SyncItem['action'], payload: any) => void;
  removeFromQueue: (id: string) => void;
  setOnlineStatus: (status: boolean) => void;
  syncOfflineData: () => Promise<void>;
}

export const useSyncStore = create<SyncState & SyncActions>()(
  persist(
    (set, get) => ({
      queue: [],
      isOnline: true,
      isSyncing: false,

      addToQueue: (action, payload) => {
        const newItem: SyncItem = {
          id: `sync-${Date.now()}`,
          action,
          payload,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          queue: [...state.queue, newItem]
        }));
        console.log(`[Sync Store] Action added to offline queue: ${action}`, payload);
      },

      removeFromQueue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id)
        }));
      },

      setOnlineStatus: (status) => set({ isOnline: status }),

      syncOfflineData: async () => {
        const { queue, isSyncing, isOnline } = get();
        if (queue.length === 0 || isSyncing || !isOnline) return;

        set({ isSyncing: true });
        console.log(`[Sync Store] Starting sync for ${queue.length} offline actions...`);

        // Process queue items sequentially
        const failedItems: SyncItem[] = [];

        for (const item of queue) {
          try {
            if (item.action === 'toggle_medication_log') {
              const { medicationId, status, timeSlot, dateStr } = item.payload;
              await medicationApi.toggleLog(medicationId, status, timeSlot, dateStr);
            } else if (item.action === 'create_medication') {
              await medicationApi.createMedication(item.payload);
            }
            console.log(`[Sync Store] Successfully synchronized offline action: ${item.action}`);
          } catch (err) {
            console.error(`[Sync Store] Failed to sync action ${item.id}:`, err);
            failedItems.push(item);
          }
        }

        set({
          queue: failedItems,
          isSyncing: false
        });
        console.log(`[Sync Store] Sync completed. Remaining in queue: ${failedItems.length}`);
      }
    }),
    {
      name: 'kynn-sync-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useSyncStore;
