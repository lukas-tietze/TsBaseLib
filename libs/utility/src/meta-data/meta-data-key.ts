/**
 * Stellt einen einzigartigen Schlüssel für Meta-Daten dar.
 */
export class MetadataKey<T> {
  /**
   * Die Bezeichnung des Schlüssels.
   */
  private readonly name: string;

  /**
   * Der Zähler für Indices, damit jeder Schlüssel einzigartig ist.
   */
  private static counter: number = 0;

  /**
   * Initialisiert eine neue Instanz der Klasse.
   */
  constructor() {
    this.name = 'MDK-' + (++MetadataKey.counter);
  }

  /**
   * Erzeugt die String-Repräsentation des Schlüssels.
   * Diese ist für jede Schlüssel-Instanz einzigartig.
   *
   * @returns Die String-Repräsentation des Schlüssels.
   */
  public toString(): string {
    return this.name;
  }
}
