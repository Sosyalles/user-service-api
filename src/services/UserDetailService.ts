import { UserDetailRepository } from '../repositories/UserDetailRepository';
import { UserRepository } from '../repositories/UserRepository';
import logger from '../utils/logger';
import { UpdateUserDetailDTO } from '../types/dto/UserDetailDTO';
import { 
  ValidationError, 
  NotFoundError, 
  AuthenticationError 
} from '../errors/AppError';
import UserDetail, { UserDetailInstance } from '../models/UserDetail';
import * as fs from 'fs';
import * as path from 'path';

export class UserDetailService {
  private userDetailRepository: UserDetailRepository;
  private userRepository: UserRepository;

  constructor() {
    this.userDetailRepository = new UserDetailRepository();
    this.userRepository = new UserRepository();
  }

  public async getUserDetail(userId: number): Promise<UserDetailInstance | null> {
    try {
      const userDetail = await this.userDetailRepository.findByUserId(userId);
      if (!userDetail) {
        throw new NotFoundError('Kullanıcı detayları bulunamadı');
      }
      return userDetail;
    } catch (error) {
      logger.error('Kullanıcı detayları getirilirken hata:', error);
      throw error;
    }
  }

  public async updateUserDetail(userId: number, updateData: UpdateUserDetailDTO): Promise<UserDetailInstance> {
    try {
      // Validate interests array
      if (updateData.interests) {
        if (!Array.isArray(updateData.interests)) {
          throw new ValidationError('İlgi alanları bir dizi olmalıdır');
        }
        // Remove duplicates and validate each interest
        updateData.interests = [...new Set(updateData.interests)].map(interest => {
          if (typeof interest !== 'string') {
            throw new ValidationError('Her ilgi alanı bir metin olmalıdır');
          }
          return interest.trim();
        });
      }

      // Validate location
      if (updateData.location && typeof updateData.location !== 'string') {
        throw new ValidationError('Konum bir metin olmalıdır');
      }

      // Validate bio
      if (updateData.bio) {
        if (typeof updateData.bio !== 'string') {
          throw new ValidationError('Biyografi bir metin olmalıdır');
        }
        if (updateData.bio.length > 500) {
          throw new ValidationError('Biyografi 500 karakteri aşamaz');
        }
      }

      // Validate profile photos
      if (updateData.profilePhotos) {
        if (!Array.isArray(updateData.profilePhotos)) {
          throw new ValidationError('Profil fotoğrafları bir dizi olmalıdır');
        }
        updateData.profilePhotos.forEach(photo => {
          if (typeof photo !== 'string') {
            throw new ValidationError('Her profil fotoğrafı bir URL olmalıdır');
          }
        });
      }

      // Validate profile photo
      if (updateData.profilePhoto && typeof updateData.profilePhoto !== 'string') {
        throw new ValidationError('Profil fotoğrafı bir URL olmalıdır');
      }

      // Validate notification preferences
      if (updateData.notificationPreferences) {
        const prefs = updateData.notificationPreferences;
        if (typeof prefs.emailNotifications !== 'boolean' ||
            typeof prefs.pushNotifications !== 'boolean' ||
            typeof prefs.weeklyRecommendations !== 'boolean') {
          throw new ValidationError('Bildirim tercihleri geçersiz');
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
      logger.error('Kullanıcı detayları güncellenirken hata:', error);
      throw error;
    }
  }

  public async deleteProfilePhotos(userId: number, photoUrls: string[]): Promise<string[]> {
    try {
      // Find user detail
      const userDetail = await UserDetail.findOne({ where: { userId } });
      if (!userDetail) {
        throw new NotFoundError('Kullanıcı detayları bulunamadı');
      }

      // Validate that the photos belong to the user
      const currentPhotos = userDetail.profilePhotos || [];
      const invalidPhotos = photoUrls.filter(url => !currentPhotos.includes(url));
      if (invalidPhotos.length > 0) {
        throw new ValidationError('Bazı fotoğraflar kullanıcıya ait değil');
      }

      // Delete photos from filesystem
      const deletedPhotosFromFs = await this.deletePhotosFromFileSystem(photoUrls);

      // Remove photos from database
      const remainingPhotos = currentPhotos.filter(photo => !photoUrls.includes(photo));
      userDetail.profilePhotos = remainingPhotos;
      
      // Update profile photo if the current profile photo is being deleted
      if (userDetail.profilePhoto && photoUrls.includes(userDetail.profilePhoto)) {
        userDetail.profilePhoto = remainingPhotos.length > 0 ? remainingPhotos[0] : null;
      }

      await userDetail.save();

      // Update user's profile photo if needed
      const user = await this.userRepository.findById(userId);
      if (user && photoUrls.includes(user.profilePhoto)) {
        await this.userRepository.update(userId, {
          profilePhoto: remainingPhotos.length > 0 ? remainingPhotos[0] : null
        });
      }

      logger.info(`${deletedPhotosFromFs.length} profil fotoğrafı silindi: ${userId}`);
      return deletedPhotosFromFs;
    } catch (error) {
      logger.error('Profil fotoğrafları silinirken hata:', error);
      throw error;
    }
  }

  private async deletePhotosFromFileSystem(photoUrls: string[]): Promise<string[]> {
    const deletedPhotos: string[] = [];

    for (const photoUrl of photoUrls) {
      try {
        // Extract filename from URL (assuming URL format is /uploads/profiles/filename)
        const filename = path.basename(photoUrl);
        const filePath = path.join('uploads', 'profiles', filename);

        // Check if file exists before deleting
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deletedPhotos.push(photoUrl);
        }
      } catch (error) {
        logger.error(`Fotoğraf silinirken hata: ${photoUrl}`, error);
        // Continue with other photos even if one fails
      }
    }

    return deletedPhotos;
  }
} 