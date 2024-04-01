import { Observable, Subject } from 'rxjs';

import { Metadata } from '../meta-data';
import { InjectableConfig } from './injectable-config';
import { InjectableOptions } from './injectable-options';
import { DI_OPTIONS_METADATA_KEY } from './metadata-key';

/**
 * Register für alle Typen, die mit {@link Injectable} markiert sind.
 */
export const InjectableTypes: Function[] = [];

/**
 * Emittiert neue injizierbare Dienste hinzugefügt.
 */
const _injectableAdded$ = new Subject<[Function, InjectableConfig]>();

/**
 * Emittiert neue injizierbare Dienste hinzugefügt.
 */
export const injectableAdded$: Observable<[Function, InjectableConfig]> = _injectableAdded$;

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

    _injectableAdded$.next([target, injectableConfig]);
  };
}
