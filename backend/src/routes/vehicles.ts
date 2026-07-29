import { Router } from 'express';
import { auth, authorizeRoles } from '../middleware';
import {
	createVehicleController,
	deleteVehicleController,
	listVehiclesController,
	purchaseVehicleController,
	restockVehicleController,
	searchVehiclesController,
	updateVehicleController,
} from '../controllers/vehicleController';

const router = Router();

router.get('/search', auth, searchVehiclesController);
router.get('/', auth, listVehiclesController);
router.put('/:id', auth, updateVehicleController);
router.post('/:id/purchase', auth, purchaseVehicleController);
router.post('/:id/restock', auth, authorizeRoles('ADMIN'), restockVehicleController);
router.delete('/:id', auth, authorizeRoles('ADMIN'), deleteVehicleController);
router.post('/', auth, createVehicleController);

export default router;
