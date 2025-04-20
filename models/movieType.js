import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const MovieType = sequelize.define('MovieType', {
  user_id: DataTypes.INTEGER,
  movie_id: DataTypes.INTEGER,
  favoriteMovies: DataTypes.INTEGER,
  watchedMovies: DataTypes.INTEGER,
  wishlistMovies: DataTypes.INTEGER,
  added_at: DataTypes.DATE,
  is_on_profile: DataTypes.BOOLEAN,
}, {
  tableName: 'movietypes',
  timestamps: false,
});

export default MovieType;