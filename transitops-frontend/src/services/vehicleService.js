import api from '@/services/api';

export const vehicleService = {
  getVehicles: async (search = '', status = 'all') => {
    const res = await api.get('/vehicles', { params: { search, status } });
    return res.data;
  },
  createVehicle: async (data) => {
    const res = await api.post('/vehicles', data);
    return res.data;
  },
  updateVehicle: async (id, data) => {
    const res = await api.put(`/vehicles/${id}`, data);
    return res.data;
  },
  deleteVehicle: async (id) => {
    const res = await api.delete(`/vehicles/${id}`);
    return res.data;
  },
};
