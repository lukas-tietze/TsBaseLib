/**
 * Ermöglicht das Caching beliebiger Werte.
 */
export class Cache {
  /**
   * Die gespeicherten Werte.
   */
  private items: Record<string, unknown> = {};

  /**
   * Holt ode setzt das Präfix, das auf alle Schlüssel angewendet wird.
   */
  private prefix: string = '';

  /**
   * Erzeugt eine neue {@link Cache}-Instanz, die auf dieselben
   * Daten zugreift wie die aktuelle Instanz, aber das gegebene
   * Präfix bei jedem Zugriff auf den Schlüssel anwendet.
   *
   * @param prefix Das anzuwendenden Präfix für die erzeugte Instanz.
   * @returns Die erzeugte Instanz.
   */
  public createScope(prefix: string): Cache {
    const cache = new Cache();

    cache.items = this.items;
    cache.prefix = this.prefix ? this.prefix + '/' + prefix : prefix;

    return cache;
  }

  /**
   * Ruft einen Wert aus dem Cache ab.
   *
   * @param key Der Schlüssel des gesuchten Wertes.
   * @returns Den gesuchten Wert oder `undefined`.
   */
  public get(key: string): unknown | undefined {
    return this.items[key];
  }

  /**
   * Ruft den Wert mit dem gegebenen Schlüssel aus dem Cache ab oder
   * fügt ihn hinzu, falls er nicht vorhanden ist.
   *
   * @param key Der gesuchte Schlüssel.
   * @param factory Die Funktion, die den einzufügenden Wert liefert, falls der Schlüssel noch nicht vorhanden ist.
   * @returns Den gefundenen oder hinzugefügten Wert.
   */
  public getOrAdd<T>(key: string, factory: () => T): T {
    return key in this.items ? (this.items[key] as T) : (this.items[key] = factory());
  }

  /**
   * Ruft den Wert mit dem gegebenen Schlüssel aus dem Cache ab oder
   * fügt ihn hinzu, falls er nicht vorhanden ist.
   *
   * @param key Der gesuchte Schlüssel.
   * @param factory Die Funktion, die den einzufügenden Wert liefert, falls der Schlüssel noch nicht vorhanden ist.
   * @returns Ein {@link Promise}, das die asynchrone Ausführung der Methode darstellt ung
   *          dessen Ergebnis der gefundene oder hinzugefügte Wert ist.
   */
  public async getOrAddAsync<T>(key: string, factory: () => Promise<T>): Promise<T> {
    return key in this.items ? (this.items[key] as T) : (this.items[key] = await factory());
  }

  /**
   * Ruft einen Wert aus dem Cache ab und legt dessen Typ fest.
   *
   * > Achtung: Nur ein Type-Script-Cast, keine tatsächliche Typprüfung!
   *
   * @param key Der Schlüssel des gesuchten Wertes.
   * @returns Den gesuchten Wert oder `undefined`.
   */
  public getAs<T>(key: string): T | undefined {
    return this.items[key] as T | undefined;
  }

  /**
   * Prüft, ob im Cache ein Wert für den gegebenen Schlüssel vorhanden ist oder nicht.
   *
   * @param key Der zu prüfende Schlüssel.
   * @returns `true`, wenn der Schlüssel im Cache enthalten ist und sonst `false`.
   */
  public has(key: string) {
    return key in this.items;
  }
}
