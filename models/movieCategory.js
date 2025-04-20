import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const MovieCategory = sequelize.define('MovieCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'movies',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'moviecategories',
  timestamps: false,
});

export default MovieCategory;