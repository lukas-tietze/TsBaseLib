export const RecordUtil = {
  /**
   * Wendet eine Projektionsfunktion auf alle Schlüssel-Wert-Paare des gegebenen
   * Objekts an und erzeugt daraus ein neues Objekt mit den Schlüssel des gegebenen
   * Objekts und den projizierten Werten.
   *
   * @param record Das Ausgangsobjekt.
   * @param fn Die Projektionsfunktion.
   * @returns Das erzeugte Objekt.
   */
  map<Key extends string | number, OldValue, NewValue>(
    record: Partial<Record<Key, OldValue>>,
    fn: (value: OldValue, key: Key) => NewValue
  ): Record<Key, NewValue> {
    const result = {} as Record<Key, NewValue>;

    for (const key in record) {
      result[key] = fn(record[key]!, key as Key);
    }

    return result;
  },

  /**
   * Stellt sicher, dass im gegebenen Objekt alle gegebenen Schlüssel enthalten sind
   * und fügt ggf. fehlende Schlüssel. Beim hinzufügen eines Schlüssels wird der
   * entsprechende Wert über eine Funktion geliefert.
   *
   * @param record Das Ausgangsobjekt.
   * @param keys Die benötigten Schlüssel.
   * @param valueFn Die Funktion, die die Werte für fehlende Schlüssel erzeugt.
   * @returns Das Ausgangsobjekt {@link record}.
   */
  fillMissing<Key extends string | number, Value>(
    record: Partial<Record<Key, Value>>,
    keys: readonly Key[],
    valueFn: (key: Key) => Value
  ): Record<Key, Value> {
    for (const key of keys) {
      if (!(key in record)) {
        record[key] = valueFn(key);
      }
    }

    return record as Record<Key, Value>;
  },
} as const;
