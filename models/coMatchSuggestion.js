import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const CoMatchSuggestion = sequelize.define('CoMatchSuggestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  match_id: DataTypes.INTEGER,
  shared_movies_count: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
}, {
  tableName: 'comatchsuggestions',
  timestamps: false,
});

export default CoMatchSuggestion;