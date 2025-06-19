import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const CoMatchSuggestion = sequelize.define('CoMatchSuggestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: DataTypes.INTEGER,

  match_id: DataTypes.INTEGER,

  shared_movies_count: DataTypes.INTEGER,
}, 

{
  tableName: 'comatchsuggestions',
  timestamps: true,
});

export default CoMatchSuggestion;