import axiosInstance from './axios';

export const timelineApi = {
  getActivities: async () => {
    const response = await axiosInstance.get('/timeline');
    return response.data;
  }
};

export default timelineApi;
