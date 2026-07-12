import api from '@/services/api';

export const dashboardService = {
  getOverview: async () => {
    const res = await api.get('/dashboard/overview');
    return res.data;
  },
};
