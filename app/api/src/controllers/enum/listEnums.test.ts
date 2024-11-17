import { EnumEngine } from "@app/core";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: listMaterialsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/enum");
  });
  it("should call enum facade list function", async () => {
    EnumEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        injectStrayValues({
          id: "id-1",
          value: "Group 1 Value 1",
          group: "group-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
    });
    const response = await apiTest.withAuthentication().get(`/enum`).send();

    expect(EnumEngine.prototype.list).toHaveBeenCalledWith();
    const { body } = response;
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toBeUndefined();
    expect(firstRecord.value).toStrictEqual("Group 1 Value 1");
    expect(firstRecord.group).toStrictEqual("group-1");
    expect(firstRecord.createdAt).toBeUndefined();
    expect(firstRecord.updatedAt).toBeUndefined();
    checkStrayValues(body.records);
  });
});
