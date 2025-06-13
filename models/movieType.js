import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const MovieType = sequelize.define('MovieType', {
  user_id: DataTypes.INTEGER,

  movie_id: DataTypes.INTEGER,

  favoriteMovies: DataTypes.BOOLEAN,

  watchedMovies: DataTypes.BOOLEAN,

  wishlistMovies: DataTypes.BOOLEAN,

  added_at: DataTypes.DATE,
  
  is_on_profile: DataTypes.BOOLEAN,
}, {
  tableName: 'movietypes',
  timestamps: false,
});

export default MovieType;