import { DependencyDescriptor } from './dependency-descriptor.js';
import { InjectionContext } from './inject.js';
import { InjectionHints } from './injection-hints.js';
import { InjectionToken } from './injection-token.js';

import type { Ctor, DiCtor } from './types.js';

/**
 * Implementierende Klasse stellen einen grundlegenden Container
 * für dependency-Injection dar.
 */
export class DiProvider {
  /**
   * Die Sammlung der injizierbaren Dienste.
   */
  private readonly descriptors = new Map<Ctor<unknown> | InjectionToken<unknown>, DependencyDescriptor<unknown>>();

  private readonly teardownHandlers: (() => void)[] = [];

  /**
   * Ein Stack zur Speicherung der Abfolge einer Dienst-Instanziierung.
   * Dadurch lassen sich zyklische Abhängigkeiten erkennen und auswerten.
   */
  private readonly instantiationStack: (Ctor<unknown> | InjectionToken<unknown>)[] = [];

  constructor(services?: Iterable<[Ctor<unknown> | InjectionToken<unknown>, DependencyDescriptor<unknown>]>) {
    if (services) {
      for (const [key, descriptor] of services) {
        this.descriptors.set(key, descriptor.forScopedProvider());
      }
    }
  }

  public createScope(): DiProvider {
    return new DiProvider(this.descriptors.entries());
  }

  public getService<T>(token: InjectionToken<T> | DiCtor<T>, hints?: InjectionHints): T {
    InjectionContext.enterContext(this);

    const service = this.getOptionalService(token, hints);

    if (!service) {
      throw new Error(`Für ${token instanceof InjectionToken ? 'das Token' : 'die Klasse'} ${token.name} ist kein Service registriert!`);
    }

    InjectionContext.leaveContext();

    return service;
  }

  public getOptionalService<T>(token: InjectionToken<T> | DiCtor<T>, hints?: InjectionHints): T | undefined {
    if (this.instantiationStack.includes(token)) {
      const path = this.instantiationStack.map((ctor) => (ctor instanceof InjectionToken ? '[Token]' : '[Type]') + ctor.name).join(' -> ');

      throw new Error(`Zirkuläre Abhängigkeit bei Dependency-Injection: ${path}`);
    }

    this.instantiationStack.push(token);

    let instance: T | undefined;

    try {
      let descriptor = this.descriptors.get(token) as DependencyDescriptor<T> | undefined;

      instance = descriptor?.getInstance(this, hints);
    } catch (e) {
      this.instantiationStack.splice(0, this.instantiationStack.length);

      throw e;
    }

    if (this.instantiationStack.pop() !== token) {
      throw new Error('Stack korrumpiert!');
    }

    return instance;
  }

  public addScopeTeardown(teardownFn: () => void) {
    this.teardownHandlers.push(teardownFn);
  }

  public teardown() {
    for (const teardownHandler of this.teardownHandlers) {
      teardownHandler();
    }
  }
}
