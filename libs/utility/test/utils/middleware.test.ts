import { beforeAll, describe, expect, it } from '@jest/globals';
import { AsyncUtils, MiddlewareStackBuilder } from '../../src';

describe('middleware', () => {
  it('should work with multiple arguments', () => {
    function handler(arg: number, prefix: string, suffix: string): string {
      return `${prefix}(${arg})${suffix}`;
    }

    const builder = new MiddlewareStackBuilder<typeof handler>();

    builder.add((num, prefix, suffix, next) => next(num + 2, prefix.repeat(2), suffix.repeat(2)));
    const fn = builder.build(handler);

    expect(fn(4, '>', '<')).toBe('>>(6)<<');
  });
  it('should work without arguments', () => {
    let someValue = 0;

    function handler(): string {
      return 'Test';
    }

    const builder = new MiddlewareStackBuilder<typeof handler>();

    builder.add((next) => {
      someValue++;

      return next();
    });

    const fn = builder.build(handler);

    expect(fn()).toBe('Test');
    expect(someValue).toBe(1);
  });
  it('should work with one argument', () => {
    function handler(arg: number): string {
      return `(${arg})`;
    }

    const builder = new MiddlewareStackBuilder<typeof handler>();

    builder.add((num, next) => next(num + 2));
    const fn = builder.build(handler);

    expect(fn(4)).toBe('(6)');
  });

  it('should work with async / Promise', async () => {
    async function handler(arg: number): Promise<string> {
      await AsyncUtils.delay(2);

      return `(${arg})`;
    }

    const builder = new MiddlewareStackBuilder<typeof handler>();

    builder.add(async (arg, next) => {
      await AsyncUtils.delay(2);

      return await next(arg + 2);
    });

    const fn = builder.build(handler);

    expect(await fn(5)).toBe('(7)');
  });

  it('should work with void return type', () => {
    const valueHolder = { handler: 0, middleware: 0 };

    function handler(arg: typeof valueHolder): void {
      arg.handler++;
    }

    const builder = new MiddlewareStackBuilder<typeof handler>();

    builder.add((arg, next) => {
      arg.middleware++;

      next(arg);
    });

    const fn = builder.build(handler);

    expect(fn(valueHolder)).toBe(void 0);
    expect(valueHolder.handler).toBe(1);
    expect(valueHolder.middleware).toBe(1);
  });
});
