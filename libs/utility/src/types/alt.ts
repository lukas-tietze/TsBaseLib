type None<T> = {
  [Key in keyof T]?: never;
};

type Alt2<T1 extends object, T2 extends object> = (T1 & None<T2>) | (None<T1> & T2);
type Alt3<T1 extends object, T2 extends object, T3 extends object> =
  | (T1 & None<T2> & None<T3>)
  | (None<T1> & T2 & None<T3>)
  | (None<T1> & None<T2> & T3);
type Alt4<T1 extends object, T2 extends object, T3 extends object, T4 extends object> =
  | (T1 & None<T2> & None<T3> & None<T4>)
  | (None<T1> & T2 & None<T3> & None<T4>)
  | (None<T1> & None<T2> & T3 & None<T4>)
  | (None<T1> & None<T2> & None<T3> & T4);

export type Alt<
  T1 extends object,
  T2 extends object,
  T3 extends object | undefined = undefined,
  T4 extends object | undefined = undefined
> = T4 extends object ? (T3 extends object ? Alt4<T1, T2, T3, T4> : Alt3<T1, T2, T4>) : T3 extends object ? Alt3<T1, T2, T3> : Alt2<T1, T2>;
