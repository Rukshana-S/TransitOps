import { tripService } from './trip.service.js';
import { createTripSchema, updateTripSchema, updateTripStatusSchema } from './trip.validation.js';

export const tripController = {
  createTrip: async (req, res) => {
    try {
      const validatedData = createTripSchema.parse(req.body);
      const trip = await tripService.createTrip(validatedData);
      res.status(201).json({ success: true, data: trip });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAllTrips: async (req, res) => {
    try {
      const trips = await tripService.getAllTrips(req.query);
      res.status(200).json({ success: true, data: trips });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTripById: async (req, res) => {
    try {
      const trip = await tripService.getTripById(req.params.id);
      res.status(200).json({ success: true, data: trip });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  updateTrip: async (req, res) => {
    try {
      const validatedData = updateTripSchema.parse(req.body);
      const trip = await tripService.updateTrip(req.params.id, validatedData);
      res.status(200).json({ success: true, data: trip });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const validatedData = updateTripStatusSchema.parse(req.body);
      const trip = await tripService.updateStatus(req.params.id, validatedData.status);
      res.status(200).json({ success: true, data: trip });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteTrip: async (req, res) => {
    try {
      await tripService.deleteTrip(req.params.id);
      res.status(200).json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
