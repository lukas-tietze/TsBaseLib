import { InjectableConfig } from './injectable-config';
import { InjectableOptions } from './injectable-options';
import { DI_OPTIONS_METADATA_KEY } from './metadata-key';

/**
 * Register für alle Typen, die mit {@link Injectable} markiert sind.
 */
export const InjectableTypes: Function[] = [];

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
    InjectableTypes.push(target);

    const injectableConfig = Metadata.fromConstructor(target).set(DI_OPTIONS_METADATA_KEY, {
      scope: options.scope,
    } satisfies InjectableConfig);
  };
}
