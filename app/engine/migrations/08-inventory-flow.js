module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InventoryFlows", {
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

      inventoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Inventories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      purchaseOrderItemId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "PurchaseOrderItems",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      activity: {
        type: Sequelize.ENUM(
          "adjustment",
          "procurement",
          "sales",
          "return",
          "transfer",
          "allocation",
          "scrap"
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("valid", "cancelled", "deleted"),
        allowNull: false,
        defaultValue: "valid",
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("InventoryFlows");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_InventoryFlows_status"'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_InventoryFlows_activity"'
    );
  },
};
