import type { RecursivePartial } from './recursive-partial.js';

/**
 * Beschreibt einen Konstruktor, der keine Parameter annimmt.
 */
export type DefaultConstructor<T> = new () => T;

/**
 * Beschreibt einen Konstruktor, der ein partielle Kopie des
 * eigenen Typs annimmt und diese Daten kopiert.
 */
export type CopyConstructor<T> = new (copy?: RecursivePartial<T>) => T;

/**
 * Beschreibt einen Konstruktor, der beliebige Parameter annimmt.
 */
export type AnyConstructor<T> = new (...params: any[]) => T;
