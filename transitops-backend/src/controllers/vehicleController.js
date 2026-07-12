import { prisma } from '../config/db.js';

export const getVehicles = async (req, res, next) => {
  const { search, status } = req.query;
  try {
    const where = {};
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { reg_number: { contains: search, mode: 'insensitive' } },
        { driver: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        driver: {
          select: { name: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    const formatted = vehicles.map(v => ({
      ...v,
      driver: v.driver?.name || 'Not Assigned'
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { driver: { select: { name: true } } }
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({
      ...vehicle,
      driver: vehicle.driver?.name || 'Not Assigned'
    });
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  const { 
    id, regNumber, type, manufacturer, model, 
    manufacturingYear, fuelType, mileage, fuel, 
    capacity, status, currentLocation, notes 
  } = req.body;

  if (!id || !regNumber || !model) {
    return res.status(400).json({ message: 'Missing required vehicle fields (Asset Code, Reg Number, Model)' });
  }

  try {
    const existCheck = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { id },
          { reg_number: regNumber }
        ]
      }
    });

    if (existCheck) {
      return res.status(400).json({ message: 'Vehicle ID or registration number already registered' });
    }

    const created = await prisma.vehicle.create({
      data: {
        id,
        reg_number: regNumber,
        type,
        manufacturer: manufacturer || null,
        model,
        manufacturing_year: manufacturingYear ? parseInt(manufacturingYear) : null,
        fuel_type: fuelType || null,
        mileage: mileage || '0 km',
        fuel: fuel || '100%',
        capacity: capacity ? parseInt(capacity) : null,
        status: status || 'available',
        current_location: currentLocation || null,
        notes: notes || null,
      }
    });

    return res.status(201).json({ ...created, driver: 'Not Assigned' });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { 
    reg_number, type, manufacturer, model, 
    manufacturing_year, fuel_type, mileage, fuel, 
    capacity, status, current_location, notes 
  } = req.body;

  try {
    const existCheck = await prisma.vehicle.findUnique({ where: { id } });
    if (!existCheck) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        reg_number: reg_number ?? existCheck.reg_number,
        type: type ?? existCheck.type,
        manufacturer: manufacturer ?? existCheck.manufacturer,
        model: model ?? existCheck.model,
        manufacturing_year: manufacturing_year ? parseInt(manufacturing_year) : existCheck.manufacturing_year,
        fuel_type: fuel_type ?? existCheck.fuel_type,
        mileage: mileage ?? existCheck.mileage,
        fuel: fuel ?? existCheck.fuel,
        capacity: capacity ? parseInt(capacity) : existCheck.capacity,
        status: status ?? existCheck.status,
        current_location: current_location ?? existCheck.current_location,
        notes: notes ?? existCheck.notes,
      },
      include: { driver: { select: { name: true } } }
    });

    return res.status(200).json({
      ...updated,
      driver: updated.driver?.name || 'Not Assigned'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  const { id } = req.params;
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await prisma.$transaction(async (tx) => {
      if (vehicle.assigned_driver_id) {
        await tx.driver.update({
          where: { id: vehicle.assigned_driver_id },
          data: { assigned_vehicle_id: null }
        });
      }
      await tx.vehicle.delete({ where: { id } });
    });

    return res.status(200).json({ message: 'Vehicle decommissioned and deleted' });
  } catch (error) {
    next(error);
  }
};
