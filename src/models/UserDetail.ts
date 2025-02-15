import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserDetailAttributes {
  id?: number;
  userId: number;
  bio?: string;
  location?: string;
  profilePhotos?: string[];
  profilePhoto?: string;
  lastLoginAt?: Date;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  facebookUrl?: string;
  interests?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDetailInstance extends Model<UserDetailAttributes>, UserDetailAttributes {}

const UserDetail = sequelize.define<UserDetailInstance>('UserDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bio: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profilePhotos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  twitterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  linkedInUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true
  }
}, {
  tableName: 'user_details',
  timestamps: true
});

export const setupUserDetailAssociations = (User: any): void => {
  UserDetail.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

export default UserDetail; 