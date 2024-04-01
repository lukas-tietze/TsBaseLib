/**
 * Dieser Typ stellt eine rekursive Anwendung von `Readonly<T>`
 * auf alle Member von `T` dar.
 * Alle Member aller Unterklassen sind schreibgeschützt.
 */
export type RecursiveReadonly<T> = {
  readonly [Key in keyof T]: T[Key] extends (infer U)[]
    ? readonly RecursiveReadonly<U>[]
    : T[Key] extends object
    ? RecursiveReadonly<T[Key]>
    : T[Key];
};
