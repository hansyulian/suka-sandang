import { SupplierAttributes } from "@app/common";
import { SupplierEngine } from "@app/engine";
import { apiTest } from "~test/utils";

describe("Controller: getSupplierOptionsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/supplier/mock-id");
  });
  it("should call supplier facade list function", async () => {
    const id = "mock-id";
    const record: SupplierAttributes = {
      id,
      name: "Supplier 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      identity: "3273",
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    };
    SupplierEngine.prototype.list = jest
      .fn()
      .mockResolvedValueOnce({ records: [record] });
    const response = await apiTest
      .withAuthentication()
      .get(`/supplier/options`)
      .send();

    expect(SupplierEngine.prototype.list).toHaveBeenCalledWith(
      { status: "active" },
      {}
    );
    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body.records[0].id).toStrictEqual(id);
    expect(body.records[0].name).toStrictEqual("Supplier 1");
  });
});
