import { schemaValidationBody } from "~test/utils/schemaValidationBody";

describe("testUtils: schemaValidationBody", () => {
  it("should be able to generate proper detail", () => {
    expect(
      schemaValidationBody([
        {
          type: "required",
          key: "body.name",
        },
        {
          type: "invalidType",
          key: "body.status",
          actual: "string",
          expected: "number",
          value: "123",
        },
      ])
    ).toEqual({
      name: "schemaValidation",
      details: [
        {
          type: "required",
          key: "body.name",
        },
        {
          type: "invalidType",
          key: "body.status",
          actual: "string",
          expected: "number",
          value: "123",
        },
      ],
    });
  });
});
