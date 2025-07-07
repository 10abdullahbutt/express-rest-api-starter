import { Router } from 'express';
import userRoutes from '../modules/users/routes';

const router = Router();

// Mount module routes
router.use('/users', userRoutes);

export default router;
