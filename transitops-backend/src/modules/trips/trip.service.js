import { tripRepository } from './trip.repository.js';

const mockCheckAvailability = async (vehicleId, driverId) => {
  // Mocking the check since Vehicle and Driver modules are external/not yet implemented.
  // In a real scenario, this would call vehicleService.checkStatus(vehicleId) 
  // and driverService.checkStatus(driverId).
  if (!vehicleId || !driverId) throw new Error('Vehicle and Driver are required');
  // Assume available
  return true;
};

export const tripService = {
  createTrip: async (data) => {
    await mockCheckAvailability(data.vehicleId, data.driverId);
    // Force status to DRAFT on creation
    data.status = 'DRAFT';
    return tripRepository.create(data);
  },

  getAllTrips: async (filters) => {
    return tripRepository.findAll(filters);
  },

  getTripById: async (id) => {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new Error('Trip not found');
    return trip;
  },

  updateTrip: async (id, data) => {
    const existing = await tripRepository.findById(id);
    if (!existing) throw new Error('Trip not found');
    
    // Cannot modify completed or cancelled trips
    if (['COMPLETED', 'CANCELLED'].includes(existing.status)) {
      throw new Error(`Cannot update trip in ${existing.status} status`);
    }

    if (data.vehicleId || data.driverId) {
      await mockCheckAvailability(
        data.vehicleId || existing.vehicleId,
        data.driverId || existing.driverId
      );
    }
    return tripRepository.update(id, data);
  },

  updateStatus: async (id, newStatus) => {
    const existing = await tripRepository.findById(id);
    if (!existing) throw new Error('Trip not found');

    const current = existing.status;
    const validTransitions = {
      DRAFT: ['DISPATCHED', 'CANCELLED'],
      DISPATCHED: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[current].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${current} to ${newStatus}`);
    }

    return tripRepository.update(id, { status: newStatus });
  },

  deleteTrip: async (id) => {
    const existing = await tripRepository.findById(id);
    if (!existing) throw new Error('Trip not found');
    if (['COMPLETED', 'CANCELLED'].includes(existing.status)) {
      throw new Error(`Cannot delete trip in ${existing.status} status`);
    }
    return tripRepository.delete(id);
  },
};
