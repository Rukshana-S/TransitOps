import api from '@/services/api';

export const tripService = {
  getTrips: async () => {
    const res = await api.get('/trips');
    return res.data;
  },
  createTrip: async (data) => {
    const res = await api.post('/trips', data);
    return res.data;
  },
  updateTrip: async (id, data) => {
    const res = await api.put(`/trips/${id}`, data);
    return res.data;
  },
  deleteTrip: async (id) => {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },
};
