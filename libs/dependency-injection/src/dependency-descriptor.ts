import { DiProvider } from './di-provider.js';
import { InjectableConfig } from './injectable-config.js';
import { InjectionHints } from './injection-hints.js';

import type { ProviderFunction, Scope } from './types.js';

/**
 * Stellt die Basisklasse für die Beschreibung eines injizierbaren Dienstes dar.
 */
export class DependencyDescriptor<T> {
  /**
   * Gibt an, ob bereits eine Instanz des Dienstes erzeugt wurde oder nicht.
   */
  private hasInstance: boolean;

  /**
   * Die Instanz des Dienstes.
   */
  private instance: T | undefined;

  /**
   * Initialisiert eine neue Instanz der Klasse.
   *
   * @param config Die Konfiguration.
   * @param provider Die Funktion, über die der Dienst bereitgestellt wird.
   */

  constructor(private config: InjectableConfig, private provider: ProviderFunction<T>) {
    this.hasInstance = false;
  }

  /**
   * Holt das Scope, über den der Dienst bereitgestellt wird.
   */
  public get scope(): Scope {
    return this.config.scope;
  }

  /**
   * Holt eine Instanz des Dienstes, die ggf. erst erstellt werden muss.
   *
   * @param scopeProvider Der ausführende  DI-Provider
   */
  public getInstance(scopeProvider: DiProvider, hints?: InjectionHints): T {
    if (this.scope === 'transient') {
      return this.provider(scopeProvider);
    }

    if (!this.hasInstance) {
      this.instance = this.provider(scopeProvider);
      this.hasInstance = true;
    }

    return this.instance as T;
  }

  /**
   * Erzeugt eine neue Instanz der Klasse für einen neues Scope.
   *
   * @returns Eine neue Instanz der Klasse.
   */
  public forScopedProvider(): DependencyDescriptor<T> {
    if (this.config.scope === 'singleton') {
      return this;
    }

    return new DependencyDescriptor(this.config, this.provider);
  }

  public clone(): DependencyDescriptor<T> {
    return new DependencyDescriptor(this.config, this.provider);
  }
}
