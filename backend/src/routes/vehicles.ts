import { Router } from 'express';
import { auth } from '../middleware';
import { createVehicleController, listVehiclesController } from '../controllers/vehicleController';

const router = Router();

router.get('/', auth, listVehiclesController);
router.post('/', auth, createVehicleController);

export default router;
