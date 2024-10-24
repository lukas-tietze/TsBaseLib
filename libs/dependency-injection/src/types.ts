import type { DiProvider } from './di-provider.js';

/**
 * Stellt einen Konstruktor mit beliebigen Parametern dar.
 */
export type Ctor<T> = (new (...params: any[]) => T) | (new () => T);

/**
 * TODO
 */
export type DiCtor<T> = (new (di: DiProvider) => T) | (new () => T);

/**
 * Holt den Ergebnistyp eines Aufrufs `new T()`, falls `T` ein Konstruktor ist.
 */
export type ConstructedType<T extends Ctor<unknown>> = T extends Ctor<infer TConstructed> ? TConstructed : never;

/**
 * Eine Funktion, die einen injizierbaren Dienst bereitstellt.
 */
export type ProviderFunction<T> = (scopedDi: DiProvider) => T;

/**
 * Scopes / Gültigkeitsbereiche für injizierbare Dienste.
 */
export type Scope = 'singleton' | 'scoped' | 'transient';
