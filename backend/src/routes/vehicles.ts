import { Router } from 'express';
import { auth } from '../middleware';
import {
	createVehicleController,
	listVehiclesController,
	searchVehiclesController,
	updateVehicleController,
} from '../controllers/vehicleController';

const router = Router();

router.get('/search', auth, searchVehiclesController);
router.get('/', auth, listVehiclesController);
router.put('/:id', auth, updateVehicleController);
router.post('/', auth, createVehicleController);

export default router;
