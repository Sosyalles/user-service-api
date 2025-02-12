import { Op } from 'sequelize';
import User, { UserInstance } from '../models/User';
import { CreateUserDTO, UpdateUserDTO } from '../types/dto/UserDTO';
import { NotFoundError } from '../errors/AppError';
import { validateId } from '../utils/validations';

export class UserRepository {
  public async create(userData: CreateUserDTO): Promise<UserInstance> {
    return User.create({
      ...userData,
      isActive: true
    });
  }

  public async findById(id: number): Promise<UserInstance> {
    const validId = validateId(id);
    const user = await User.findByPk(validId);
    if (!user) {
      throw new NotFoundError(`User with id ${validId} not found`);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<UserInstance | null> {
    return User.findOne({ where: { email } });
  }

  public async findByUsername(username: string): Promise<UserInstance | null> {
    return User.findOne({ where: { username } });
  }

  public async update(id: number, userData: UpdateUserDTO): Promise<UserInstance> {
    const validId = validateId(id);
    const user = await this.findById(validId);
    return user.update(userData);
  }

  public async delete(id: number): Promise<void> {
    const validId = validateId(id);
    const user = await this.findById(validId);
    await user.destroy();
  }

  public async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ users: UserInstance[]; total: number }> {
    const offset = (page - 1) * limit;
    const whereClause = search
      ? {
          [Op.or]: [
            { username: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows,
      total: count,
    };
  }

  public async updateLastLogin(id: number): Promise<void> {
    const validId = validateId(id);
    const user = await this.findById(validId);
    await user.update({ lastLoginAt: new Date() });
  }
} 