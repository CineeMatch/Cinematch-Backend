import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Friend = sequelize.define('Friend', {
  
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: DataTypes.INTEGER,

  friend_id: DataTypes.INTEGER,

  status: DataTypes.ENUM('pending', 'accepted', 'blocked'),

},
{
  tableName: 'friends',
  timestamps: false,
});

export default Friend;