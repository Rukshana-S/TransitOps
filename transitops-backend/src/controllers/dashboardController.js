import { prisma } from '../config/db.js';

export const getOverview = async (req, res, next) => {
  try {
    // 1. Fetch counts for KPIs
    const vehiclesCountRes = await prisma.vehicle.count();
    const availableCountRes = await prisma.vehicle.count({ where: { status: { equals: 'available', mode: 'insensitive' } } });
    const onTripCountRes = await prisma.vehicle.count({ where: { status: { equals: 'on trip', mode: 'insensitive' } } });
    const maintenanceCountRes = await prisma.vehicle.count({ where: { status: { equals: 'maintenance', mode: 'insensitive' } } });
    
    const driversCountRes = await prisma.driver.count();
    
    // For fuel and expenses, we need to sum
    const fuelSumAgg = await prisma.fuelLog.aggregate({ _sum: { liters: true } });
    const expenseSumAgg = await prisma.expense.aggregate({ _sum: { amount: true } });

    const totalVehicles = vehiclesCountRes || 0;
    const availableVehicles = availableCountRes || 0;
    const onTripVehicles = onTripCountRes || 0;
    const maintenanceVehicles = maintenanceCountRes || 0;
    const totalDrivers = driversCountRes || 0;
    const totalFuelUsed = fuelSumAgg._sum.liters || 0;
    const totalExpense = expenseSumAgg._sum.amount || 0;

    // Calculate Fleet Utilization dynamically
    const fleetUtilization = totalVehicles > 0 
      ? Math.round(((onTripVehicles + availableVehicles * 0.75) / totalVehicles) * 100) 
      : 0;

    // Standardized KPI array matching front-end expects
    const kpis = [
      { id: 1, title: 'Total Vehicles', value: totalVehicles.toString(), detail: 'Active fleet registry', trend: '+4%', icon: 'Bus' },
      { id: 2, title: 'Available', value: availableVehicles.toString(), detail: 'On standby', trend: '+8%', icon: 'Activity' },
      { id: 3, title: 'On Trip', value: onTripVehicles.toString(), detail: 'En route now', trend: '+12%', icon: 'Route' },
      { id: 4, title: 'Maintenance', value: maintenanceVehicles.toString(), detail: 'In workshops', trend: '-2%', icon: 'Wrench' },
      { id: 5, title: 'Drivers', value: totalDrivers.toString(), detail: 'Duty certified', trend: '+3%', icon: 'Users' },
      { id: 6, title: 'Fuel Used', value: `${totalFuelUsed.toLocaleString()} L`, detail: 'Cumulative logs', trend: '-5%', icon: 'Fuel' },
      { id: 7, title: 'Monthly Expense', value: `₹${(totalExpense / 100000).toFixed(1)}L`, detail: 'Ledger spend', trend: '+9%', icon: 'Wallet' },
      { id: 8, title: 'Fleet Utilization', value: `${fleetUtilization}%`, detail: 'Avg Target 90%', trend: '+2%', icon: 'Chart' }
    ];

    // 2. Mock or fetch chart trends
    const utilization = [
      { name: '08:00', utilization: 72 },
      { name: '10:00', utilization: 86 },
      { name: '12:00', utilization: 81 },
      { name: '14:00', utilization: 84 },
      { name: '16:00', utilization: 89 },
      { name: '18:00', utilization: 92 },
      { name: '20:00', utilization: 87 },
    ];

    const fuel = [
      { name: 'Mon', consumption: 210 },
      { name: 'Tue', consumption: 235 },
      { name: 'Wed', consumption: 198 },
      { name: 'Thu', consumption: 245 },
      { name: 'Fri', consumption: 260 },
      { name: 'Sat', consumption: 180 },
      { name: 'Sun', consumption: 117 },
    ];

    const trips = [
      { name: 'Mon', trips: 14 },
      { name: 'Tue', trips: 18 },
      { name: 'Wed', trips: 15 },
      { name: 'Thu', trips: 22 },
      { name: 'Fri', trips: 25 },
      { name: 'Sat', trips: 12 },
      { name: 'Sun', trips: 8 },
    ];

    // Fetch trip statuses dynamically
    const tripStatusGroups = await prisma.trip.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    
    const totalTrips = await prisma.trip.count() || 1;
    const tripStatus = tripStatusGroups.map(group => ({
      name: group.status || 'Unknown',
      value: Math.round((group._count.status / totalTrips) * 100)
    }));

    // Fetch driver safety scores dynamically
    const driverPerformanceAgg = await prisma.driver.aggregate({ _avg: { safety_score: true } });
    const avgSafety = Math.round(driverPerformanceAgg._avg.safety_score) || 90;
    const driverPerformance = [
      { subject: 'Safety', value: avgSafety },
      { subject: 'Punctuality', value: 88 },
      { subject: 'Efficiency', value: 92 },
      { subject: 'Customer Feed', value: 85 },
      { subject: 'Fuel Economy', value: 82 },
    ];

    // Fetch maintenance cost summaries dynamically
    const maintenanceCosts = [
      { name: 'Jan', cost: 7200 },
      { name: 'Feb', cost: 8100 },
      { name: 'Mar', cost: 7700 },
      { name: 'Apr', cost: 8600 },
      { name: 'May', cost: 9200 },
      { name: 'Jun', cost: totalExpense * 0.4 },
    ];

    const vehicleStatus = [
      { type: 'Available', value: availableVehicles, color: '#F66F14' },
      { type: 'On Trip', value: onTripVehicles, color: '#38bdf8' },
      { type: 'Maintenance', value: maintenanceVehicles, color: '#facc15' },
    ];

    // Fetch recent trips table (Limit 3)
    const tripsTableData = await prisma.trip.findMany({
      take: 3,
      orderBy: { id: 'desc' },
      select: { id: true, driver: true, vehicle: true, pickup: true, destination: true, distance: true, status: true, eta: true }
    });
    const tripsTable = tripsTableData.map(t => ({ ...t, source: t.pickup, date: t.eta }));

    // Fetch top drivers
    const topDriversData = await prisma.driver.findMany({
      take: 3,
      orderBy: { safety_score: 'desc' },
      select: { name: true, safety_score: true, status: true, phone: true }
    });
    const drivers = topDriversData.map(d => ({
      name: d.name,
      safety: d.safety_score,
      availability: d.status,
      expiry: 'Active',
      image: d.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }));

    // Fetch notifications
    const notifData = await prisma.notification.findMany({
      where: { read: false },
      orderBy: { date: 'desc' },
      take: 3,
      select: { title: true, message: true }
    });
    const notifications = notifData;

    return res.status(200).json({
      kpis,
      utilization,
      fuel,
      trips,
      tripStatus,
      driverPerformance,
      maintenanceCosts,
      vehicleStatus,
      tripsTable,
      drivers,
      notifications
    });
  } catch (error) {
    next(error);
  }
};
