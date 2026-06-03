import axiosInstance from './axios';

export const familyApi = {
  // Family APIs
  getFamily: async () => {
    const response = await axiosInstance.get('/family');
    return response.data;
  },

  createFamily: async (name: string) => {
    const response = await axiosInstance.post('/family', { name });
    return response.data;
  },

  joinFamily: async (inviteCode: string) => {
    const response = await axiosInstance.post('/family/join', { inviteCode });
    return response.data;
  },

  // Member APIs
  getMembers: async () => {
    const response = await axiosInstance.get('/members');
    return response.data;
  },

  createMember: async (memberData: {
    fullName: string;
    role: string;
    birthday?: string;
    bloodType?: string;
    allergies?: string[];
    chronicDiseases?: string[];
    emergencyContact?: { name: string; phone: string; relationship: string };
    avatar?: string;
  }) => {
    const response = await axiosInstance.post('/members', memberData);
    return response.data;
  },

  updateMember: async (id: string, memberData: any) => {
    const response = await axiosInstance.put(`/members/${id}`, memberData);
    return response.data;
  },

  deleteMember: async (id: string) => {
    const response = await axiosInstance.delete(`/members/${id}`);
    return response.data;
  }
};

export default familyApi;
