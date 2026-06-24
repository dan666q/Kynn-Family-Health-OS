import axiosInstance from './axios';

export interface CreateAppointmentDto {
  memberId: string;
  hospital: string;
  doctor?: string;
  appointmentDate: string;
  notes?: string;
}

export const appointmentApi = {
  getAppointments: async () => {
    const response = await axiosInstance.get('/appointments');
    return response.data;
  },
  createAppointment: async (data: CreateAppointmentDto) => {
    const response = await axiosInstance.post('/appointments', data);
    return response.data;
  },
  deleteAppointment: async (id: string) => {
    const response = await axiosInstance.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default appointmentApi;
