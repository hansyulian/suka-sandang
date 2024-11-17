import { objectSchema } from "./objectSchema";
import { SchemaType } from "./types/Spec";

describe("@hyulian/common.modules.schema.objectSchema", () => {
  it("should be success when no typing error in this example", () => {
    // Sample contract adhering to the contract specification
    const sampleSource = objectSchema({
      stringType: {
        type: "string",
      },
      stringOrUndefinedType: {
        type: "string",
        optional: true,
      },
      numberType: {
        type: "number",
      },
      booleanType: {
        type: "boolean",
      },
      arrayOfXType: {
        type: "objects",
        spec: {
          subNumberType: {
            type: "number",
          },
        },
      },
      objectType: {
        type: "object",
        spec: {
          subStringType: {
            type: "string",
          },
        },
      },
      enumType: {
        type: "enum",
        values: ["a", "b", "c"] as const, // this one can force the 'values' to be typesafe
        defaultValue: "c", // but this one can't get the typing correct
      },
      arrayOfNumber: {
        type: "numbers",
        defaultValue: [123],
      },
      arrayOfBoolean: {
        type: "booleans",
        optional: true,
        defaultValue: [true],
      },
      arrayOfEnum: {
        type: "enums",
        values: ["x", "y", "z"] as const, // this one can force the 'values' to be typesafe
      },
      objectOrUndefined: {
        type: "object",
        optional: true,
        spec: {
          number: {
            type: "number",
          },
        },
        // defaultValue: {},// need to find a way to create a type strict for this
      },
    });
    type SampleSpecification = SchemaType<typeof sampleSource>;
    type Test = SampleSpecification["arrayOfXType"];
    const sampleValid: SampleSpecification = {
      stringType: "123",
      stringOrUndefinedType: undefined,
      numberType: 123,
      booleanType: false,
      arrayOfXType: [
        {
          subNumberType: 123,
        },
      ],
      objectType: {
        subStringType: "123",
      },
      enumType: "a",
      arrayOfNumber: [123],
      arrayOfBoolean: undefined,
      arrayOfEnum: ["x"],
      objectOrUndefined: undefined,
    };
    expect(true);
  });
});
