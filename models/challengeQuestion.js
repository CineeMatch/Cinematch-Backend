import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const ChallangeQuestion = sequelize.define('ChallangeQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  challange_id: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  directed_to: DataTypes.INTEGER,
  questionText: DataTypes.TEXT,
  correct_answer: DataTypes.STRING,
  selected_answer: DataTypes.STRING,
  answered_at: DataTypes.DATE,
}, {
  tableName: 'challangequestion',
  timestamps: false,
});

export default ChallangeQuestion;