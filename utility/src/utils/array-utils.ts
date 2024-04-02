/**
 * Wandelt den gegebenen Wert in ein Array um, falls er kein Array ist.
 *
 * @param arg Der zu prüfende Wert.
 * @returns Denselben Wert, falls es ein Array ist, oder ein Array, das den Wert enthält.
 */
function toArray<T>(arg: T | T[]): T[] {
  return Array.isArray(arg) ? arg : [arg];
}

/**
 * Erzeugt ein Array von `n` Elementen, die alle durch Aufruf
 * der gegebenen Generator-Funktion erzeugt werden.
 *
 * @param n Die Anzahl der zu erzeugenden Elemente.
 * @param fn Die Generator-Funktion, die die Elemente liefert.
 * @returns Das erzeugte Array.
 */
function iota<T>(n: number, fn: (i: number) => T): T[] {
  const arr: T[] = [];

  for (let i = 0; i < n; i++) {
    arr.push(fn(i));
  }

  return arr;
}

export const ArrayUtils = {
  toArray,
  iota,
} as const;
