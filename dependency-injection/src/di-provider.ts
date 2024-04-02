import type { InjectionHints } from './injection-hints';
import type { InjectionToken } from './injection-token';
import type { Ctor } from './types';

// TODO: Doku

export interface DiProvider {
  onUnknownScopedServiceAdded?: (type: Ctor<unknown>) => void;

  createScope(): DiProvider;

  getService<T>(token: InjectionToken<T> | Ctor<T>, hints?: InjectionHints): T;

  getOptionalService<T>(token: InjectionToken<T> | Ctor<T>, hints?: InjectionHints): T | undefined;
}
