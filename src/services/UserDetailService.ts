import { UserDetailRepository } from '../repositories/UserDetailRepository';
import { UpdateUserDetailDTO } from '../types/dto/UserDetailDTO';
import { ValidationError, NotFoundError } from '../errors/AppError';
import logger from '../utils/logger';
import UserDetail, { UserDetailInstance } from '../models/UserDetail';

export class UserDetailService {
  private userDetailRepository: UserDetailRepository;

  constructor() {
    this.userDetailRepository = new UserDetailRepository();
  }

  public async getUserDetail(userId: number): Promise<UserDetailInstance | null> {
    try {
      const userDetail = await this.userDetailRepository.findByUserId(userId);
      if (!userDetail) {
        throw new NotFoundError('User detail not found');
      }
      return userDetail;
    } catch (error) {
      logger.error('Error in getUserDetail service:', error);
      throw error;
    }
  }

  public async updateUserDetail(userId: number, updateData: UpdateUserDetailDTO): Promise<UserDetailInstance> {
    try {
      // Validate interests array
      if (updateData.interests) {
        if (!Array.isArray(updateData.interests)) {
          throw new ValidationError('Interests must be an array');
        }
        // Remove duplicates and validate each interest
        updateData.interests = [...new Set(updateData.interests)].map(interest => {
          if (typeof interest !== 'string') {
            throw new ValidationError('Each interest must be a string');
          }
          return interest.trim();
        });
      }

      // Validate location
      if (updateData.location && typeof updateData.location !== 'string') {
        throw new ValidationError('Location must be a string');
      }

      // Validate bio
      if (updateData.bio) {
        if (typeof updateData.bio !== 'string') {
          throw new ValidationError('Bio must be a string');
        }
        if (updateData.bio.length > 500) {
          throw new ValidationError('Bio cannot exceed 500 characters');
        }
      }

      // Validate social links
      if (updateData.socialLinks) {
        const socialLinks = updateData.socialLinks;
        Object.entries(socialLinks).forEach(([platform, username]) => {
          if (username && typeof username !== 'string') {
            throw new ValidationError(`Invalid ${platform} username format`);
          }
        });
      }

      // Validate notification preferences
      if (updateData.notificationPreferences) {
        const prefs = updateData.notificationPreferences;
        if (typeof prefs.emailNotifications !== 'boolean' ||
            typeof prefs.pushNotifications !== 'boolean' ||
            typeof prefs.weeklyRecommendations !== 'boolean') {
          throw new ValidationError('Invalid notification preferences format');
        }
      }

      const existingUserDetail = await this.userDetailRepository.findByUserId(userId);
      if (!existingUserDetail) {
        // If user detail doesn't exist, create new one
        return await this.userDetailRepository.create({
          userId,
          ...updateData
        });
      }

      // Update existing user detail
      return await this.userDetailRepository.update(existingUserDetail.id, updateData);
    } catch (error) {
      logger.error('Error in updateUserDetail service:', error);
      throw error;
    }
  }
} 