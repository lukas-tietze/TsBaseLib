import type { Scope } from './types.js';

/**
 * Stellt die Konfiguration eines injizierbaren Dienstes dar.
 */
export type InjectableConfig = {
  /**
   * Der Gültigkeitsbereich des injizierbaren Dienstes.
   */
  scope: Scope;
};
