import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Platform = sequelize.define('Platform', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'platforms',
  timestamps: false,
});

export default Platform;