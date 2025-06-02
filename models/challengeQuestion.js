import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const ChallengeQuestion = sequelize.define('ChallengeQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  challenge_id: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  directed_to: DataTypes.INTEGER,
  questionText: DataTypes.TEXT,
  correct_answer: DataTypes.BOOLEAN,
  answered_at: DataTypes.DATE,
}, {
  tableName: 'challengequestion',
  timestamps: false,
});

export default ChallengeQuestion;