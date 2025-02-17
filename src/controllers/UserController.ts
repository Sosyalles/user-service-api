import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import logger from '../utils/logger';
import { 
  AuthenticationError, 
  ForbiddenError, 
  NotFoundError 
} from '../errors/AppError';
import { 
  CreateUserDTO, 
  UpdateUserDTO, 
  ChangePasswordDTO 
} from '../types/dto/UserDTO';
import { uploadProfilePhotos } from '../utils/multerConfig';
import { ValidationError } from '../errors/AppError';

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
      const userData: CreateUserDTO = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      };

      const newUser = await this.userService.register(userData);

      logger.info(`Kullanıcı başarıyla kayıt edildi: ${newUser.username}`);
      res.status(201).json({
        status: 'success',
        message: 'Kullanıcı başarıyla kayıt edildi',
        data: newUser
      });
    } catch (error) {
      logger.error('Kullanıcı kayıt işleminde hata:', error);
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

      if (!email || !password) {
        throw new ValidationError('E-posta ve şifre gereklidir');
      }

      const { user, token } = await this.userService.login({email, password});

      logger.info(`Kullanıcı giriş yaptı: ${user.username}`);
      res.json({
        status: 'success',
        message: 'Giriş başarılı',
        data: { user, token }
      });
    } catch (error) {
      logger.error('Kullanıcı giriş işleminde hata:', error);
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
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      const { currentPassword, newPassword } = req.body;
      const passwordData: ChangePasswordDTO = { 
        currentPassword, 
        newPassword 
      };

      await this.userService.changePassword(userId, passwordData);

      logger.info(`Şifre başarıyla değiştirildi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Şifre başarıyla değiştirildi'
      });
    } catch (error) {
      logger.error('Şifre değişikliği sırasında hata:', error);
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
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      const user = await this.userService.getUser(userId);
      
      logger.info(`Kullanıcı profili getirildi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı profili başarıyla getirildi',
        data: user
      });
    } catch (error) {
      logger.error('Kullanıcı profili getirilirken hata:', error);
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
        throw new AuthenticationError('Kullanıcı kimliği gereklidir');
      }

      const updateData: UpdateUserDTO = {
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePhoto: req.body.profilePhoto
      };

      // Remove undefined properties
      Object.keys(updateData).forEach(key => 
        updateData[key as keyof UpdateUserDTO] === undefined && 
        delete updateData[key as keyof UpdateUserDTO]
      );

      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('Güncelleme için veri sağlanmadı');
      }

      const updatedUser = await this.userService.updateUser(userId, updateData);

      logger.info(`Kullanıcı profili güncellendi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı profili başarıyla güncellendi',
        data: updatedUser
      });
    } catch (error) {
      logger.error('Kullanıcı profili güncellenirken hata:', error);
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        throw new ValidationError('Geçersiz kullanıcı kimliği');
      }

      const user = await this.userService.getUser(userId);
      
      logger.info(`Kullanıcı kimliğine göre kullanıcı getirildi: ${userId}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı başarıyla getirildi',
        data: user
      });
    } catch (error) {
      logger.error('Kullanıcı kimliğine göre getirme işleminde hata:', error);
      next(error);
    }
  };

  public getUserByUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username } = req.params;
      
      if (!username) {
        throw new ValidationError('Kullanıcı adı gereklidir');
      }

      const user = await this.userService.getUserByUsername(username);
      
      logger.info(`Kullanıcı adına göre kullanıcı getirildi: ${username}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı başarıyla getirildi',
        data: user
      });
    } catch (error) {
      logger.error('Kullanıcı adına göre getirme işleminde hata:', error);
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      if (page < 1) {
        throw new ValidationError('Sayfa numarası 1\'den küçük olamaz');
      }

      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit 1 ile 100 arasında olmalıdır');
      }

      const { users, total } = await this.userService.getAllUsers(
        page, 
        limit, 
        search
      );
      
      logger.info(`Kullanıcılar getirildi: Sayfa ${page}`);
      res.json({
        status: 'success',
        message: 'Kullanıcılar başarıyla getirildi',
        data: {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Kullanıcıları getirme işleminde hata:', error);
      next(error);
    }
  };

  public getProfileWithDetailsByUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username } = req.params;
      
      if (!username) {
        throw new ValidationError('Kullanıcı adı gereklidir');
      }

      const userProfile = await this.userService.getUserProfileWithDetailsByUsername(username);
      
      logger.info(`Kullanıcı profili detayları getirildi: ${username}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı profili detayları başarıyla getirildi',
        data: userProfile
      });
    } catch (error) {
      logger.error('Kullanıcı profili detayları getirilirken hata:', error);
      next(error);
    }
  };

  public getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.params;
      
      if (!email) {
        throw new ValidationError('E-posta adresi gereklidir');
      }

      const user = await this.userService.getUserByEmail(email);
      
      logger.info(`E-posta adresine göre kullanıcı getirildi: ${email}`);
      res.json({
        status: 'success',
        message: 'Kullanıcı başarıyla getirildi',
        data: user
      });
    } catch (error) {
      logger.error('E-posta adresine göre getirme işleminde hata:', error);
      next(error);
    }
  };
} 