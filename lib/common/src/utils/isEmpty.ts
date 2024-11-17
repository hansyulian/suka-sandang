export function isEmpty(someVar: any): boolean {
  if (someVar === undefined || someVar === null) {
    return true;
  }
  if (Array.isArray(someVar)) {
    return someVar.length === 0;
  }
  if (typeof someVar === 'object') {
    return Object.keys(someVar).length === 0 && someVar.constructor === Object;
  }
  const stringValue: string = someVar.toString();
  return !stringValue || stringValue.length === 0;
}
