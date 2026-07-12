import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const tripsService = {
  getTrips: async (filters = {}) => {
    const { data } = await axios.get(`${API_URL}/trips`, { params: filters });
    return data.data;
  },

  getTrip: async (id) => {
    const { data } = await axios.get(`${API_URL}/trips/${id}`);
    return data.data;
  },

  createTrip: async (payload) => {
    const { data } = await axios.post(`${API_URL}/trips`, payload);
    return data.data;
  },

  updateTrip: async (id, payload) => {
    const { data } = await axios.put(`${API_URL}/trips/${id}`, payload);
    return data.data;
  },

  updateStatus: async (id, status) => {
    const { data } = await axios.patch(`${API_URL}/trips/${id}/status`, { status });
    return data.data;
  },

  deleteTrip: async (id) => {
    const { data } = await axios.delete(`${API_URL}/trips/${id}`);
    return data;
  },
};
