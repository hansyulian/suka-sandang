import { mergePaths } from './mergePaths';

describe('@hy/express.utils.mergePaths', () => {
  test('merges multiple paths with single slashes', () => {
    expect(mergePaths('/example/', '/with/', '/slashes/')).toBe(
      'example/with/slashes',
    );
    expect(mergePaths('///example///', '///with///', '///slashes///')).toBe(
      'example/with/slashes',
    );
  });

  test('removes empty strings from the result', () => {
    expect(mergePaths('/example/', '', '/with//slashes/')).toBe(
      'example/with/slashes',
    );
    expect(mergePaths('', '', '')).toBe('');
  });

  test('handles paths without slashes correctly', () => {
    expect(mergePaths('example', 'with', 'slashes')).toBe(
      'example/with/slashes',
    );
    expect(mergePaths('example', '', 'slashes')).toBe('example/slashes');
  });

  test('handles a single path', () => {
    expect(mergePaths('/example/')).toBe('example');
    expect(mergePaths('example')).toBe('example');
  });

  test('handles no paths', () => {
    expect(mergePaths()).toBe('');
  });
});
