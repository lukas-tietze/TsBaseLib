import { AnyConstructor } from '../constructor';
import { Metadata } from '../meta-data';
import { throwError } from '../throw-helper';
import { DiProvider } from './di-provider';
import { InjectableConfig } from './injectable-config';
import { InjectionHints } from './injection-hints';
import { DI_OPTIONS_METADATA_KEY } from './metadata-key';
import { Scope } from './types';

// TODO: Doku

export abstract class DependencyDescriptor<T> {
  private config: InjectableConfig | undefined;

  constructor(scope: Scope) {
    this.scope = scope;
  }

  public readonly scope: Scope;

  public abstract getInstance(scopeProvider: DiProvider, hints?: InjectionHints): T;

  public abstract forScopedProvider(): DependencyDescriptor<T>;

  protected instantiateWithInjectedParameters(ctor: AnyConstructor<T>, scopedProvider: DiProvider, hints?: InjectionHints): T {
    if (scopedProvider instanceof ctor) {
      return scopedProvider;
    }

    // TODO: hints beachten.

    this.config ??= Metadata.fromConstructor(ctor).get<InjectableConfig>(DI_OPTIONS_METADATA_KEY) ?? { scope: 'scoped' };

    return new ctor(scopedProvider);
  }
}
