import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sender_id: DataTypes.INTEGER,
  reciver_id: DataTypes.INTEGER,
  type_id: DataTypes.INTEGER,
  isRead: DataTypes.BOOLEAN,
}, {
  tableName: 'notification',
  timestamps: false,
});

export default Notification;