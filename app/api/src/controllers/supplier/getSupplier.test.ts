import { SupplierAttributes } from "@app/common";
import { SupplierFacade, SupplierNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getSupplierController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/supplier/mock-id");
  });
  it("should call supplier facade get function", async () => {
    const id = "mock-id";
    const record: SupplierAttributes = {
      id,
      name: "Supplier 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    };
    SupplierFacade.prototype.findById = jest.fn().mockResolvedValueOnce(record);
    const response = await apiTest
      .withAuthentication()
      .get(`/supplier/${id}`)
      .send();

    expect(SupplierFacade.prototype.findById).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Supplier 1");
    expect(body.email).toStrictEqual("email@example.com");
    expect(body.address).toStrictEqual("Address");
    expect(body.phone).toStrictEqual("+62123123123");
    expect(body.remarks).toStrictEqual("remarks");
    expect(body.status).toStrictEqual("active");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    SupplierFacade.prototype.findById = jest.fn().mockRejectedValueOnce(
      new SupplierNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/supplier/${id}`)
      .send();

    expect(SupplierFacade.prototype.findById).toHaveBeenCalledWith(id);
    expectRejection(response, new SupplierNotFoundException({ id }));
  });
});
