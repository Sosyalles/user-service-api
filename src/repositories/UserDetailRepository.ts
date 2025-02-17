import { Transaction } from 'sequelize';
import UserDetail, { UserDetailInstance, UserDetailAttributes } from '../models/UserDetail';
import { UpdateUserDetailDTO } from '../types/dto/UserDetailDTO';
import { NotFoundError } from '../errors/AppError';
import logger from '../utils/logger';

export class UserDetailRepository {
  public async findByUserId(userId: number): Promise<UserDetailInstance | null> {
    try {
      return await UserDetail.findOne({ where: { userId } });
    } catch (error) {
      logger.error('Error in findByUserId repository:', error);
      throw error;
    }
  }

  public async create(data: UpdateUserDetailDTO & { userId: number }): Promise<UserDetailInstance> {
    try {
      const createData: Partial<UserDetailAttributes> = {
        userId: data.userId,
        bio: data.bio,
        location: data.location,
        interests: data.interests,
        profilePhoto: data.profilePhoto,
        profilePhotos: data.profilePhotos
      };

      return await UserDetail.create(createData);
    } catch (error) {
      logger.error('Error in create repository:', error);
      throw error;
    }
  }

  public async update(id: number, data: UpdateUserDetailDTO, transaction?: Transaction): Promise<UserDetailInstance> {
    try {
      const userDetail = await UserDetail.findByPk(id);
      if (!userDetail) {
        throw new NotFoundError('User detail not found');
      }

      const updateData: Partial<UserDetailAttributes> = {
        bio: data.bio,
        location: data.location,
        interests: data.interests,
        profilePhoto: data.profilePhoto,
        profilePhotos: data.profilePhotos
      };

      await userDetail.update(updateData, { transaction });
      return userDetail;
    } catch (error) {
      logger.error('Error in update repository:', error);
      throw error;
    }
  }

  public async updateLastLogin(userId: number): Promise<void> {
    try {
      const userDetail = await this.findByUserId(userId);
      if (userDetail) {
        await userDetail.update({ lastLoginAt: new Date() });
      }
    } catch (error) {
      logger.error('Error in updateLastLogin repository:', error);
      throw error;
    }
  }
} 