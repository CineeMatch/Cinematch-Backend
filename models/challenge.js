import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Challenge = sequelize.define('Challenge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  movie_id: DataTypes.INTEGER,
  creator_id: DataTypes.INTEGER,
  opponent_id: DataTypes.INTEGER,
  end_time: {
  type: DataTypes.DATE,
  allowNull: true,
  defaultValue: new Date(0),
},
  status: DataTypes.ENUM('pending', 'accepted','answered', 'completed'),
  duration: DataTypes.INTEGER,
}, {
  tableName: 'challenges',
  timestamps: true,
  createdAt: true,
});

export default Challenge;