import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const ChallengeQuestion = sequelize.define('ChallengeQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  challenge_id: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  directed_to: DataTypes.INTEGER,
  questionText: DataTypes.TEXT,
  correct_answer: DataTypes.BOOLEAN,
  selected_answer: {
    type: DataTypes.BOOLEAN,
    allowNull: true, // This field can be null if the question hasn't been answered yet
    defaultValue: null, // Default value is null
  },
  answered_at: {
    type: DataTypes.DATE,
    allowNull: true, // This field can be null if the question hasn't been answered yet
    defaultValue: null, // Default value is null
  }
}, {
  tableName: 'challengequestion',
  timestamps: false,
});

export default ChallengeQuestion;