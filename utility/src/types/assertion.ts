/**
 * Der Typ einer Funktion, die Sicherstellt, dass
 */
export type Assertion<TOut> = (arg: unknown) => arg is TOut;
