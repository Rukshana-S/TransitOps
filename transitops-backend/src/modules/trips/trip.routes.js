import { Router } from 'express';
import { tripController } from './trip.controller.js';

const router = Router();

router.post('/', tripController.createTrip);
router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.put('/:id', tripController.updateTrip);
router.patch('/:id/status', tripController.updateStatus);
router.delete('/:id', tripController.deleteTrip);

export default router;
