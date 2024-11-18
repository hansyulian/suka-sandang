module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SalesOrders", {
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
        type: Sequelize.DATE,
        allowNull: true,
      },

      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NuLL",
      },
      status: {
        type: Sequelize.ENUM(
          "draft",
          "processing",
          "completed",
          "cancelled",
          "deleted"
        ),
        allowNull: false,
        defaultValue: "draft",
      },
      total: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SalesOrders");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_SalesOrders_status"'
    );
  },
};
