import axiosInstance from './axios';

export const timelineApi = {
  getActivities: async () => {
    const response = await axiosInstance.get('/timeline');
    return response.data;
  },
  logSymptom: async (data: { memberId: string; symptoms: string | string[]; temperature?: number; notes?: string }) => {
    const response = await axiosInstance.post('/timeline/symptom', data);
    return response.data;
  }
};

export default timelineApi;
