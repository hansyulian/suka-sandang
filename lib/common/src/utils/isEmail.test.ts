import { isEmail } from "./isEmail";

describe("@hyulian/common.utils.isEmail", () => {
  it("should return true for valid email addresses", () => {
    expect(isEmail("test@example.com")).toBe(true);
    expect(isEmail("user.name@example.com")).toBe(true);
    expect(isEmail("firstname.lastname@example.com")).toBe(true);
    expect(isEmail("email@subdomain.example.com")).toBe(true);
    expect(isEmail("firstname+lastname@example.com")).toBe(true);
    expect(isEmail("email@example.co.uk")).toBe(true);
    expect(isEmail("email@subdomain.example.co.uk")).toBe(true);
    expect(isEmail("user_name@example.com")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(isEmail("plainaddress")).toBe(false); // Missing @
    expect(isEmail("@example.com")).toBe(false); // Missing local part
    expect(isEmail("email@")).toBe(false); // Missing domain
    expect(isEmail("email@.com")).toBe(false); // Invalid domain
    expect(isEmail("email@domain..com")).toBe(false); // Double dot in domain
    expect(isEmail("email@-example.com")).toBe(false); // Invalid character in domain
    expect(isEmail("email@domain.com-")).toBe(false); // Invalid character in domain
    expect(isEmail("email@domain.c")).toBe(false); // Domain too short
    expect(isEmail("email@domain..com")).toBe(false); // Double dot in domain
    expect(isEmail("email@domain")).toBe(false); // Domain without TLD
    expect(isEmail("email@.example.com")).toBe(false); // Leading dot in domain
    expect(isEmail("email@-example.com")).toBe(false); // Leading hyphen in domain
    expect(isEmail("email@example-.com")).toBe(false); // Trailing hyphen in domain
    expect(isEmail("email@example.com.")).toBe(false); // Trailing dot in domain
    expect(isEmail("email@example..com")).toBe(false); // Double dot in domain
    expect(isEmail("email@example")).toBe(false); // Domain without TLD
    expect(isEmail("plainaddress@example")).toBe(false); // Missing @
    expect(isEmail("email.example.com")).toBe(false); // Missing @
    expect(isEmail("email@example@example.com")).toBe(false); // Multiple @ symbols
    expect(isEmail("email@example.com (Joe Smith)")).toBe(false); // Special characters not allowed
    expect(isEmail("email@domain@example.com")).toBe(false); // Multiple @ symbols
  });
});
