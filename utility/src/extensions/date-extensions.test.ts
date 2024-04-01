import './date-extensions';

// TODO: erweitern (negative Zeit, Overflow auf nächstgrößere Einheit)

test('addHours', () => {
  expect(new Date('2022-02-12 14:42:16').addHours(2)).toEqual(new Date('2022-02-12 16:42:16'));
});

test('addMinutes', () => {
  expect(new Date('2022-02-12 14:42:16').addMinutes(2)).toEqual(new Date('2022-02-12 14:44:16'));
});

test('addSeconds', () => {
  expect(new Date('2022-02-12 14:42:16').addSeconds(2)).toEqual(new Date('2022-02-12 14:42:18'));
});
