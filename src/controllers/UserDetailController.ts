import { Request, Response, NextFunction } from 'express';
import { UserDetailService } from '../services/UserDetailService';
import logger from '../utils/logger';
import { 
  ValidationError, 
  NotFoundError, 
  AuthenticationError,
  ForbiddenError 
} from '../errors/AppError';
import { UpdateUserDetailDTO } from '../types/dto/UserDetailDTO';
import { uploadProfilePhotos } from '../utils/multerConfig';
import { UserService } from '../services/UserService';
import * as fs from 'fs';
import * as path from 'path';

export class UserDetailController {
  private userDetailService: UserDetailService;
  private userService: UserService;

  constructor() {
    this.userDetailService = new UserDetailService();
    this.userService = new UserService();
  }

  public getUserDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      const userDetail = await this.userDetailService.getUserDetail(userId);
      
      logger.info(`Kullanıcı detayları başarıyla getirildi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı detayları başarıyla getirildi',
        data: userDetail,
      });
    } catch (error) {
      logger.error('Kullanıcı detayları getirilirken hata:', error);
      next(error);
    }
  };

  public uploadProfilePhotos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new ValidationError('Hiçbir dosya yüklenmedi');
      }

      if (req.files.length > 5) {
        throw new ValidationError('En fazla 5 fotoğraf yüklenebilir');
      }

      // Get base URL from environment variable
      const baseUrl = process.env.APP_URL || 'http://localhost:3000';
      
      // Get full URLs from uploaded files
      const photoUrls = (req.files as Express.Multer.File[]).map(file => `${baseUrl}/uploads/profiles/${file.filename}`);

      // Update user's profile photo with the first uploaded photo
      await this.userService.updateProfilePhoto(userId, photoUrls[0]);

      // Update user details with all photos
      const updateData: UpdateUserDetailDTO = {
        profilePhotos: photoUrls,
        profilePhoto: photoUrls[0]
      };

      const updatedUserDetail = await this.userDetailService.updateUserDetail(userId, updateData);

      logger.info(`Profil fotoğrafları başarıyla yüklendi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Profil fotoğrafları başarıyla yüklendi',
        data: {
          profilePhoto: photoUrls[0],
          profilePhotos: photoUrls
        }
      });
    } catch (error) {
      logger.error('Profil fotoğrafları yüklenirken hata:', error);
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
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      const updateData: UpdateUserDetailDTO = {
        bio: req.body.bio,
        location: req.body.location,
        interests: req.body.interests,
        profilePhoto: req.body.profilePhoto,
        profilePhotos: req.body.profilePhotos,
        notificationPreferences: {
          emailNotifications: req.body.notificationPreferences?.emailNotifications ?? true,
          pushNotifications: req.body.notificationPreferences?.pushNotifications ?? true,
          weeklyRecommendations: req.body.notificationPreferences?.weeklyRecommendations ?? false
        }
      };
      
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('Güncelleme verisi sağlanmadı');
      }

      const updatedUserDetail = await this.userDetailService.updateUserDetail(userId, updateData);

      logger.info(`Kullanıcı detayları başarıyla güncellendi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı detayları başarıyla güncellendi',
        data: updatedUserDetail,
      });
    } catch (error) {
      logger.error('Kullanıcı detayları güncellenirken hata:', error);
      next(error);
    }
  };

  public deleteProfilePhotos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      const { photoUrls } = req.body;

      // Validate input
      if (!photoUrls || !Array.isArray(photoUrls)) {
        throw new ValidationError('Geçersiz fotoğraf URL\'leri');
      }

      // Delete photos from filesystem and database
      const deletedPhotos = await this.userDetailService.deleteProfilePhotos(userId, photoUrls);

      logger.info(`Profil fotoğrafları başarıyla silindi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Profil fotoğrafları başarıyla silindi',
        data: {
          deletedPhotos
        }
      });
    } catch (error) {
      logger.error('Profil fotoğrafları silinirken hata:', error);
      next(error);
    }
  };
} 