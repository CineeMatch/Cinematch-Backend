import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  post_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  commentText: DataTypes.TEXT,
  created_at: DataTypes.DATE,
}, {
  tableName: 'comments',
  timestamps: false,
});
export default Comment;