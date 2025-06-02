import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: DataTypes.STRING,
  sender_id: DataTypes.INTEGER,
  receiver_id: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  sent_at: DataTypes.DATE,
  is_read: DataTypes.BOOLEAN,
}, {
  tableName: 'conversations',
  timestamps: false,
});

export default Conversation;