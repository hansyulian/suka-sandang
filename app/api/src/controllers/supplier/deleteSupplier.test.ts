import { SupplierEngine, SupplierNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteSupplierController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/supplier/mock-id");
  });
  it("should call supplier facade delete function", async () => {
    SupplierEngine.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/supplier/${id}`)
      .send();

    expect(SupplierEngine.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    SupplierEngine.prototype.delete = jest.fn().mockRejectedValueOnce(
      new SupplierNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/supplier/${id}`)
      .send();

    expect(SupplierEngine.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new SupplierNotFoundException({ id }));
  });
});
