import { TimeSpan } from '../src';

describe('time-span', () => {
  it('should initialize from milliseconds correctly', () => {
    expect(TimeSpan.fromMilliseconds(42).totalMilliseconds).toStrictEqual(42);
  });
});
