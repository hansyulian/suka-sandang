const { baseProperties } = require("./__utils__");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Materials", {
      ...baseProperties,
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
      procurementPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      salePrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "inactive", "deleted"),
        allowNull: false,
        defaultValue: "active",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Materials");
  },
};
