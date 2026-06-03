import axiosInstance from './axios';

export const authApi = {
  register: async (email: string, password: string, name: string, avatar?: string) => {
    const response = await axiosInstance.post('/auth/register', { email, password, name, avatar });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  }
};

export default authApi;
