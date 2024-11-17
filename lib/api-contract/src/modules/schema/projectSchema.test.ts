import { dateStringUtil } from "../custom";
import { objectSchema } from "./objectSchema";
import { projectSchema } from "./projectSchema";

describe("@hyulian/projectSchema", () => {
  it("should be able to project value properly with some robustness", () => {
    const sampleSpec = objectSchema({
      stringType: {
        type: "string",
      },
      numberType: {
        type: "number",
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
      dateStringType: {
        type: "dateString",
      },
      dateType: {
        type: "date",
      },
    });
    const now = new Date();
    const result = projectSchema(
      {
        stringType: 123, // should be stringified
        numberType: "123", // should be numberized
        arrayOfXType: [
          {
            subNumberType: "1", // should be stringified
            x: 123,
            y: "11",
            a: 123,
          },
          {
            subNumberType: 2,
            x: 2,
            z: 22,
          },
        ],
        objectType: {
          subStringType: "test",
          y: "test",
        },
        dateStringType: dateStringUtil.toDateString(new Date("2024-05-28")),
        e: 123,
        dateType: now,
      } as any,
      sampleSpec
    ) as any;

    expect(result.stringType).toStrictEqual("123");
    expect(result.numberType).toStrictEqual(123);
    expect(result.arrayOfXType).toEqual([
      { subNumberType: 1 },
      { subNumberType: 2 },
    ]);
    expect(result.objectType.subStringType).toStrictEqual("test");
    expect(result.dateStringType).toStrictEqual("2024-05-28T00:00:00.000Z");
    expect(result.objectType.y).toBeUndefined();
    expect(result.e).toBeUndefined();
    expect(result.dateType.getTime()).toStrictEqual(now.getTime());
  });
  it("should project any optional field value with undefined", () => {
    const sampleSpec = objectSchema({
      stringType: {
        type: "string",
        optional: true,
      },
      numberType: {
        type: "number",
        optional: true,
      },
      arrayOfXType: {
        type: "objects",
        optional: true,
        spec: {
          subNumberType: {
            type: "number",
            optional: true,
          },
        },
      },
      objectType: {
        type: "object",
        spec: {
          subStringType: {
            type: "string",
            optional: true,
          },
        },
      },
      objectOptionalType: {
        type: "object",
        spec: {
          subStringType: {
            type: "string",
            optional: true,
          },
        },
      },
      dateStringType: {
        type: "dateString",
        optional: true,
      },
      dateType: {
        type: "date",
        optional: true,
      },
    });
    const result = projectSchema({ objectType: {} } as any, sampleSpec);

    expect(result.stringType).toBeUndefined();
    expect(result.numberType).toBeUndefined();
    expect(result.arrayOfXType).toBeUndefined();
    expect(result.objectType.subStringType).toBeUndefined();
    expect(result.objectOptionalType).toBeUndefined();
    expect(result.dateStringType).toBeUndefined();
    expect(result.dateType).toBeUndefined();
  });
});
