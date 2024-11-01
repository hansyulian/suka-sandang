import { formValidations } from "~/utils/formValidations";

describe("formValidations", () => {
  it("should return 'Required' when value is empty and required is true", () => {
    const validate = formValidations({ required: true });
    expect(validate(undefined)).toBe("Required");
    expect(validate(null)).toBe("Required");
    expect(validate("")).toBe("Required");
    expect(validate([])).toBe("Required");
    expect(validate(0)).toBe("Required");
  });

  it("should return undefined when value is provided and required is true", () => {
    const validate = formValidations({ required: true });
    expect(validate("non-empty string")).toBeUndefined();
  });

  it("should return 'Invalid Email' when email is true and value is not a valid email", () => {
    const validate = formValidations({ email: true });
    expect(validate("invalid-email")).toBe("Invalid Email");
  });

  it("should return undefined when email is true and value is a valid email", () => {
    const validate = formValidations({ email: true });
    expect(validate("test@example.com")).toBeUndefined();
  });

  it("should return undefined when no validations are applied", () => {
    const validate = formValidations({});
    expect(validate("some value")).toBeUndefined();
  });

  it("should apply both required and email validations", () => {
    const validate = formValidations({ required: true, email: true });

    // Test required validation
    expect(validate(undefined)).toBe("Required");

    // Test invalid email
    expect(validate("invalid-email")).toBe("Invalid Email");

    // Test valid email
    expect(validate("test@example.com")).toBeUndefined();
  });
});
