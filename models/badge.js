import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Badge = sequelize.define('Badge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  image_url: DataTypes.STRING,
  description: DataTypes.TEXT,
  image_url_public_id: DataTypes.STRING,

}, {
  tableName: 'badges',
  timestamps: true,
});

export default Badge;