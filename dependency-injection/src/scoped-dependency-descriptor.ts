import { DependencyDescriptor } from './dependency-descriptor';
import { InjectionHints } from './injection-hints';
import { Ctor, ProviderFunction } from './types';

import type { DiProvider } from './di-provider';
export class ScopedDependencyDescriptor<T> extends DependencyDescriptor<T> {
  private instance: T | undefined;
  private hasValue: boolean;
  private ctor: Ctor<T> | undefined;
  private providerFunction: ProviderFunction<T> | undefined;

  constructor(ctor: Ctor<T>, providerFunction: ProviderFunction<T> | undefined);
  constructor(ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T>);
  constructor(ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T> | undefined) {
    super('scoped');

    this.hasValue = false;
    this.ctor = ctor;
    this.providerFunction = providerFunction;
  }

  public getInstance(scopeProvider: DiProvider, hints?: InjectionHints): T {
    if (!this.hasValue) {
      if (this.ctor) {
        this.instance = this.instantiateWithInjectedParameters(this.ctor, scopeProvider, hints);
      } else if (this.providerFunction) {
        this.instance = this.providerFunction(scopeProvider);
      } else {
        throw new Error();
      }

      this.hasValue = true;
    }

    return this.instance!;
  }

  public forScopedProvider(): DependencyDescriptor<T> {
    return new ScopedDependencyDescriptor(this.ctor!, this.providerFunction!);
  }
}
