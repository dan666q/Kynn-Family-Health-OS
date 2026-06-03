import axiosInstance from './axios';

export const medicationApi = {
  getMedications: async () => {
    const response = await axiosInstance.get('/medications');
    return response.data;
  },

  createMedication: async (medData: {
    memberId: string;
    name: string;
    dosage: string;
    frequency: string;
    schedule: string[];
    notes?: string;
    active?: boolean;
    voiceNoteUrl?: string;
    voiceDuration?: number;
  }) => {
    const response = await axiosInstance.post('/medications', medData);
    return response.data;
  },

  updateMedication: async (id: string, medData: any) => {
    const response = await axiosInstance.put(`/medications/${id}`, medData);
    return response.data;
  },

  deleteMedication: async (id: string) => {
    const response = await axiosInstance.delete(`/medications/${id}`);
    return response.data;
  },

  // Toggle log confirmation
  toggleLog: async (medicationId: string, status: 'taken' | 'missed' | 'skipped', timeSlot: string, dateStr?: string) => {
    const response = await axiosInstance.post('/medications/toggle-log', { medicationId, status, timeSlot, dateStr });
    return response.data;
  },

  // Retrieve logs
  getLogs: async (dateStr?: string) => {
    const query = dateStr ? `?date=${dateStr}` : '';
    const response = await axiosInstance.get(`/medications/logs${query}`);
    return response.data;
  }
};

export default medicationApi;
