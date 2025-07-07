import { Router } from 'express';
import {
  UserController,
  validateCreateUser,
  validateUpdateUser,
} from '../controllers/userController';

const router = Router();

// GET /api/v1/users - Get all users
router.get('/', UserController.getAllUsers);

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// POST /api/v1/users - Create new user
router.post('/', validateCreateUser, UserController.createUser);

// PUT /api/v1/users/:id - Update user
router.put('/:id', validateUpdateUser, UserController.updateUser);

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

export default router; 