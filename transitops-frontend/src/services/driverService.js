import api from '@/services/api';

export const driverService = {
  getDrivers: async (search = '', status = 'all') => {
    const res = await api.get('/drivers', { params: { search, status } });
    return res.data;
  },
  createDriver: async (data) => {
    const res = await api.post('/drivers', data);
    return res.data;
  },
  updateDriver: async (id, data) => {
    const res = await api.put(`/drivers/${id}`, data);
    return res.data;
  },
  deleteDriver: async (id) => {
    const res = await api.delete(`/drivers/${id}`);
    return res.data;
  },
};
