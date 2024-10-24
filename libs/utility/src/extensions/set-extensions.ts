interface SetPartition<T> {
  leftDifference: T[];
  intersection: T[];
  rightDifference: T[];
}

declare global {
  interface Set<T> {
    /**
     * Ermittelt die Schnittmenge mit einem anderen {@link Set}.
     *
     * @param other Das {@link Set} mit dem die Schnittmenge gebildet werden soll.
     * @returns Die Schnittmenge beider Sets.
     */
    intersection(other: Set<T>): Set<T>;

    /**
     * Ermittelt die Differenz zu einem anderen {@link Set}.
     *
     * @param other Das {@link Set} mit dem die Differenz gebildet werden soll.
     * @returns Die Differenzmenge beider Sets.
     */
    difference(other: Set<T>): Set<T>;

    /**
     * Ermittelt die Vereinigungsmenge mit einem anderen {@link Set}.
     *
     * @param other Das {@link Set} mit dem die aktuelle Instanz vereinigt werden soll.
     * @returns Die Vereinigungsmenge beider Sets.
     */
    union(other: Set<T>): Set<T>;

    /**
     * Ermittelt Schnittmenge, linke Differenz und reche Differenz aus der Überschneidung
     * zweier Sets:
     *
     * - Schnittmenge: Die Menge der Elemente, die beiden Sets vorkommen.
     * - linke Differenz: Die Elemente, die nur in der aktuellen Instanz vorkommen.
     * - rechte Different: Die Elemente, die nur in {@link other} vorkommen.
     *
     * @param other Das {@link Set} mit dem die Überschneidung gebildet werden soll.
     * @returns Ein Objekt, dass die drei oben genannten Mengen enthält.
     */
    partition(other: Set<T>): SetPartition<T>;

    /**
     * Kopiert die Daten des Sets in ein Array.
     *
     * @returns Ein Array mit allen Elementen Des Sets.
     */
    toArray(): T[];

    /**
     * Prüft, ob die aktuelle Instanz und {@link other} dieselben Werte enthalten,
     * also, ob die Differenz leer ist.
     *
     * @param other Das zu vergleichende Set.
     * @returns `true`, wenn beide Sets dieselben Werte enthalten, sonst `false`.
     */
    equals(other: Set<T>): boolean;
  }
}

export function useSetExtensions() {
  if (!Set.prototype.intersection) {
    Set.prototype.intersection = function <T>(other: Set<T>): Set<T> {
      const res: Set<T> = new Set();

      for (const i of this) {
        if (other.has(i)) {
          res.add(i);
        }
      }

      return res;
    };
  }

  if (!Set.prototype.difference) {
    Set.prototype.difference = function <T>(other: Set<T>): Set<T> {
      const res: Set<T> = new Set();

      for (const i of this) {
        if (!other.has(i)) {
          res.add(i);
        }
      }

      return res;
    };
  }

  if (!Set.prototype.union) {
    Set.prototype.union = function <T>(other: Set<T>): Set<T> {
      const res: Set<T> = new Set();

      for (const i of this) {
        res.add(i);
      }

      for (const i of other) {
        res.add(i);
      }

      return res;
    };
  }

  if (!Set.prototype.partition) {
    Set.prototype.partition = function <T>(other: Set<T>): SetPartition<T> {
      const handledB: Set<T> = new Set();
      const res: SetPartition<T> = {
        intersection: [],
        leftDifference: [],
        rightDifference: [],
      };

      for (const itemA of this) {
        if (other.has(itemA)) {
          res.intersection.push(itemA);
          handledB.add(itemA);
        } else {
          res.leftDifference.push(itemA);
        }
      }

      for (const itemB of other) {
        if (!handledB.has(itemB)) {
          res.rightDifference.push(itemB);
        }
      }

      return res;
    };
  }

  if (!Set.prototype.toArray) {
    Set.prototype.toArray = function <T>(): T[] {
      return [...this];
    };
  }

  if (!Set.prototype.equals) {
    Set.prototype.equals = function <T>(other: Set<T>): boolean {
      return this.difference(other).size === 0;
    };
  }
}
