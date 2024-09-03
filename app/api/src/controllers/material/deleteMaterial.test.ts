import { MaterialFacade, MaterialNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteMaterialController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/material/mock-id");
  });
  it("should call material facade delete function", async () => {
    (MaterialFacade.delete as jest.Mock).mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/material/${id}`)
      .send();

    expect(MaterialFacade.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    (MaterialFacade.delete as jest.Mock).mockRejectedValueOnce(
      new MaterialNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/material/${id}`)
      .send();

    expect(MaterialFacade.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new MaterialNotFoundException({ id }));
  });
});
