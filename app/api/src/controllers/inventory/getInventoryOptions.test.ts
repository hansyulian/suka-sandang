import { InventoryEngine } from "@app/core";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: getInventoryOptionsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/inventory/options");
  });

  it("should call Inventory facade list function", async () => {
    const id = "mock-id";
    const now = new Date();

    InventoryEngine.prototype.list = jest.fn().mockResolvedValueOnce(
      injectStrayValues({
        records: [
          injectStrayValues({
            id: id,
            code: "sample-inventory-1",
            createdAt: now,
            status: "draft",
            updatedAt: now,
            deletedAt: now,
            material: injectStrayValues({
              id: "mock-material-id",
              name: "Material Name",
              code: "material-code",
              createdAt: now,
              updatedAt: now,
              deletedAt: now,
            }),
          }),
        ],
      })
    );

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory/options`)
      .send();

    expect(InventoryEngine.prototype.list).toHaveBeenCalledWith(
      { status: "active" },
      {}
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    checkStrayValues(body);
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: id,
      code: "sample-inventory-1",
      material: {
        id: "mock-material-id",
        name: "Material Name",
        code: "material-code",
      },
    });
  });
});
