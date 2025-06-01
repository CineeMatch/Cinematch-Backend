import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'users',  
  timestamps: false 
});

// Şifre karşılaştırma fonksiyonu (prototype metoduna ekliyoruz)
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Şifreyi kontrol edip hashleyen yardımcı fonksiyon
async function validateAndHashPassword(user) {
  const password = user.password;

  if (password.length < 6 || password.length > 30) {
    throw new Error('Password should be between 6 and 30 characters.');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_./*-@&%/()=?_^+!><])[A-Za-z\d_./*-@&%/()=?_^+!><]{6,30}$/;

  if (!passwordRegex.test(password)) {
    throw new Error('Password should contain at least one lowercase letter, one uppercase letter, one number, and one special character.');
  }

  const saltRounds = 10;
  user.password = await bcrypt.hash(password, saltRounds);
}
User.beforeCreate(async (user) => {
  await validateAndHashPassword(user);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    await validateAndHashPassword(user);
  }
});


export default User;