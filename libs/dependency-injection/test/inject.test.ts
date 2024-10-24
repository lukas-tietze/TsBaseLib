import { describe, expect, it } from '@jest/globals';
import { DiCollection, DiProvider, inject, InjectionToken } from '../src';

const idToken = new InjectionToken<number>();

class Service {
  public id = inject(idToken);
}

describe('inject (direct injection without di-provider-reference)', () => {
  it('should inject services correctly', () => {
    let id = 4;
    const di = new DiCollection()
      .addSingleton(idToken, () => id)
      .addScoped(Service)
      .buildProvider();

    expect(di.getService(Service).id).toBe(id);

    id = 5;

    expect(di.createScope().getService(Service).id).toBe(4);
  });
});
