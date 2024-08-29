import type { InjectionHints } from './injection-hints.js';
import type { InjectionToken } from './injection-token.js';
import type { Ctor } from './types.js';

/**
 *
 */
export interface DiProvider {
  onUnknownScopedServiceAdded?: (type: Ctor<unknown>) => void;

  createScope(): DiProvider;

  getService<T>(token: InjectionToken<T> | Ctor<T>, hints?: InjectionHints): T;

  getOptionalService<T>(token: InjectionToken<T> | Ctor<T>, hints?: InjectionHints): T | undefined;
}
