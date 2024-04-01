import './all';

it('remove soll nur das erste Element entfernen', () => {
  const array = [1, 2, 3, 2];

  expect(array.remove(2)).toBeTruthy();
  expect(array).toEqual([1, 3, 2]);
});

it('remove soll Objekt-Identität nutzen', () => {
  const a = { a: 1 };
  const b = { a: 1 };

  let array = [a, b];
  expect(array.remove({ a: 1 })).toBe(false);
  expect(array).toEqual([a, b]);

  expect(array.remove(b)).toBe(true);
  expect(array.length).toBe(1);
  expect(array[0]).toBe(a);
});

it('remove soll strikte Gleichheit nutzen', () => {
  expect(['1', 2].remove(1)).toBe(false);
  expect(['2', 1].remove('1')).toBe(false);
});

it('padStart/padEnd sollen nichts tun, wenn das Array schon groß genug ist', () => {
  expect([1, 2, 3, 4].padStart(0)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padStart(4)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padStart(-3)).toEqual([1, 2, 3, 4]);

  expect([1, 2, 3, 4].padStart(0, 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padStart(4, 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padStart(-3, 42)).toEqual([1, 2, 3, 4]);

  expect([1, 2, 3, 4].padStart(0, () => 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padStart(4, () => 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padStart(-3, () => 42)).toEqual([1, 2, 3, 4]);

  expect([1, 2, 3, 4].padEnd(0)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padEnd(4)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padEnd(-3)).toEqual([1, 2, 3, 4]);

  expect([1, 2, 3, 4].padEnd(0, 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padEnd(4, 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padEnd(-3, 42)).toEqual([1, 2, 3, 4]);

  expect([1, 2, 3, 4].padEnd(0, () => 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padEnd(4, () => 42)).toEqual([1, 2, 3, 4]);
  expect([1, 2, 3, 4].padEnd(-3, () => 42)).toEqual([1, 2, 3, 4]);
});

test('first', () => {
  expect([].first()).toBeUndefined();
  expect([1, 2, 3].first()).toEqual(1);

  expect([].first(2)).toEqual([]);
  expect([].first(-2)).toEqual([]);
  expect([1, 2, 3].first(-2)).toEqual([]);
  expect([1, 2, 3].first(2)).toEqual([1, 2]);
  expect([1, 2, 3].first(4)).toEqual([1, 2, 3]);
});

test('last', () => {
  expect([].last()).toBeUndefined();
  expect([1, 2, 3].last()).toEqual(3);

  expect([].last(2)).toEqual([]);
  expect([].last(-2)).toEqual([]);
  expect([1, 2, 3].last(-2)).toEqual([]);
  expect([1, 2, 3].last(2)).toEqual([2, 3]);
  expect([1, 2, 3].last(4)).toEqual([1, 2, 3]);
});
