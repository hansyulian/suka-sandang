import { SimpleStatusResponse } from "~/common/simpleStatusResponse";

describe("@app/common", () => {
  it("should be able to correctly typing", () => {
    const result: SimpleStatusResponse = {
      status: "success",
    };
    expect(result).toEqual({
      status: "success",
    });
  });
});
