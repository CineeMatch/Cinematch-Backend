import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  post_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  commentText: DataTypes.TEXT,
}, {
  tableName: 'comments',
  timestamps: true,
});
export default Comment;