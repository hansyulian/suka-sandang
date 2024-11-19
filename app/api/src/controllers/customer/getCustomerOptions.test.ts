import { CustomerAttributes } from "@app/common";
import { CustomerEngine } from "@app/core";
import { apiTest } from "~test/utils";

describe("Controller: getCustomerOptionsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/customer/mock-id");
  });
  it("should call customer facade list function", async () => {
    const id = "mock-id";
    const record: CustomerAttributes = {
      id,
      name: "Customer 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      identity: "3273",
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    };
    CustomerEngine.prototype.list = jest
      .fn()
      .mockResolvedValueOnce({ records: [record] });
    const response = await apiTest
      .withAuthentication()
      .get(`/customer/options`)
      .send();

    expect(CustomerEngine.prototype.list).toHaveBeenCalledWith(
      { status: "active" },
      {}
    );
    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body.records[0].id).toStrictEqual(id);
    expect(body.records[0].name).toStrictEqual("Customer 1");
  });
});
