import { z } from 'zod';

export const createTripSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  cargoWeight: z.number().min(0.1, 'Cargo weight must be greater than 0'),
  plannedDistance: z.number().min(0.1, 'Planned distance must be greater than 0'),
});

export const updateTripSchema = createTripSchema.partial();

export const updateTripStatusSchema = z.object({
  status: z.enum(['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED']),
});
