import { SalesOrderEngine, SalesOrderNotFoundException } from "@app/core";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteSalesOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/sales-order/mock-id");
  });
  it("should call SalesOrder facade delete function", async () => {
    SalesOrderEngine.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/sales-order/${id}`)
      .send();

    expect(SalesOrderEngine.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    SalesOrderEngine.prototype.delete = jest.fn().mockRejectedValueOnce(
      new SalesOrderNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/sales-order/${id}`)
      .send();

    expect(SalesOrderEngine.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new SalesOrderNotFoundException({ id }));
  });
});
