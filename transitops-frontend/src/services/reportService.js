import api from '@/services/api';

export const reportService = {
  getReports: async (search = '', category = 'all') => {
    const res = await api.get('/reports', { params: { search, category } });
    return res.data;
  },
  createReport: async (data) => {
    const res = await api.post('/reports', data);
    return res.data;
  },
  compileReport: async (category, format, title) => {
    const res = await api.post('/reports/compile', { category, format, title });
    return res.data;
  },
  deleteReport: async (id) => {
    const res = await api.delete(`/reports/${id}`);
    return res.data;
  }
};
