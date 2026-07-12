import api from '@/services/api';

export const expenseService = {
  getExpenses: async () => {
    const res = await api.get('/expenses');
    return res.data;
  },
  createExpense: async (data) => {
    const res = await api.post('/expenses', data);
    return res.data;
  },
  updateExpense: async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data);
    return res.data;
  },
  deleteExpense: async (id) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },
};
