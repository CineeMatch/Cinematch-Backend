import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Post = sequelize.define('Post', {

  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: DataTypes.INTEGER,

  movie_id: DataTypes.INTEGER,

  contentText: DataTypes.TEXT,
},
  {
    tableName: 'posts',
    timestamps: true,
  });

export default Post;