import { InventoryFacade, InventoryNotFoundException } from "@app/engine";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getInventoryController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/inventory/mock-id");
  });

  it("should call Inventory facade get function", async () => {
    const idOrCode = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    // Mock the response based on the contract structure
    const inventoryData = injectStrayValues({
      id: idOrCode,
      code: "sample-inventory-1",
      remarks: "Sample remarks",
      total: 1000,
      materialId: "mock-material-id",
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      material: injectStrayValues({
        id: "mock-material-id",
        name: "Material Name",
        description: "Material Description",
        createdAt: now,
        updatedAt: now,
        deletedAt: now,
      }),
      inventoryFlows: [
        injectStrayValues({
          id: "flow-id-1",
          status: "valid",
          quantity: 100,
          createdAt: now,
          updatedAt: now,
          deletedAt: now,
          purchaseOrderItemId: "purchase-order-item-id",
          purchaseOrderItem: injectStrayValues({
            id: "purchase-order-item-id",
            quantity: 10,
            unitPrice: 50,
            purchaseOrderId: "purchase-order-id",
            purchaseOrder: injectStrayValues({
              id: "purchase-order-id",
              code: "PO-001",
              status: "active",
              total: 500,
              createdAt: now,
              updatedAt: now,
              deletedAt: now,
            }),
          }),
        }),
      ],
    });

    InventoryFacade.prototype.findByIdOrCode = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(inventoryData));

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory/${idOrCode}`)
      .send();

    expect(InventoryFacade.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);

    // Destructure body to remove nested values for easy comparison
    const { material, inventoryFlows, ...inventory } = body;
    const { purchaseOrderItem: purchaseOrderItemExtended, ...inventoryFlow } =
      inventoryFlows[0];
    const { purchaseOrder, ...purchaseOrderItem } = purchaseOrderItemExtended;

    checkStrayValues(inventory);
    checkStrayValues(inventoryFlow);
    checkStrayValues(purchaseOrder);
    checkStrayValues(purchaseOrderItem);

    // Compare entire inventory object at once using .toEqual
    expect(inventory).toEqual({
      id: idOrCode,
      code: "sample-inventory-1",
      total: 1000,
      remarks: "Sample remarks",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      materialId: "mock-material-id",
    });

    // Compare entire material object
    expect(material).toEqual({
      id: "mock-material-id",
      name: "Material Name",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });

    expect(inventoryFlow).toEqual({
      id: "flow-id-1",
      status: "valid",
      quantity: 100,
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      purchaseOrderItemId: "purchase-order-item-id",
    });

    // Compare entire purchaseOrderItem object
    expect(purchaseOrderItem).toEqual({
      id: "purchase-order-item-id",
      quantity: 10,
      unitPrice: 50,
      purchaseOrderId: "purchase-order-id",
    });

    // Compare entire purchaseOrder object
    expect(purchaseOrder).toEqual({
      id: "purchase-order-id",
      code: "PO-001",
      status: "active",
      total: 500,
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });
  });

  it("should handle not found exception if inventory not found", async () => {
    const idOrCode = "mock-id";
    InventoryFacade.prototype.findByIdOrCode = jest
      .fn()
      .mockRejectedValueOnce(new InventoryNotFoundException({ idOrCode }));

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory/${idOrCode}`)
      .send();

    expect(InventoryFacade.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    expectRejection(response, new InventoryNotFoundException({ idOrCode }));
  });
});
