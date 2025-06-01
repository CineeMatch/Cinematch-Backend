import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const NotificationType = sequelize.define('NotificationType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  TypeName: DataTypes.STRING,
  messageContent: DataTypes.TEXT,
}, {
  tableName: 'notificationtype',
  timestamps: false,
});

export default NotificationType;