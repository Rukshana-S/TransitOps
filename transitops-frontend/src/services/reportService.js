import api from '@/services/api';

export const reportService = {
  getReports: async () => {
    const res = await api.get('/reports');
    return res.data;
  },
  createReport: async (data) => {
    const res = await api.post('/reports', data);
    return res.data;
  },
};
