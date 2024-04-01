import { DependencyDescriptor } from './dependency-descriptor';
import { DiProvider } from './di-provider';
import { InjectionHints } from './injection-hints';
import { Ctor, ProviderFunction, Scope } from './types';

// TODO: Doku

export class TransientDependencyDescriptor<T> extends DependencyDescriptor<T> {
  private ctor: Ctor<T> | undefined;
  private providerFunction: ProviderFunction<T> | undefined;

  constructor(ctor: Ctor<T>, providerFunction: ProviderFunction<T> | undefined);
  constructor(ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T>);
  constructor(ctor: Ctor<T> | undefined, providerFunction: ProviderFunction<T> | undefined) {
    super('transient');

    this.ctor = ctor;
    this.providerFunction = providerFunction;
  }

  public getInstance(scopeProvider: DiProvider, hints?: InjectionHints): T {
    return this.ctor ? this.instantiateWithInjectedParameters(this.ctor, scopeProvider, hints) : this.providerFunction!(scopeProvider);
  }

  public forScopedProvider(): DependencyDescriptor<T> {
    return new TransientDependencyDescriptor(this.ctor!, this.providerFunction!);
  }
}
