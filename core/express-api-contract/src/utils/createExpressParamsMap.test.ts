import { createExpressParamsMap } from './createExpressParamsMap';

describe('@base/atlas.createExpressParamsMap', () => {
  it('should create an Express params map from an object with string values', () => {
    const input = { name: 'Alice', age: '30' };
    const expectedOutput = { name: '{name}', age: '{age}' };
    const result = createExpressParamsMap(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should create an Express params map from an object with different types of values', () => {
    const input = { id: 1, isActive: true };
    const expectedOutput = { id: '{id}', isActive: '{isActive}' };
    const result = createExpressParamsMap(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should create an empty object when input is an empty object', () => {
    const input = {};
    const expectedOutput = {};
    const result = createExpressParamsMap(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should create an Express params map from an object with nested objects', () => {
    const input = { user: { name: 'Alice' }, isActive: true };
    const expectedOutput = { user: '{user}', isActive: '{isActive}' };
    const result = createExpressParamsMap(input);
    expect(result).toEqual(expectedOutput);
  });
});
