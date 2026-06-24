import axiosInstance from './axios';

export const documentApi = {
  getDocuments: async () => {
    const response = await axiosInstance.get('/documents');
    return response.data;
  },
  uploadDocument: async (formData: FormData) => {
    const response = await axiosInstance.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteDocument: async (id: string) => {
    const response = await axiosInstance.delete(`/documents/${id}`);
    return response.data;
  }
};

export default documentApi;
