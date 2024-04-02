import { InjectableConfig } from './injectable-config';
import { InjectableOptions } from './injectable-options';

/**
 * Register für alle Typen, die mit {@link Injectable} markiert sind.
 */
export const InjectableTypes: { ctor: Function; options: InjectableConfig }[] = [];

/**
 * Markiert eine Klasse als injizierbar.
 * Eine solche Klasse kann in DI-Containern genutzt werden
 * und ihre Konstruktor-Parameter werden automatisch injiziert.
 *
 * @param options Die anzuwendenden Optionen.
 * @returns Einen Klassen-Dekorator.
 */
export function Injectable(options: InjectableOptions) {
  return (target: Function) => {
    InjectableTypes.push({
      ctor: target,
      options: {
        scope: options.scope,
      },
    });
  };
}
