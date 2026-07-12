import { Router } from 'express';
import tripRoutes from '../modules/trips/trip.routes.js';

const router = Router();

// Mount trip routes
router.use('/trips', tripRoutes);

export default router;
