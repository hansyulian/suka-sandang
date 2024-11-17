import { MaterialEngine, MaterialNotFoundException } from "@app/core";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteMaterialController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/material/mock-id");
  });
  it("should call material facade delete function", async () => {
    MaterialEngine.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/material/${id}`)
      .send();

    expect(MaterialEngine.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    MaterialEngine.prototype.delete = jest.fn().mockRejectedValueOnce(
      new MaterialNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/material/${id}`)
      .send();

    expect(MaterialEngine.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new MaterialNotFoundException({ id }));
  });
});
