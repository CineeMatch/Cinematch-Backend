import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Recommendation = sequelize.define('Recommendation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  movie_id: DataTypes.INTEGER,
  score: DataTypes.FLOAT,
  created_at: DataTypes.DATE,
}, {
  tableName: 'recommendation',
  timestamps: false,
});

export default Recommendation;