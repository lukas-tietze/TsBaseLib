declare global {
  interface Map<K, V> {
    /**
     * Holt den Wert für Schlüssel {@link key}, falls der Schlüssel vorhanden ist,
     * oder fügt den Schlüssel {@link key} mit Wert {@link defaultValue} ein
     * und gibt dann {@link defaultValue} zurück, wenn der Schlüssel noch nicht
     * vorhanden ist.
     */
    getOrAdd(key: K, defaultValue: V): V;

    /**
     * Gibt den Wert für Schlüssel {@link key} zurück, falls der Schlüssel vorhanden ist
     * und sonst {@link defaultValue}.
     */
    getValueOrDefault(key: K, defaultValue: V): V;
  }
}

/**
 * Registriert die Erweiterungen für die Klasse {@link Map}.
 */
export function useMapExtensions(): void {
  if (!Map.prototype.getOrAdd) {
    Map.prototype.getOrAdd = function <K, V>(key: K, defaultValue: V) {
      if (this.has(key)) {
        return this.get(key);
      }

      this.set(key, defaultValue);

      return defaultValue;
    };
  }

  if (!Map.prototype.getValueOrDefault) {
    Map.prototype.getValueOrDefault = function <K, V>(key: K, defaultValue: V) {
      return this.has(key) ? this.get(key) : defaultValue;
    };
  }
}
