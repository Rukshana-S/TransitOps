import api from '@/services/api';

export const fuelService = {
  getFuelLogs: async () => {
    const res = await api.get('/fuel');
    return res.data;
  },
  createFuelLog: async (data) => {
    const res = await api.post('/fuel', data);
    return res.data;
  },
  updateFuelLog: async (id, data) => {
    const res = await api.put(`/fuel/${id}`, data);
    return res.data;
  },
  deleteFuelLog: async (id) => {
    const res = await api.delete(`/fuel/${id}`);
    return res.data;
  },
};
