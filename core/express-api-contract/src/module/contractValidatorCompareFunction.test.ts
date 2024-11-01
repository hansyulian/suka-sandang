import {
  InvalidTypeSchemaValidationExceptionDetail,
  RequiredSchemaValidationExceptionDetail,
} from "@hyulian/api-contract";
import { contractValidatorCompareFunction } from "~/module/contractValidatorCompareFunction";

describe("compareFunction", () => {
  it("should return -1 when the key of a is less than the key of b", () => {
    const a: RequiredSchemaValidationExceptionDetail = {
      key: "a",
      type: "required",
    };
    const b: RequiredSchemaValidationExceptionDetail = {
      key: "b",
      type: "required",
    };

    const result = contractValidatorCompareFunction(a, b);

    expect(result).toBe(-1); // because 'a' < 'b'
  });

  it("should return 1 when the key of a is greater than the key of b", () => {
    const a: RequiredSchemaValidationExceptionDetail = {
      key: "b",
      type: "required",
    };
    const b: RequiredSchemaValidationExceptionDetail = {
      key: "a",
      type: "required",
    };

    const result = contractValidatorCompareFunction(a, b);

    expect(result).toBe(1); // because 'b' > 'a'
  });

  it("should return 1 when the key is equal but the type of a is lesgreaters than the type of b", () => {
    const a: RequiredSchemaValidationExceptionDetail = {
      key: "key1",
      type: "required",
    };
    const b: InvalidTypeSchemaValidationExceptionDetail = {
      key: "key1",
      type: "invalidType",
      value: 123,
      expected: "string",
      actual: "number",
    };

    const result = contractValidatorCompareFunction(a, b);

    expect(result).toBe(-1); // because 'required' > 'invalidType'
  });

  it("should return -1 when the key is equal but the type of a is less than the type of b", () => {
    const a: InvalidTypeSchemaValidationExceptionDetail = {
      key: "key1",
      type: "invalidType",
      value: 123,
      expected: "string",
      actual: "number",
    };
    const b: RequiredSchemaValidationExceptionDetail = {
      key: "key1",
      type: "required",
    };

    const result = contractValidatorCompareFunction(a, b);

    expect(result).toBe(-1); // because 'invalidType' <>> 'required'
  });

  it("should return 0 when both key and type are equal", () => {
    const a: InvalidTypeSchemaValidationExceptionDetail = {
      key: "key1",
      type: "invalidType",
      value: 123,
      expected: "string",
      actual: "number",
    };
    const b: InvalidTypeSchemaValidationExceptionDetail = {
      key: "key1",
      type: "invalidType",
      value: 456,
      expected: "string",
      actual: "number",
    };

    const result = contractValidatorCompareFunction(a, b);

    expect(result).toBe(0); // because both key and type are equal
  });
});
