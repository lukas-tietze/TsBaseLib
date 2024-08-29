import type { Scope } from './types.js';

/**
 * Stellt Optionen für die Markierung injizierbarer Dienste dar.
 */
export interface InjectableOptions {
  /**
   * Das Scope, in dem der Dienst verfügbar gemacht werden soll.
   */
  scope: Scope;
}
