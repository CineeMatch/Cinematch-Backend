import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const InitState = sequelize.define('InitState', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    initialized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'initstate',
    timestamps: false
});

export default InitState;