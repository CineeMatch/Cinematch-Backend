import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const CommentLike = sequelize.define('CommentLike', {
  user_id: DataTypes.INTEGER,
  comment_id: DataTypes.INTEGER,
}, {
  tableName: 'commentlikes',
  timestamps: false,
});

export default CommentLike;