import { objectSchema } from "./objectSchema";
import { validateSchema } from "./validateSchema";

describe("@hyulian/common.modules.schema.validateSchema", () => {
  it("should validate a schema with a string field", () => {
    const schema = objectSchema({
      name: { type: "string", minLength: 3, maxLength: 10 },
    });

    const values = { name: "John" };

    const result = validateSchema(values, schema);

    expect(result).toEqual({ errors: [], value: { name: "John" } });
  });

  it("should validate a schema with a number field", () => {
    const schema = objectSchema({
      age: { type: "number", min: 18, max: 99 },
    });

    const values = { age: 25 };

    const result = validateSchema(values, schema);

    expect(result).toEqual({ errors: [], value: { age: 25 } });
  });
  it("should validate a schema with a number field", () => {
    const schema = objectSchema({
      age: { type: "number" },
    });

    const values = { age: "25" } as any;

    const result = validateSchema(values, schema);

    expect(result).toEqual({
      errors: [
        {
          actual: "string",
          expected: "number",
          key: "age",
          type: "invalidType",
          value: "25",
        },
      ],
      value: { age: 25 },
    });
  });

  it("should validate a schema with a boolean field", () => {
    const schema = objectSchema({
      isActive: { type: "boolean" },
    });

    const values = { isActive: true };

    const result = validateSchema(values, schema);

    expect(result).toEqual({ errors: [], value: { isActive: true } });
  });

  it("should validate a schema with an optional field", () => {
    const schema = objectSchema({
      nickname: { type: "string", optional: true },
    });

    const values = {
      nickname: undefined,
    };

    const result = validateSchema(values, schema);

    expect(result).toEqual({ errors: [], value: {} });
  });

  it("should validate a schema with an enum field", () => {
    const schema = objectSchema({
      status: { type: "enum", values: ["active", "inactive"] },
    });

    const values = { status: "active" };

    const result = validateSchema(values, schema);

    expect(result).toEqual({ errors: [], value: { status: "active" } });
  });

  it("should validate a schema with an object field", () => {
    const schema = objectSchema({
      address: {
        type: "object",
        spec: {
          street: { type: "string" },
          number: { type: "number" },
        },
      },
    });

    const values = { address: { street: "Main St", number: 123 } };

    const result = validateSchema(values, schema);

    expect(result).toEqual({
      errors: [],
      value: { address: { street: "Main St", number: 123 } },
    });
  });

  it("should validate a schema with an array of primitives", () => {
    const schema = objectSchema({
      tags: {
        type: "strings",
        minLength: 1,
        maxLength: 5,
      },
    });

    const values = { tags: ["tag1", "tag2"] };

    const result = validateSchema(values, schema);

    expect(result).toEqual({ errors: [], value: { tags: ["tag1", "tag2"] } });
  });

  it("should validate a schema with an array of objects", () => {
    const schema = objectSchema({
      items: {
        type: "objects",
        spec: {
          name: { type: "string" },
        },
      },
    });

    const values = { items: [{ name: "item1" }, { name: "item2" }] };

    const result = validateSchema(values, schema);

    expect(result).toEqual({
      errors: [],
      value: { items: [{ name: "item1" }, { name: "item2" }] },
    });
  });

  it("should return errors for invalid values", () => {
    const schema = objectSchema({
      name: { type: "string", minLength: 3 },
      age: { type: "number", min: 18 },
    });

    const values = { name: "Jo", age: 17 };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "name",
      value: "Jo",
    });
    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "age",
      value: 17,
    });
  });
  it("should return an error for a string field that is too short", () => {
    const schema = objectSchema({
      name: { type: "string", minLength: 3 },
    });

    const values = { name: "Jo" };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "name",
      value: "Jo",
    });
  });

  it("should return an error for a string field that is too long", () => {
    const schema = objectSchema({
      name: { type: "string", maxLength: 5 },
    });

    const values = { name: "Jonathan" };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "name",
      value: "Jonathan",
    });
  });

  it("should return an error for a number field that is too small", () => {
    const schema = objectSchema({
      age: { type: "number", min: 18 },
    });

    const values = { age: 16 };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "age",
      value: 16,
    });
  });

  it("should return an error for a number field that is too large", () => {
    const schema = objectSchema({
      age: { type: "number", max: 65 },
    });

    const values = { age: 70 };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "age",
      value: 70,
    });
  });

  it("should return an error for a boolean field with invalid type", () => {
    const schema = objectSchema({
      isActive: { type: "boolean" },
    });

    const values: any = { isActive: "true" };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidType",
      key: "isActive",
      value: "true",
      actual: "string",
      expected: "boolean",
    });
  });

  it("should return an error for a missing required field", () => {
    const schema = objectSchema({
      name: { type: "string" },
    });

    const values: any = {};

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "required",
      key: "name",
      value: undefined,
    });
  });

  it("should return an error for an enum field with an invalid value", () => {
    const schema = objectSchema({
      status: { type: "enum", values: ["active", "inactive"] },
    });

    const values = { status: "draft" };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "status",
      value: "draft",
      expected: ["active", "inactive"],
    });
  });

  it("should return an error for an object field with invalid sub-field", () => {
    const schema = objectSchema({
      address: {
        type: "object",
        spec: {
          street: { type: "string" },
          number: { type: "number" },
        },
      },
    });

    const values: any = { address: { street: "Main St", number: "123" } };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidType",
      key: "address.number",
      value: "123",
      actual: "string",
      expected: "number",
    });
  });

  it("should return an error for an array of primitives with an invalid element type", () => {
    const schema = objectSchema({
      tags: {
        type: "strings",
      },
    });

    const values: any = { tags: ["tag1", 123] };

    const result: any = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidType",
      key: "tags.1",
      value: 123,
      actual: "number",
      expected: "string",
    });
  });

  it("should return an error for an array of objects with invalid sub-field", () => {
    const schema = objectSchema({
      items: {
        type: "objects",
        spec: {
          name: { type: "string" },
        },
      },
    });

    const values: any = { items: [{ name: "item1" }, { name: 2 }] };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidType",
      key: "items.1.name",
      value: 2,
      actual: "number",
      expected: "string",
    });
  });

  it("should return an error for an array of enums with an invalid value", () => {
    const schema = objectSchema({
      statuses: {
        type: "enums",
        values: ["active", "inactive"],
      },
    });

    const values = { statuses: ["active", "draft"] };

    const result = validateSchema(values, schema);

    expect(result.errors).toContainEqual({
      type: "invalidValue",
      key: "statuses.1",
      value: "draft",
      expected: ["active", "inactive"],
    });
  });
});
