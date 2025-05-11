import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Badge = sequelize.define('Badge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  image_url: DataTypes.STRING,
  description: DataTypes.TEXT,
  created_at: DataTypes.DATE,
}, {
  tableName: 'badges',
  timestamps: false,
});

export default Badge;