const CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SMALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const DEFAULT_CHARACTERS = CAPITAL_LETTERS + SMALL_LETTERS + NUMBERS;

export function generateRandomString(
  length: number,
  characters = DEFAULT_CHARACTERS,
): string {
  const charactersLength = characters.length;
  let result = '';
  while (result.length < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
generateRandomString.CAPITAL_LETTERS = CAPITAL_LETTERS;
generateRandomString.SMALL_LETTERS = SMALL_LETTERS;
generateRandomString.NUMBERS = NUMBERS;
generateRandomString.DEFAULT_CHARACTERS = DEFAULT_CHARACTERS;
