/**
 * Dieser Typ stellt eine rekursive Anwendung von `Partial<T>`
 * auf alle Member von `T` dar. Z.B. würde der Typ
 *
 * ```
 * interface Foo {
 *   bar: {
 *     baz:  {
 *       id: number;
 *     }
 *   }
 * }
 * ```
 *
 * mit `Partial<Foo>` zu
 *
 *  ```
 * interface Foo {
 *   bar?: {
 *     baz:  {
 *       id: number;
 *     }
 *   }
 * }
 * ```
 *
 *
 * (Nur die erste Ebene von Properties wird optional)
 * `RecursivePartial<Foo>` erzeugt hingegen:
 *
 *  ```
 * interface Foo {
 *   bar?: {
 *     baz?:  {
 *       id?: number;
 *     }
 *   }
 * }
 * ```
 *
 * (Alle Member aller Unterklassen sind optional)
 *
 * > Übernommen von https://stackoverflow.com/a/51365037/5105949
 */
export type RecursivePartial<T> = {
  [P in keyof T as T[P] extends Function ? never : P]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Date
    ? T[P]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
