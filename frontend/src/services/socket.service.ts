import { io, Socket } from 'socket.io-client';
import useAuthStore from '../store/auth.store';
import useFamilyStore from '../store/family.store';
import useMedicationStore from '../store/medication.store';
import useTimelineStore from '../store/timeline.store';

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    const { token, isAuthenticated } = useAuthStore.getState();
    const { currentFamily } = useFamilyStore.getState();

    if (!isAuthenticated || !token || !currentFamily) {
      console.warn('[Socket Service] Cannot connect: missing auth or family context');
      return;
    }

    if (socket) {
      console.log('[Socket Service] Already connected');
      return;
    }

    // Connect to host machine IP address
    const SOCKET_URL = 'http://192.168.2.4:5000';
    console.log(`[Socket Service] Connecting to Socket.IO server at: ${SOCKET_URL}`);

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'], // Force WebSocket for React Native compatibility
      query: { token }
    });

    socket.on('connect', () => {
      console.log('[Socket Service] Connected to server successfully. Socket ID:', socket?.id);
      
      // Join family room
      const familyId = (currentFamily as any)._id || currentFamily.id;
      if (familyId) {
        socket?.emit('join_family', familyId);
      }
    });

    // Listen for medication changes
    socket.on('medication_updated', () => {
      console.log('[Socket Event] Medication updated received. Re-fetching medications...');
      useMedicationStore.getState().fetchMedications().catch(() => {});
      useMedicationStore.getState().fetchLogs().catch(() => {});
    });

    // Listen for family changes
    socket.on('family_updated', () => {
      console.log('[Socket Event] Family updated received. Re-fetching family members...');
      useFamilyStore.getState().fetchMembers().catch(() => {});
    });

    // Listen for timeline updates
    socket.on('timeline_updated', () => {
      console.log('[Socket Event] Timeline updated received. Re-fetching activities...');
      useTimelineStore.getState().fetchActivities().catch(() => {});
    });

    socket.on('disconnect', () => {
      console.log('[Socket Service] Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket Service] Connection error:', error);
    });
  },

  disconnect: () => {
    if (socket) {
      console.log('[Socket Service] Disconnecting Socket.IO client');
      socket.disconnect();
      socket = null;
    }
  }
};

export default socketService;
