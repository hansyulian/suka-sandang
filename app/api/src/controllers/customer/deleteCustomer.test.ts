import { CustomerFacade, CustomerNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteCustomerController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/customer/mock-id");
  });
  it("should call customer facade delete function", async () => {
    CustomerFacade.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/customer/${id}`)
      .send();

    expect(CustomerFacade.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    CustomerFacade.prototype.delete = jest.fn().mockRejectedValueOnce(
      new CustomerNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/customer/${id}`)
      .send();

    expect(CustomerFacade.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new CustomerNotFoundException({ id }));
  });
});
