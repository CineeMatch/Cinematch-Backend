import { Sequelize } from 'sequelize';
import globalConfig from './globalConfig.js';

const sequelize = new Sequelize(
  globalConfig.DB_Name,
  globalConfig.DB_User,
  globalConfig.DB_Password,
  {
    host: globalConfig.DB_Host,
    dialect: 'mysql',
    port: globalConfig.DB_Port,
    logging: false,
  }
);

export default sequelize;