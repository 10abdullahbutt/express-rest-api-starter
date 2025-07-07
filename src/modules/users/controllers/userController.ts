import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { asyncHandler } from '@/utils/asyncHandler';
import { UserService } from '../services/userService';

export class UserController {
  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
        },
      });
    }

    const user = await UserService.createUser(req.body);
    return res.status(201).json({
      success: true,
      data: user,
    });
  });

  static getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  });

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params['id']!);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  });

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
        },
      });
    }

    const user = await UserService.updateUser(req.params['id']!, req.body);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  });

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.deleteUser(req.params['id']!);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });
}

// Validation middleware
export const validateCreateUser = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]; 