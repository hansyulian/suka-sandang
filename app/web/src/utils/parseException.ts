/* eslint-disable @typescript-eslint/no-explicit-any */
type ParsedException = {
  name: string;
  details: unknown;
  stack?: string[];
};

export function parseException(error: Error): ParsedException | undefined {
  const errorAny = error as any;
  if (errorAny.response?.data) {
    const data = errorAny.response?.data;
    return {
      name: data.name,
      details: data.details,
      stack: data.stack,
    };
  }
  return;
}
