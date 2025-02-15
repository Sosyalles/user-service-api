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
  profilePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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
  profilePhoto: {
    type: DataTypes.STRING,
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

// Add instance method
(User.prototype as UserInstance).comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const setupUserAssociations = (UserDetail: any): void => {
  User.hasOne(UserDetail, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'userDetail',
  });
};

export default User; 