import axiosInstance from './axios';

export const authApi = {
  register: async (username: string, password: string, name: string, avatar?: string) => {
    const response = await axiosInstance.post('/auth/register', { username, password, name, avatar });
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },

  forgotPassword: async (username: string, inviteCode: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { username, inviteCode, newPassword });
    return response.data;
  }
};

export default authApi;
