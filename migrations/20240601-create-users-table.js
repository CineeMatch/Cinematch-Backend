export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('Users', {
    id: {
      type: 'INTEGER',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: 'VARCHAR(255)',
      allowNull: false
    },
    email: {
      type: 'VARCHAR(255)',
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: 'DATETIME',
      allowNull: false
    },
    updatedAt: {
      type: 'DATETIME',
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('Users');
};