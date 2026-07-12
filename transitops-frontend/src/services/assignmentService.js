import api from './api';

export const assignmentService = {
  getAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },

  createAssignment: async (vehicleId, driverId) => {
    const response = await api.post('/assignments', { vehicleId, driverId });
    return response.data;
  },

  deleteAssignment: async (vehicleId) => {
    const response = await api.delete(`/assignments/${vehicleId}`);
    return response.data;
  }
};
