const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w{2,}$/;

export function isEmail(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return emailRegex.test(value);
}
