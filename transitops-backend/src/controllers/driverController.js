import { prisma } from '../config/db.js';

export const getDrivers = async (req, res, next) => {
  const { search, status } = req.query;
  try {
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { license: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { vehicles: { some: { model: { contains: search, mode: 'insensitive' } } } }
      ];
    }
    if (status && status !== 'all') {
      where.status = { contains: status, mode: 'insensitive' };
    }

    const drivers = await prisma.driver.findMany({
      where,
      include: {
        vehicles: {
          select: { id: true, model: true },
          take: 1
        }
      },
      orderBy: { id: 'desc' }
    });

    const formatted = drivers.map(d => {
      const v = d.vehicles && d.vehicles.length > 0 ? d.vehicles[0] : null;
      return {
        ...d,
        vehicle: v ? `${v.id} (${v.model})` : 'Not Assigned'
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (req, res, next) => {
  const { id, name, employeeId, license, licenseExpiry, phone, email, joiningDate, status, safetyScore } = req.body;

  if (!name || !license || !phone) {
    return res.status(400).json({ message: 'Missing required driver fields (Name, License, Phone)' });
  }

  const generatedId = id || `DR-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const existCheck = await prisma.driver.findFirst({
      where: {
        OR: [
          { id: generatedId },
          { license }
        ]
      }
    });

    if (existCheck) {
      return res.status(400).json({ message: 'Driver ID or license already registered' });
    }

    let parsedJoiningDate = joiningDate ? new Date(joiningDate) : new Date();
    let parsedExpiryDate = licenseExpiry ? new Date(licenseExpiry) : null;

    const created = await prisma.driver.create({
      data: {
        id: generatedId,
        name,
        employee_id: employeeId || null,
        license,
        license_expiry: parsedExpiryDate,
        phone,
        email: email || null,
        joining_date: parsedJoiningDate,
        status: status || 'Available',
        safety_score: safetyScore ? parseInt(safetyScore) : 90,
      }
    });

    return res.status(201).json({ ...created, vehicle: 'Not Assigned' });
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  const { id } = req.params;
  const { name, employee_id, license, license_expiry, phone, email, joining_date, status, safety_score } = req.body;

  try {
    const existCheck = await prisma.driver.findUnique({ where: { id } });
    if (!existCheck) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    let parsedJoiningDate = joining_date ? new Date(joining_date) : existCheck.joining_date;
    let parsedExpiryDate = license_expiry ? new Date(license_expiry) : existCheck.license_expiry;

    const updated = await prisma.driver.update({
      where: { id },
      data: {
        name: name ?? existCheck.name,
        employee_id: employee_id ?? existCheck.employee_id,
        license: license ?? existCheck.license,
        license_expiry: parsedExpiryDate,
        phone: phone ?? existCheck.phone,
        email: email ?? existCheck.email,
        joining_date: parsedJoiningDate,
        status: status ?? existCheck.status,
        safety_score: safety_score ? parseInt(safety_score) : existCheck.safety_score,
      },
      include: {
        vehicles: { select: { id: true, model: true }, take: 1 }
      }
    });

    const v = updated.vehicles && updated.vehicles.length > 0 ? updated.vehicles[0] : null;

    return res.status(200).json({
      ...updated,
      vehicle: v ? `${v.id} (${v.model})` : 'Not Assigned'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  const { id } = req.params;
  try {
    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    await prisma.$transaction(async (tx) => {
      if (driver.assigned_vehicle_id) {
        await tx.vehicle.update({
          where: { id: driver.assigned_vehicle_id },
          data: { assigned_driver_id: null }
        });
      }
      await tx.driver.delete({ where: { id } });
    });

    return res.status(200).json({ message: 'Driver profile deleted' });
  } catch (error) {
    next(error);
  }
};
