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
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: {
      name: 'username',
      msg: 'Bu kullanıcı adı zaten kullanılmaktadır'
    },
    validate: {
      notNull: { msg: 'Kullanıcı adı boş bırakılamaz' },
      notEmpty: { msg: 'Kullanıcı adı boş bırakılamaz' },
      len: { 
        args: [3, 30], 
        msg: 'Kullanıcı adı 3 ile 30 karakter arasında olmalıdır' 
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'email',
      msg: 'Bu e-posta adresi zaten kullanılmaktadır'
    },
    validate: {
      notNull: { msg: 'E-posta adresi boş bırakılamaz' },
      notEmpty: { msg: 'E-posta adresi boş bırakılamaz' },
      isEmail: { msg: 'Geçerli bir e-posta adresi giriniz' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Şifre boş bırakılamaz' },
      notEmpty: { msg: 'Şifre boş bırakılamaz' },
      len: { 
        args: [8, 255], 
        msg: 'Şifre en az 8 karakter uzunluğunda olmalıdır' 
      }
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: 'Ad boş bırakılamaz' },
      notEmpty: { msg: 'Ad boş bırakılamaz' },
      len: { 
        args: [2, 50], 
        msg: 'Ad 2 ile 50 karakter arasında olmalıdır' 
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: 'Soyad boş bırakılamaz' },
      notEmpty: { msg: 'Soyad boş bırakılamaz' },
      len: { 
        args: [2, 50], 
        msg: 'Soyad 2 ile 50 karakter arasında olmalıdır' 
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user: UserInstance) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user: UserInstance) => {
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

(User as any).associate = (models: any) => {
  User.hasOne(models.UserDetail, { as: 'userDetail', foreignKey: 'userId' });
};

export default User; 