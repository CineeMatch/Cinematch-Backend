import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Recommendation = sequelize.define('Recommendation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  movie_id: DataTypes.INTEGER,
  score: DataTypes.FLOAT,
}, {
  tableName: 'recommendation',
  timestamps: true,
});

export default Recommendation;