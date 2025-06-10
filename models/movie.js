import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';
import e from 'express';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  release_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  age_rating: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poster_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  background_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  watch_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 
  external_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  actor: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'movies',
  timestamps: false,
});

export default Movie;