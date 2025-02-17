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
    },
    validate: {
      notNull: { msg: 'Kullanıcı kimliği boş bırakılamaz' },
      isInt: { msg: 'Kullanıcı kimliği bir tamsayı olmalıdır' }
    }
  },
  bio: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: { 
        args: [0, 500], 
        msg: 'Biyografi 500 karakteri aşamaz' 
      }
    }
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: { 
        args: [0, 100], 
        msg: 'Konum 100 karakteri aşamaz' 
      }
    }
  },
  profilePhotos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,

  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true,
    validate: {
      isValidInterests(value: string[]) {
        if (value && value.length > 10) {
          throw new Error('En fazla 10 ilgi alanı eklenebilir');
        }
        if (value && value.some(interest => interest.length > 50)) {
          throw new Error('Her ilgi alanı 50 karakteri aşamaz');
        }
      }
    }
  }
}, {
  tableName: 'user_details',
  timestamps: true,
  hooks: {
    beforeValidate: (userDetail: UserDetailInstance) => {
      // Trim and clean up interests and profile photos
      if (userDetail.interests) {
        userDetail.interests = userDetail.interests
          .map(interest => interest.trim())
          .filter(interest => interest.length > 0);
      }
      if (userDetail.profilePhotos) {
        userDetail.profilePhotos = userDetail.profilePhotos
          .filter(photo => photo && photo.trim().length > 0);
      }
    }
  }
});

// Add association so that UserDetail belongs to User
(UserDetail as any).associate = (models: any) => {
  UserDetail.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
};

export default UserDetail; 