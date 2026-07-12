import { prisma } from '../config/db.js';

export const getTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { id: 'desc' }
    });
    return res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  const { id, vehicle, driver, cargo, pickup, destination, distance, eta, status } = req.body;

  if (!vehicle || !driver || !pickup || !destination) {
    return res.status(400).json({ message: 'Missing required trip dispatcher fields' });
  }

  const generatedId = id || `TR-${Math.floor(1000 + Math.random() * 9000)}`;
  const tripStatus = status || 'Pending';

  try {
    const createdTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          id: generatedId,
          vehicle,
          driver,
          cargo: cargo || 'General Freight',
          pickup,
          destination,
          distance: distance || '15 km',
          eta: eta || '15:00',
          status: tripStatus
        }
      });

      const vId = vehicle.split(' ')[0];
      if (tripStatus === 'In Progress' || tripStatus === 'Assigned') {
        await tx.vehicle.updateMany({
          where: { id: vId },
          data: { status: 'on trip' }
        });
        await tx.driver.updateMany({
          where: { name: driver },
          data: { status: 'On Shift' }
        });
      }

      return trip;
    });

    return res.status(201).json(createdTrip);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  const { id } = req.params;
  const { vehicle, driver, cargo, pickup, destination, distance, eta, status } = req.body;

  try {
    const updatedTrip = await prisma.$transaction(async (tx) => {
      const existCheck = await tx.trip.findUnique({ where: { id } });
      if (!existCheck) {
        throw new Error('Trip record not found');
      }

      const updated = await tx.trip.update({
        where: { id },
        data: {
          vehicle: vehicle ?? existCheck.vehicle,
          driver: driver ?? existCheck.driver,
          cargo: cargo ?? existCheck.cargo,
          pickup: pickup ?? existCheck.pickup,
          destination: destination ?? existCheck.destination,
          distance: distance ?? existCheck.distance,
          eta: eta ?? existCheck.eta,
          status: status ?? existCheck.status,
        }
      });

      if (updated.status === 'Completed' || updated.status === 'Cancelled') {
        const vId = updated.vehicle.split(' ')[0];
        await tx.vehicle.updateMany({
          where: { id: vId },
          data: { status: 'available' }
        });
        await tx.driver.updateMany({
          where: { name: updated.driver },
          data: { status: 'Available' }
        });
      } else if (updated.status === 'In Progress' || updated.status === 'Assigned') {
        const vId = updated.vehicle.split(' ')[0];
        await tx.vehicle.updateMany({
          where: { id: vId },
          data: { status: 'on trip' }
        });
        await tx.driver.updateMany({
          where: { name: updated.driver },
          data: { status: 'On Shift' }
        });
      }

      return updated;
    });

    return res.status(200).json(updatedTrip);
  } catch (error) {
    if (error.message === 'Trip record not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id } });
      if (!trip) {
        throw new Error('Trip record not found');
      }

      const vId = trip.vehicle.split(' ')[0];
      await tx.vehicle.updateMany({
        where: { id: vId },
        data: { status: 'available' }
      });
      await tx.driver.updateMany({
        where: { name: trip.driver },
        data: { status: 'Available' }
      });

      await tx.trip.delete({ where: { id } });
    });

    return res.status(200).json({ message: 'Trip dispatcher log deleted' });
  } catch (error) {
    if (error.message === 'Trip record not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
