import { beforeAll, describe, expect, it } from '@jest/globals';

import { useSetExtensions } from '../../src/extensions/set-extensions';

describe('set extensions', () => {
  beforeAll(() => useSetExtensions());

  it('should intersect correctly', () => {
    const a = new Set([1, 2, 3, 4]);
    const b = new Set([1, 3, 5, 6]);

    expect(a.intersection(b).equals(new Set([1, 3]))).toBeTruthy();
  });
});
