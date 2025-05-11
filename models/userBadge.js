import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const UserBadge = sequelize.define('UserBadge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  badge_id: DataTypes.INTEGER,
  earned_at: DataTypes.DATE,
}, {
  tableName: 'userbadges',
  timestamps: false,
});

export default UserBadge;