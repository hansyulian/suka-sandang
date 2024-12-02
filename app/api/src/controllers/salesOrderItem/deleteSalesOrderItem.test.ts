import {
  SalesOrderItemEngine,
  SalesOrderItemNotFoundException,
} from "@app/core";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteSalesOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest
      .testRequireAuthentication()
      .delete("/sales-order-item/mock-id");
  });
  it("should call SalesOrderItem facade delete function", async () => {
    SalesOrderItemEngine.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/sales-order-item/${id}`)
      .send();

    expect(SalesOrderItemEngine.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    SalesOrderItemEngine.prototype.delete = jest.fn().mockRejectedValueOnce(
      new SalesOrderItemNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/sales-order-item/${id}`)
      .send();

    expect(SalesOrderItemEngine.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new SalesOrderItemNotFoundException({ id }));
  });
});
