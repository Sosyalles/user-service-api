import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import logger from '../utils/logger';
import { ValidationError } from '../errors/AppError';
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from '../types/dto/UserDTO';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as CreateUserDTO;
      
      // Additional validation for required fields
      if (!userData.email || !userData.password || !userData.username) {
        throw new ValidationError('Email, password, and username are required');
      }

      const user = await this.userService.register(userData);
      if (!user) {
        throw new Error('Failed to create user');
      }

      logger.info(`User registered successfully with email: ${userData.email}`);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Error in register controller:', error);
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Additional validation
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const loginResponse = await this.userService.login({ email, password });
      if (!loginResponse || !loginResponse.token) {
        throw new Error('Login failed - invalid response');
      }

      logger.info(`User logged in successfully: ${email}`);
      res.json({
        status: 'success',
        message: 'Login successful',
        data: loginResponse,
      });
    } catch (error) {
      logger.error('Error in login controller:', error);
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const updateData = req.body as UpdateUserDTO;
      
      // Validate update data
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('No update data provided');
      }

      const updatedUser = await this.userService.updateUser(userId, updateData);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      logger.info(`User updated successfully: ${userId}`);
      res.json({
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      logger.error('Error in updateUser controller:', error);
      next(error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const passwordData = req.body as ChangePasswordDTO;
      
      // Validate password data
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        throw new ValidationError('Current password and new password are required');
      }

      if (passwordData.currentPassword === passwordData.newPassword) {
        throw new ValidationError('New password must be different from current password');
      }

      await this.userService.changePassword(userId, passwordData);

      logger.info(`Password changed successfully for user: ${userId}`);
      res.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
      });
    } catch (error) {
      logger.error('Error in changePassword controller:', error);
      next(error);
    }
  };

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const user = await this.userService.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`Profile retrieved successfully for user: ${userId}`);
      res.json({
        status: 'success',
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Error in getProfile controller:', error);
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      await this.userService.deleteUser(userId);

      logger.info(`User deleted successfully: ${userId}`);
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteUser controller:', error);
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate and parse query parameters
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const search = req.query.search as string | undefined;

      // Validate pagination parameters
      if (page !== undefined && page < 1) {
        throw new ValidationError('Page number must be greater than 0');
      }
      if (limit !== undefined && (limit < 1 || limit > 100)) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const result = await this.userService.getAllUsers(page, limit, search);
      if (!result || !result.users) {
        throw new Error('Failed to fetch users');
      }

      logger.info(`Retrieved ${result.users.length} users successfully`);
      res.json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: {
          users: result.users,
          total: result.total,
          page: page || 1,
          limit: limit || 10,
          totalPages: Math.ceil(result.total / (limit || 10)),
        },
      });
    } catch (error) {
      logger.error('Error in getAllUsers controller:', error);
      next(error);
    }
  };
} 