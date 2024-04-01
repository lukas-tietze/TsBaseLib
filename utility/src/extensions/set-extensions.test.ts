import { useSetExtensions } from './set-extensions';

useSetExtensions();

test('intersection', () => {
  const a = new Set([1, 2, 3, 4]);
  const b = new Set([1, 3, 5, 6]);

  expect(a.intersection(b).equals(new Set([1, 3]))).toBeTruthy();
});
