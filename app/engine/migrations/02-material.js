module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Materials", {
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      name: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      purchasePrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      retailPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Materials");
  },
};
