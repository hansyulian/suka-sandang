module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PurchaseOrders", {
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
      supplierId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Suppliers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NuLL",
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "processing",
          "completed",
          "cancelled",
          "deleted"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PurchaseOrders");
  },
};
