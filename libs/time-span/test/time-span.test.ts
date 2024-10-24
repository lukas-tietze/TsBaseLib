import { describe, expect, it } from '@jest/globals';

import { TimeSpan } from '../src';

describe('time-span', () => {
  it('should initialize from milliseconds correctly', () => {
    expect(TimeSpan.fromMilliseconds(42).totalMilliseconds).toStrictEqual(42);
    expect(TimeSpan.fromMilliseconds(-42).totalMilliseconds).toStrictEqual(-42);
    expect(TimeSpan.fromMilliseconds(0).totalMilliseconds).toStrictEqual(0);
  });

  it('should initialize from seconds correctly', () => {
    expect(TimeSpan.fromSeconds(42).totalSeconds).toStrictEqual(42);
    expect(TimeSpan.fromSeconds(-42).totalSeconds).toStrictEqual(-42);
    expect(TimeSpan.fromSeconds(0).totalSeconds).toStrictEqual(0);
  });

  it('should initialize from minutes correctly', () => {
    expect(TimeSpan.fromMinutes(42).totalMinutes).toStrictEqual(42);
    expect(TimeSpan.fromMinutes(-42).totalMinutes).toStrictEqual(-42);
    expect(TimeSpan.fromMinutes(0).totalMinutes).toStrictEqual(0);
  });

  it('should initialize from hours correctly', () => {
    expect(TimeSpan.fromHours(42).totalHours).toStrictEqual(42);
    expect(TimeSpan.fromHours(-42).totalHours).toStrictEqual(-42);
    expect(TimeSpan.fromHours(0).totalHours).toStrictEqual(0);
  });

  it('should initialize from days correctly', () => {
    expect(TimeSpan.fromDays(42).totalDays).toStrictEqual(42);
    expect(TimeSpan.fromDays(-42).totalDays).toStrictEqual(-42);
    expect(TimeSpan.fromDays(0).totalDays).toStrictEqual(0);
  });

  it('should initialize from days correctly', () => {
    expect(TimeSpan.fromDays(42).totalDays).toStrictEqual(42);
    expect(TimeSpan.fromDays(-42).totalDays).toStrictEqual(-42);
    expect(TimeSpan.fromDays(0).totalDays).toStrictEqual(0);
  });

  it('should initialize from times correctly', () => {
    expect(TimeSpan.fromTimes({}).totalMilliseconds).toStrictEqual(0);
    expect(TimeSpan.fromTimes({ milliseconds: 42 }).totalMilliseconds).toStrictEqual(42);
    expect(TimeSpan.fromTimes({ milliseconds: -42 }).totalMilliseconds).toStrictEqual(0);
    expect(TimeSpan.fromTimes({ seconds: 42 }).totalSeconds).toStrictEqual(42);
    expect(TimeSpan.fromTimes({ seconds: -42 }).totalSeconds).toStrictEqual(0);
    expect(TimeSpan.fromTimes({ minutes: 42 }).totalMinutes).toStrictEqual(42);
    expect(TimeSpan.fromTimes({ minutes: -42 }).totalMinutes).toStrictEqual(0);
    expect(TimeSpan.fromTimes({ hours: 42 }).totalHours).toStrictEqual(42);
    expect(TimeSpan.fromTimes({ hours: -42 }).totalHours).toStrictEqual(0);
    expect(TimeSpan.fromTimes({ days: 42 }).totalDays).toStrictEqual(42);
    expect(TimeSpan.fromTimes({ days: -42 }).totalDays).toStrictEqual(0);
  });
  it('should initialize from compound times correctly', () => {
    let t = TimeSpan.fromTimes({ milliseconds: 100 });
    expect(t.totalMilliseconds).toStrictEqual(100);
    expect(t.milliseconds).toStrictEqual(100);

    t = TimeSpan.fromTimes({ milliseconds: 100, seconds: 10 });
    expect(t.totalMilliseconds).toStrictEqual(10100);
    expect(t.milliseconds).toStrictEqual(100);
    expect(t.seconds).toStrictEqual(10);

    t = TimeSpan.fromTimes({ milliseconds: 100, seconds: 10, minutes: 10 });
    expect(t.totalMilliseconds).toStrictEqual(610100);
    expect(t.milliseconds).toStrictEqual(100);
    expect(t.seconds).toStrictEqual(10);
    expect(t.minutes).toStrictEqual(10);

    t = TimeSpan.fromTimes({ milliseconds: 100, seconds: 10, minutes: 10, hours: 10 });
    expect(t.totalMilliseconds).toStrictEqual(36610100);
    expect(t.milliseconds).toStrictEqual(100);
    expect(t.seconds).toStrictEqual(10);
    expect(t.minutes).toStrictEqual(10);
    expect(t.hours).toStrictEqual(10);

    t = TimeSpan.fromTimes({ milliseconds: 100, seconds: 10, minutes: 10, hours: 10, days: 10 });
    expect(t.totalMilliseconds).toStrictEqual(900610100);
    expect(t.milliseconds).toStrictEqual(100);
    expect(t.seconds).toStrictEqual(10);
    expect(t.minutes).toStrictEqual(10);
    expect(t.hours).toStrictEqual(10);
    expect(t.days).toStrictEqual(10);
  });

  it('should convert correctly', () => {
    const t = TimeSpan.fromTimes({ milliseconds: 100, seconds: 10, minutes: 10, hours: 10, days: 10 });

    expect(t.totalMilliseconds).toBeCloseTo(900610100);
    expect(t.totalSeconds).toBeCloseTo(900610.1);
    expect(t.totalMinutes).toBeCloseTo(15010.17);
    expect(t.totalHours).toBeCloseTo(250.17);
    expect(t.totalDays).toBeCloseTo(10.42);
  });

  it('should format correctly', () => {
    expect(TimeSpan.fromTimes({ milliseconds: 5, seconds: 4, minutes: 3, hours: 2 }).toString()).toStrictEqual('2:03:04.005');

    expect(TimeSpan.fromTimes({ milliseconds: 5, seconds: 4, minutes: 3, hours: 2, days: 1 }).toString()).toStrictEqual('26:03:04.005');
    expect(
      TimeSpan.fromTimes({ milliseconds: 5, seconds: 4, minutes: 3, hours: 2, days: 1 }).toString({ milliseconds: false })
    ).toStrictEqual('26:03:04');
    expect(TimeSpan.fromTimes({ seconds: 4, minutes: 3, hours: 2, days: 1 }).toString()).toStrictEqual('26:03:04');
    expect(TimeSpan.fromTimes({ seconds: 4, minutes: 3, hours: 2, days: 1 }).toString({ milliseconds: true })).toStrictEqual(
      '26:03:04.000'
    );
  });

  it('should be formatted to json correctly', () => {
    const obj = {
      withMs: TimeSpan.fromTimes({ seconds: 10, milliseconds: 5 }),
      noMs: TimeSpan.fromTimes({ seconds: 10 }),
    };

    const json = JSON.stringify(obj);

    expect(JSON.parse(json)).toEqual({
      withMs: '0:00:10.005',
      noMs: '0:00:10',
    });
  });

  it('should be parsed correctly', () => {
    let t = TimeSpan.parse('0:10:10.005');

    expect(t.days).toStrictEqual(0);
    expect(t.hours).toStrictEqual(0);
    expect(t.minutes).toStrictEqual(10);
    expect(t.seconds).toStrictEqual(10);
    expect(t.milliseconds).toStrictEqual(5);

    t = TimeSpan.parse('49:00:00');

    expect(t.days).toStrictEqual(2);
    expect(t.hours).toStrictEqual(1);
    expect(t.minutes).toStrictEqual(0);
    expect(t.seconds).toStrictEqual(0);
    expect(t.milliseconds).toStrictEqual(0);

    t = TimeSpan.parse('-49:00:00');

    expect(t.days).toStrictEqual(-2);
    expect(t.hours).toStrictEqual(-1);
    expect(t.minutes).toStrictEqual(-0);
    expect(t.seconds).toStrictEqual(-0);
    expect(t.milliseconds).toStrictEqual(-0);
  });

  it('should format negative values correctly', () => {
    expect(TimeSpan.fromSeconds(-10).toString()).toEqual('-0:00:10')
    expect(TimeSpan.fromMinutes(-10).toString()).toEqual('-0:10:00')
    expect(TimeSpan.fromHours(-10).toString()).toEqual('-10:00:00')
    expect(TimeSpan.ZERO.addHours(-1).addMinutes(-1).addSeconds(-1).toString()).toEqual('-1:01:01')
  });
});
