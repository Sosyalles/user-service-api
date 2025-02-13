import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  ChangePasswordDTO,
} from '../types/dto/UserDTO';
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../errors/AppError';
import { config } from '../config/config';
import logger from '../utils/logger';
import User, { UserInstance } from '../models/User';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private generateToken(userId: number): string {
    const token = jwt.sign(
      { userId } as object,
      String(config.jwt.secret),
      { expiresIn: String(config.jwt.expiresIn) }
    );
    return token;
  }

  private async validateUniqueFields(
    email: string,
    username: string,
    userId?: number
  ): Promise<void> {
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail && existingEmail.id !== userId) {
      throw new ConflictError('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername && existingUsername.id !== userId) {
      throw new ConflictError('Username already exists');
    }
  }

  public async register(userData: CreateUserDTO): Promise<UserResponseDTO> {
    await this.validateUniqueFields(userData.email, userData.username);

    const user = await this.userRepository.create(userData);
    logger.info(`New user registered: ${user.id}`);

    const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };
    return userResponse;
  }

  public async login(loginData: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    if (!user.id) {
      throw new ValidationError('User ID is required');
    }

    await this.userRepository.updateLastLogin(user.id);
    const token = this.generateToken(user.id);

    logger.info(`User logged in: ${user.id}`);
    const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };

    return {
      token,
      user: userResponse,
    };
  }

  public async updateUser(
    userId: number,
    updateData: UpdateUserDTO
  ): Promise<UserResponseDTO> {
    if (updateData.email || updateData.username) {
      await this.validateUniqueFields(
        updateData.email || '',
        updateData.username || '',
        userId
      );
    }

    const user = await this.userRepository.update(userId, updateData);
    logger.info(`User updated: ${userId}`);

    const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };
    return userResponse;
  }

  public async changePassword(
    userId: number,
    passwordData: ChangePasswordDTO
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    const isCurrentPasswordValid = await user.comparePassword(
      passwordData.currentPassword
    );
    if (!isCurrentPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    await this.userRepository.update(userId, {
      password: passwordData.newPassword,
    });
    logger.info(`Password changed for user: ${userId}`);
  }

  public async getUser(userId: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };
    return userResponse;
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
    logger.info(`User deleted: ${userId}`);
  }

  public async getAllUsers(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ users: UserResponseDTO[]; total: number }> {
    const { users, total } = await this.userRepository.findAll(page, limit, search);
    const userResponses = users.map((user) => {
      const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };
      return userResponse;
    });

    return {
      users: userResponses,
      total,
    };
  }

  public async updateProfilePhotos(userId: number, photoUrls: string[]): Promise<UserInstance | null> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      user.profilePhotos = photoUrls;
      await user.save();

      return user;
    } catch (error) {
      logger.error('Error updating profile photos:', error);
      throw error;
    }
  }

  public async getUserByUsername(username: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };
    return userResponse;
  }

  public async getUserByEmail(email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const { password, ...userResponse } = user.toJSON() as UserResponseDTO & { password: string };
    return userResponse;
  }
} 