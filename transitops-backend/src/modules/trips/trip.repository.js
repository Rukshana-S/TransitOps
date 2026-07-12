import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tripRepository = {
  create: async (data) => {
    // Generate tripCode like 'TRP-12345'
    const tripCode = `TRP-${Math.floor(10000 + Math.random() * 90000)}`;
    return prisma.trip.create({
      data: {
        ...data,
        tripCode,
      },
    });
  },

  findAll: async (filters = {}) => {
    const { search, status, vehicleId, driverId, startDate, endDate } = filters;
    const where = {};

    if (search) {
      where.OR = [
        { tripCode: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return prisma.trip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: async (id) => {
    return prisma.trip.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.trip.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return prisma.trip.delete({ where: { id } });
  },
};
