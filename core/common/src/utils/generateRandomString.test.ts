import { generateRandomString } from "./generateRandomString";

describe("@hyulian/common.utils.generateRandomString", () => {
  it("should return a string of the specified length with random characters", () => {
    const length = 10;
    const result = generateRandomString(length);
    // Verify that the result is a string of the specified length
    expect(result.length).toBe(length);
    // Verify that all characters in the result are from the defined character sets
    const characters = result.split("");
    const validCharacters = generateRandomString.DEFAULT_CHARACTERS;
    characters.forEach((char) => {
      expect(validCharacters).toContain(char);
    });
  });

  // Add more test cases as needed
});
