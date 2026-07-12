import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

import { login, logout, getProfile, register } from '../controllers/authController.js';
import { getOverview } from '../controllers/dashboardController.js';
import { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../controllers/driverController.js';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';
import { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } from '../controllers/maintenanceController.js';
import { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog } from '../controllers/fuelController.js';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { getReports, createReport, deleteReport, exportAllReports } from '../controllers/reportController.js';
import { getNotifications, createNotification, markAsRead } from '../controllers/notificationController.js';
import { syncAnalytics, exportAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// 1. Auth routes
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/logout', logout);
router.get('/auth/profile', protect, getProfile);

// 2. Dashboard routes (Accessible by all roles)
router.get('/dashboard/overview', protect, getOverview);

// 3. Vehicles routes (Fleet Manager: Full CRUD, Others: Read-only)
router.get('/vehicles', protect, getVehicles);
router.get('/vehicles/:id', protect, getVehicleById);
router.post('/vehicles', protect, restrictTo('Fleet Manager'), createVehicle);
router.put('/vehicles/:id', protect, restrictTo('Fleet Manager'), updateVehicle);
router.delete('/vehicles/:id', protect, restrictTo('Fleet Manager'), deleteVehicle);

// 4. Drivers routes (Fleet Manager / Safety Officer: CRUD, Others: Read-only)
router.get('/drivers', protect, getDrivers);
router.post('/drivers', protect, restrictTo('Fleet Manager', 'Safety Officer'), createDriver);
router.put('/drivers/:id', protect, restrictTo('Fleet Manager', 'Safety Officer'), updateDriver);
router.delete('/drivers/:id', protect, restrictTo('Fleet Manager', 'Safety Officer'), deleteDriver);

// 5. Trips routes (Fleet Manager / Dispatcher: CRUD, Others: Read-only)
router.get('/trips', protect, getTrips);
router.post('/trips', protect, restrictTo('Fleet Manager', 'Dispatcher'), createTrip);
router.put('/trips/:id', protect, restrictTo('Fleet Manager', 'Dispatcher'), updateTrip);
router.delete('/trips/:id', protect, restrictTo('Fleet Manager', 'Dispatcher'), deleteTrip);

// 6. Maintenance routes (Fleet Manager / Safety Officer: CRUD, Others: Read-only)
router.get('/maintenance', protect, getMaintenance);
router.post('/maintenance', protect, restrictTo('Fleet Manager', 'Safety Officer'), createMaintenance);
router.put('/maintenance/:id', protect, restrictTo('Fleet Manager', 'Safety Officer'), updateMaintenance);
router.delete('/maintenance/:id', protect, restrictTo('Fleet Manager', 'Safety Officer'), deleteMaintenance);

// 7. Fuel routes (Fleet Manager / Financial Analyst: CRUD, Others: Read-only)
router.get('/fuel', protect, getFuelLogs);
router.post('/fuel', protect, restrictTo('Fleet Manager', 'Financial Analyst'), createFuelLog);
router.put('/fuel/:id', protect, restrictTo('Fleet Manager', 'Financial Analyst'), updateFuelLog);
router.delete('/fuel/:id', protect, restrictTo('Fleet Manager', 'Financial Analyst'), deleteFuelLog);

// 8. Expenses routes (Fleet Manager / Financial Analyst: CRUD, Others: Read-only)
router.get('/expenses', protect, getExpenses);
router.post('/expenses', protect, restrictTo('Fleet Manager', 'Financial Analyst'), createExpense);
router.put('/expenses/:id', protect, restrictTo('Fleet Manager', 'Financial Analyst'), updateExpense);
router.delete('/expenses/:id', protect, restrictTo('Fleet Manager', 'Financial Analyst'), deleteExpense);

// 9. Reports routes (Fleet Manager / Financial Analyst: CRUD, Others: Read-only)
router.get('/reports', protect, getReports);
router.post('/reports', protect, restrictTo('Fleet Manager', 'Financial Analyst'), createReport);
router.post('/reports/compile', protect, restrictTo('Fleet Manager', 'Financial Analyst'), createReport);
router.post('/reports/export-all', protect, restrictTo('Fleet Manager', 'Financial Analyst'), exportAllReports);
router.delete('/reports/:id', protect, restrictTo('Fleet Manager', 'Financial Analyst'), deleteReport);

// 10. Analytics routes
router.get('/analytics/sync', protect, syncAnalytics);
router.get('/analytics/export', protect, exportAnalytics);

// 11. Notifications routes
router.get('/notifications', protect, getNotifications);
router.post('/notifications', protect, createNotification);
router.put('/notifications/:id/read', protect, markAsRead);

export default router;
