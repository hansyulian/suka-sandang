import { unslash } from './unslash';

describe('@hy/express.utils.unslash', () => {
  test('removes leading slashes', () => {
    expect(unslash('/example/')).toBe('example');
    expect(unslash('///example/')).toBe('example');
  });

  test('removes trailing slashes', () => {
    expect(unslash('/example/')).toBe('example');
    expect(unslash('/example///')).toBe('example');
  });

  test('replaces multiple slashes with a single slash', () => {
    expect(unslash('/example//with///slashes/')).toBe('example/with/slashes');
    expect(unslash('///example//with///slashes///')).toBe(
      'example/with/slashes',
    );
  });

  test('handles strings without slashes correctly', () => {
    expect(unslash('example')).toBe('example');
    expect(unslash('example/with/slashes')).toBe('example/with/slashes');
  });

  test('handles empty strings correctly', () => {
    expect(unslash('')).toBe('');
  });
});
