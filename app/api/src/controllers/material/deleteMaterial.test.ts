import {
  MaterialCreationAttributes,
  MaterialFacade,
  MaterialNotFoundException,
} from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

jest.mock("@app/engine", () => ({
  ...jest.requireActual("@app/engine"),
  MaterialFacade: {
    delete: jest.fn(),
  },
}));
describe("Controller: deleteMaterialController", () => {
  it("should call material facade delete function", async () => {
    (MaterialFacade.delete as jest.Mock).mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest.instance.delete(`/material/${id}`).send();

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
    const response = await apiTest.instance.delete(`/material/${id}`).send();

    expect(MaterialFacade.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new MaterialNotFoundException({ id }));
  });
});
