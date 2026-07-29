import { Router } from 'express';
import { auth } from '../middleware';
import { createVehicleController } from '../controllers/vehicleController';

const router = Router();

router.post('/', auth, createVehicleController);

export default router;
