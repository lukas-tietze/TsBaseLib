/**
 * Wirft einen Fehler mit der gegebenen Nachricht.
 * Im Gegensatz zum naiven `throw Error(...)` kann diese Funktion
 * als Ausdruck genutzt werden, z.B. `const a = foo() ?? throwError('no foo!')`.
 *
 * @param message Die Nachricht, die an den {@link Error}-Konstruktor übergeben werden soll.
 */
export function throwError(message?: string): never {
  throw new Error(message);
}
