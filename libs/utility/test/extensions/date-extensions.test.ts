import { beforeAll, describe, expect, it } from '@jest/globals';

import { useDateExtensions } from '../../src';

describe('date extensions', () => {
  beforeAll(() => useDateExtensions());

  it('should add hours correctly', () => {
    expect(new Date('2022-02-12 14:42:16').addHours(2)).toEqual(new Date('2022-02-12 16:42:16'));
  });

  it('should add minutes correctly', () => {
    expect(new Date('2022-02-12 14:42:16').addMinutes(2)).toEqual(new Date('2022-02-12 14:44:16'));
  });

  it('should add seconds correctly', () => {
    expect(new Date('2022-02-12 14:42:16').addSeconds(2)).toEqual(new Date('2022-02-12 14:42:18'));
  });
});
