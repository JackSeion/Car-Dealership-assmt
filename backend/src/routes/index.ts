import { Router } from 'express';
import authRouter from './auth';
import vehiclesRouter from './vehicles';

const router = Router();

// Mount auth routes under /auth
router.use('/auth', authRouter);
router.use('/vehicles', vehiclesRouter);

export default router;
