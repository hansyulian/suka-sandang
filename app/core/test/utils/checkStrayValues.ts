import { strayValues } from "~test/utils/injectStrayValues";

export function checkStrayValues(testSubject: Array<any> | any) {
  const keys = Object.keys(strayValues);
  if (Array.isArray(testSubject)) {
    for (const record of testSubject) {
      for (const key of keys) {
        expect(record[key]).toBeUndefined();
      }
    }
  } else {
    for (const key of keys) {
      expect((testSubject as any)[key]).toBeUndefined();
    }
  }
}
