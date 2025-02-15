import { Request, Response, NextFunction } from 'express';
import { UserDetailService } from '../services/UserDetailService';
import logger from '../utils/logger';
import { ValidationError, ForbiddenError } from '../errors/AppError';
import { UpdateUserDetailDTO } from '../types/dto/UserDetailDTO';

export class UserDetailController {
  private userDetailService: UserDetailService;

  constructor() {
    this.userDetailService = new UserDetailService();
  }

  public getUserDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const userDetail = await this.userDetailService.getUserDetail(userId);
      
      logger.info(`User detail retrieved successfully for user: ${userId}`);
      res.json({
        status: 'success',
        message: 'User detail retrieved successfully',
        data: userDetail,
      });
    } catch (error) {
      logger.error('Error in getUserDetail controller:', error);
      next(error);
    }
  };

  public updateUserDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError('User ID is required');
      }
      console.log(req.body.socialLinks);

      const updateData: UpdateUserDetailDTO = {
        bio: req.body.bio,
        location: req.body.location,
        interests: req.body.interests,
        socialLinks: {
          instagram: req.body.socialLinks?.instagram || null,
          twitter: req.body.socialLinks?.twitter || null,
          linkedin: req.body.socialLinks?.linkedin || null,
          facebook: req.body.socialLinks?.facebook || null
        },
        notificationPreferences: {
          emailNotifications: req.body.notificationPreferences?.emailNotifications ?? true,
          pushNotifications: req.body.notificationPreferences?.pushNotifications ?? true,
          weeklyRecommendations: req.body.notificationPreferences?.weeklyRecommendations ?? false
        }
      };
      
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('No update data provided');
      }

      const updatedUserDetail = await this.userDetailService.updateUserDetail(userId, updateData);

      logger.info(`User detail updated successfully for user: ${userId}`);
      res.json({
        status: 'success',
        message: 'User detail updated successfully',
        data: updatedUserDetail,
      });
    } catch (error) {
      logger.error('Error in updateUserDetail controller:', error);
      next(error);
    }
  };
} 