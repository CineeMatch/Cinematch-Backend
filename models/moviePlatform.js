import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const MoviePlatform = sequelize.define('MoviePlatform', {
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
  platform_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'platforms',
      key: 'id'
    }
  }
}, {
  tableName: 'movieplatforms',
  timestamps: false,
});

export default MoviePlatform;