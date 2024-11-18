module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SalesOrderItems", {
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

      salesOrderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "SalesOrders",
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
    await queryInterface.addColumn("InventoryFlows", "salesOrderItemId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "SalesOrderItems",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("InventoryFlows", "salesOrderItemId");
    await queryInterface.dropTable("SalesOrderItems");
  },
};
