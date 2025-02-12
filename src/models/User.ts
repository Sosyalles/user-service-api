import { sequelize, DataTypes } from '../config/database';
import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';

// TypeScript type definitions
export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeSave: async (user: UserInstance) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Static method for password comparison
export const comparePassword = async (user: UserInstance, candidatePassword: string): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, user.password);
};

export default User; 