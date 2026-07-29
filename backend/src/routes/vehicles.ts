import { Router } from 'express';
import { auth } from '../middleware';
import { createVehicleController, listVehiclesController, searchVehiclesController } from '../controllers/vehicleController';

const router = Router();

router.get('/search', auth, searchVehiclesController);
router.get('/', auth, listVehiclesController);
router.post('/', auth, createVehicleController);

export default router;
