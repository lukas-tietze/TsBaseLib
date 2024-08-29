/**
 *Stellt zusätzliche Parameter für die Injektion von Parametern bereit.
 */
export interface InjectionHints {
  /**
   * Ein Array von Parametern, die vor den injizierten Parametern
   * übergeben werden.
   * Damit können auch injizierte Parameter überschrieben werden.
   */
  readonly insertParameters?: readonly unknown[];
}
