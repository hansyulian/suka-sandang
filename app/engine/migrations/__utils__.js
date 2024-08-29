module.exports = {
  baseProperties,
};

const baseProperties = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
};
