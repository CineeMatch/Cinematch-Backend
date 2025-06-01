import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Like = sequelize.define('Like', {
  post_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
}, {
  tableName: 'likes',
  timestamps: false,
});

export default Like;