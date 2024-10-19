import { describe, expect, it } from '@jest/globals';
import { DiCollection, DiProvider } from '../src';

class Service {
  private static _id = 0;

  public id = Service._id++;
}

function createScopedServices(di: DiProvider) {
  const scope0 = di;

  const scope1 = scope0.createScope();
  const scope2 = scope0.createScope();
  const scope1a = scope1.createScope();
  const scope1b = scope1.createScope();

  return {
    service0: scope0.getService(Service),
    service1: scope0.getService(Service),
    scope1: {
      service0: scope1.getService(Service),
      service1: scope1.getService(Service),

      scope1a: {
        service0: scope1a.getService(Service),
        service1: scope1a.getService(Service),
      },

      scope1b: {
        service0: scope1b.getService(Service),
        service1: scope1b.getService(Service),
      },
    },
    scope2: {
      service0: scope2.getService(Service),
      service1: scope2.getService(Service),
    },
  };
}

describe('service lifetime', () => {
  it('should create scoped services correctly', () => {
    const di = new DiCollection().addScoped(Service).buildProvider();
    const test = createScopedServices(di);

    expect(test.service0).toBe(test.service1);
    expect(test.scope1.service0).toBe(test.scope1.service1);
    expect(test.scope1.scope1a.service0).toBe(test.scope1.scope1a.service1);
    expect(test.scope1.scope1b.service0).toBe(test.scope1.scope1b.service1);
    expect(test.scope2.service0).toBe(test.scope2.service1);

    expect(test.service0).not.toBe(test.scope1.service0);
    expect(test.service0).not.toBe(test.scope1.scope1a.service0);
    expect(test.service0).not.toBe(test.scope1.scope1b.service0);
    expect(test.service0).not.toBe(test.scope2.service0);

    expect(test.service1).not.toBe(test.scope1.service1);
    expect(test.service1).not.toBe(test.scope1.scope1a.service1);
    expect(test.service1).not.toBe(test.scope1.scope1b.service1);
    expect(test.service1).not.toBe(test.scope2.service1);

    expect(test.scope1.service0).not.toBe(test.scope1.scope1a.service0);
    expect(test.scope1.service0).not.toBe(test.scope1.scope1b.service0);
    expect(test.scope1.service0).not.toBe(test.scope2.service0);

    expect(test.scope1.service1).not.toBe(test.scope1.scope1a.service1);
    expect(test.scope1.service1).not.toBe(test.scope1.scope1b.service1);
    expect(test.scope1.service1).not.toBe(test.scope2.service1);

    expect(test.scope2.service0).not.toBe(test.scope1.scope1a.service0);
    expect(test.scope2.service0).not.toBe(test.scope1.scope1b.service0);

    expect(test.scope2.service1).not.toBe(test.scope1.scope1a.service1);
    expect(test.scope2.service1).not.toBe(test.scope1.scope1b.service1);

    expect(test.scope1.scope1a.service0).not.toBe(test.scope1.scope1b.service0);
    expect(test.scope1.scope1a.service1).not.toBe(test.scope1.scope1b.service1);
  });

  it('should create singleton services correctly', () => {
    const di = new DiCollection().addSingleton(Service).buildProvider();
    const test = createScopedServices(di);

    expect(test.service0).toBe(test.service1);
    expect(test.service0).toBe(test.scope1.service0);
    expect(test.service0).toBe(test.scope1.service1);
    expect(test.service0).toBe(test.scope1.scope1a.service0);
    expect(test.service0).toBe(test.scope1.scope1a.service1);
    expect(test.service0).toBe(test.scope1.scope1b.service0);
    expect(test.service0).toBe(test.scope1.scope1b.service1);
    expect(test.service0).toBe(test.scope2.service0);
    expect(test.service0).toBe(test.scope2.service1);
  });

  it('should create transient services correctly', () => {
    const di = new DiCollection().addTransient(Service).buildProvider();
    const test = createScopedServices(di);
    const all = [
      test.service0,
      test.service1,
      test.scope1.service0,
      test.scope1.service1,
      test.scope1.scope1a.service0,
      test.scope1.scope1a.service1,
      test.scope1.scope1b.service0,
      test.scope1.scope1b.service1,
      test.scope2.service0,
      test.scope2.service1,
    ];

    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        expect(all[i]).not.toBe(all[j]);
      }
    }
  });
});
