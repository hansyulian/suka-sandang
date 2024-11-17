module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PurchaseOrderItems", {
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

      purchaseOrderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "PurchaseOrders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      materialId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Materials",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unitPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      subTotal: {
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
    await queryInterface.dropTable("PurchaseOrderItems");
  },
};
