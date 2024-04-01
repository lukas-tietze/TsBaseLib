import { DependencyDescriptor } from './dependency-descriptor';
import { DiProvider } from './di-provider';
import { InjectionHints } from './injection-hints';
import { Ctor, ProviderFunction, Scope } from './types';

export class SingletonDependencyDescriptor<T> extends DependencyDescriptor<T> {
  private hasValue: boolean;

  private instance: T | undefined;

  private providerFunction: ProviderFunction<T> | undefined;

  private ctor: Ctor<T> | undefined;

  constructor(instance: T, ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T> | undefined);
  constructor(instance: T | undefined, ctor: Ctor<T>, providerFunction: ProviderFunction<T> | undefined);
  constructor(instance: T | undefined, ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T>);
  constructor(instance: T | undefined, ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T> | undefined) {
    super('singleton');

    this.ctor = ctor;
    this.providerFunction = providerFunction;
    this.instance = instance;
    this.hasValue = instance !== undefined || (ctor === undefined && providerFunction === undefined);
  }

  public getInstance(scopeProvider: DiProvider, hints?: InjectionHints): T {
    if (!this.hasValue) {
      if (this.ctor) {
        this.instance = this.instantiateWithInjectedParameters(this.ctor, scopeProvider, hints);
      } else if (this.providerFunction) {
        this.instance = this.providerFunction(scopeProvider);
      }

      this.hasValue = true;
    }

    return this.instance!;
  }

  public forScopedProvider(): DependencyDescriptor<T> {
    return this;
  }
}
