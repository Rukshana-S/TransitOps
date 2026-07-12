import api from '@/services/api';

export const maintenanceService = {
  getMaintenance: async () => {
    const res = await api.get('/maintenance');
    return res.data;
  },
  createMaintenance: async (data) => {
    const res = await api.post('/maintenance', data);
    return res.data;
  },
  updateMaintenance: async (id, data) => {
    const res = await api.put(`/maintenance/${id}`, data);
    return res.data;
  },
  deleteMaintenance: async (id) => {
    const res = await api.delete(`/maintenance/${id}`);
    return res.data;
  },
};
