import { Router } from 'express';
import authRouter from './auth';

const router = Router();

// Mount auth routes under /auth
router.use('/auth', authRouter);

export default router;
