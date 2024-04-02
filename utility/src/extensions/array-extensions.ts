// -------------------------------------------------------------------------------
// Diese Datei erweitert die Funktion der eingebauten Klasse `Array<T>`.
// -------------------------------------------------------------------------------

/**
 * Eine Funktion, die Elemente zum Einfügen in ein Array erzeugt.
 * Die Funktion wird mit zwei Parametern aufgerufen:
 *
 * - `i`: Der Index an dem des zu erzeugende Element eingefügt wird.
 * - `a`: Das ursprüngliche Array, ohne die bisher erzeugten Elemente.
 */
type PadGeneratorFn<T> = (i: number, a: T[]) => T;

declare global {
  interface Array<T> {
    /**
     * Entfernt das gegebene Element aus dem Array, falls es enthalten ist.
     *
     * @param o Das zu entfernende Element.
     * @returns `true`, wenn das Element entfernt wurde, `false`, wenn das Element nicht enthalten war.
     */
    remove(o: T): boolean;

    /**
     * Fügt `undefined` so oft am Anfang des Arrays ein, sodass dessen Länge {@link len} beträgt.
     * Enthält das Array bereits {@link len} oder mehr Werte, passiert nichts.
     *
     * @param len Die Länge, die das Array nach dem Vorgang mindestens haben soll.
     * @returns Das Array, auf dem die Funktion aufgerufen wurde.
     */
    padStart(len: number): Array<T | undefined>;

    /**
     * Fügt {@link el} so oft am Anfang des Arrays ein, sodass dessen Länge {@link len} beträgt.
     * Enthält das Array bereits {@link len} oder mehr Werte, passiert nichts.
     *
     * @param len Die Länge, die das Array nach dem Vorgang mindestens haben soll.
     * @param el Das einzufügende Element.
     * @returns Das Array, auf dem die Funktion aufgerufen wurde.
     */
    padStart(len: number, el: T): Array<T>;

    /**
     * Fügt so viele Werte am Anfang des Arrays ein, sodass dessen Länge {@link len} beträgt.
     * Enthält das Array bereits {@link len} oder mehr Werte, passiert nichts.
     * Die eingefügten Werte werden von der Generatorfunktion {@link gen} erzeugt.
     *
     * @param len Die Länge, die das Array nach dem Vorgang mindestens haben soll.
     * @param el Die Generatorfunktion für neue Elemente. Muss {@link PadGeneratorFn} genügen.
     * @returns Das Array, auf dem die Funktion aufgerufen wurde.
     */
    padStart(len: number, gen: PadGeneratorFn<T>): Array<T>;

    /**
     * Fügt `undefined` so oft am Ende des Arrays ein, sodass dessen Länge {@link len} beträgt.
     * Enthält das Array bereits {@link len} oder mehr Werte, passiert nichts.
     *
     * @param len Die Länge, die das Array nach dem Vorgang mindestens haben soll.
     * @returns Das Array, auf dem die Funktion aufgerufen wurde.
     */
    padEnd(len: number): Array<T | undefined>;

    /**
     * Fügt {@link el} so oft am Ende des Arrays ein, sodass dessen Länge {@link len} beträgt.
     * Enthält das Array bereits {@link len} oder mehr Werte, passiert nichts.
     *
     * @param len Die Länge, die das Array nach dem Vorgang mindestens haben soll.
     * @param el Das einzufügende Element.
     * @returns Das Array, auf dem die Funktion aufgerufen wurde.
     */
    padEnd(len: number, el: T): Array<T>;

    /**
     * Fügt so viele Werte am Ende des Arrays ein, sodass dessen Länge {@link len} beträgt.
     * Enthält das Array bereits {@link len} oder mehr Werte, passiert nichts.
     * Die eingefügten Werte werden von der Generatorfunktion {@link gen} erzeugt.
     *
     * @param len Die Länge, die das Array nach dem Vorgang mindestens haben soll.
     * @param el Die Generatorfunktion für neue Elemente. Muss {@link PadGeneratorFn} genügen.
     * @returns Das Array, auf dem die Funktion aufgerufen wurde.
     */
    padEnd(len: number, gen: PadGeneratorFn<T>): Array<T>;

    /**
     * Erzeugt ein neues Array, das jedes Element im aktuellen Array nur ein Mal
     * enthält. Ob zwei Elemente als gleich angesehen werden, wird durch die Funktion
     * {@link comparator} bestimmt.
     *
     * @param comparator Eine Funktion, die bestimmt, ob zwei Elemente gleich sind oder nicht.
     * @returns Ein neues Array, das nur einzigartige Elemente enthält.
     */
    distinct(comparator?: (a: T, b: T) => boolean): Array<T>;

    /**
     * Erzeugt eine flache Kopie des Arrays.
     * Dasselbe wie `[...x]`, nur als Funktion.
     *
     * @returns Eine flache Kopie des aktuellen Arrays.
     */
    clone(): Array<T>;

    /**
     * Prüft, ob das Array leer ist oder nicht.
     *
     * @returns `this.length === 0`.
     */
    empty(): boolean;

    /**
     * Holt das erste Element des Arrays oder `undefined`, falls das Array leer ist.
     *
     * @returns Das erste Element des Arrays.
     */
    first(): T | undefined;

    /**
     * Erzeugt eine flache Kopie des Arrays mit den ersten {@link amount}
     * Werten.
     *
     * @param amount Die Anzahl der abzurufenden Elemente.
     * @returns Ein neues Array, das nur die ersten {@link amount} Elemente enthält.
     */
    first(amount: number): T[];

    /**
     * Erzeugt eine flache Kopie des Arrays _ohne_ die ersten {@link amount}
     * Werte.
     */
    skip(amount: number): T[];

    /**
     * Holt das letzte Element des Arrays oder `undefined`, falls das Array leer ist.
     *
     * @returns Das letzte Element des Arrays.
     */
    last(): T | undefined;

    /**
     * Erzeugt eine flache Kopie des Arrays mit den letzten {@link amount}
     * Werten.
     *
     * @param amount Die Anzahl der abzurufenden Elemente.
     * @returns Ein neues Array, das nur die letzten {@link amount} Elemente enthält.
     */
    last(amount: number): T[];

    /**
     * Erzeugt eine flache Kopie des Arrays _ohne_ die letzten {@link amount}
     * Werte.
     */
    skipLast(amount: number): T[];

    /**
     * Bildet jedes Element des Arrays durch {@link mapFn} ab und
     * verflacht das Ergebnis-Array.
     *
     * @param mapFn Die Abbildungsfunktion.
     * @returns Ein Array mit allen Elementen, die von {@link mapFn} generiert wurden.
     */
    mapMany<TOut>(mapFn: (value: T, index: number) => TOut[]): TOut[];

    /**
     * Erzeugt ein Gruppierung der Werte anhand der Werte, die {@link groupFn} liefer.
     * Die Funktion {@link groupFn} wird für jeden Wert ein Mal aufgerufen und ihre
     * Rückgabewert entscheidet, zu welcher Gruppe das Element hinzugefügt werden soll.
     *
     * @param groupFn Die Funktion, anhand derer Werte die Gruppierung erfolgt.
     * @returns Eine ungeordnete Gruppierung der Elemente.
     */
    groupBy<TGroup>(groupFn: (value: T, index: number) => TGroup): Map<TGroup, T[]>;

    /**
     * Mischt das Array. Die Positionen der Elemente werden zufällig vertauscht.
     * Es wird kein neues Array erstellt, sondern die aktuelle Instanz bearbeitet.
     *
     * @returns Die aktuelle Instanz.
     */
    shuffle(): T[];

    /**
     * Zählt, wie viele Elemente des Arrays das Prädikat {@link pred}
     * erfüllen.
     *
     * @param pred Das Prädikat, das für jedes Element mit dem jeweiligen Index aufgerufen wird.
     * @returns Die Anzahl der Elemente, für die der Aufruf von {@link pref} `true` ergab.
     */
    count(pred: (el: T, i: number) => boolean): number;
  }
}

/**
 * Registriert alle Erweiterungen für Arrays.
 */
export function useArrayExtensions(): void {
  if (!Array.prototype.skip) {
    Array.prototype.skip = Array.prototype.slice;
  }

  if (!Array.prototype.skipLast) {
    Array.prototype.skipLast = function <T>(amount: number): T[] {
      return this.slice(0, this.length - amount);
    };
  }

  if (!Array.prototype.empty) {
    Array.prototype.empty = function (): boolean {
      return this.length === 0;
    };
  }

  if (!Array.prototype.clone) {
    Array.prototype.clone = function <T>(): T[] {
      return [...this];
    };
  }

  if (!Array.prototype.remove) {
    Array.prototype.remove = function <T>(o: T): boolean {
      const i = this.indexOf(o);

      if (i >= 0) {
        this.splice(i, 1);
      }

      return i >= 0;
    };
  }

  function mkArray<T>(orig: T[], len: number): T[];
  function mkArray<T>(orig: T[], len: number, g: T | PadGeneratorFn<T>): (T | undefined)[];
  function mkArray<T>(orig: T[], len: number, g?: T | PadGeneratorFn<T>): (T | undefined)[] {
    const empty = Array(len).fill(0);

    return typeof g === 'function' ? empty.map((i) => (g as PadGeneratorFn<T>)(i, orig)) : empty.map(() => g);
  }

  if (!Array.prototype.padStart) {
    Array.prototype.padStart = function <T>(len: number, g?: T | PadGeneratorFn<T>): T[] {
      if (this.length < len) {
        this.push(...mkArray(this, len, g));
      }

      return this;
    };
  }

  if (!Array.prototype.padEnd) {
    Array.prototype.padEnd = function <T>(len: number, g?: T | PadGeneratorFn<T>): T[] {
      if (this.length < len) {
        this.unshift(...mkArray(this, len, g));
      }

      return this;
    };
  }

  if (!Array.prototype.distinct) {
    Array.prototype.distinct = function <T>(comparator?: (a: T, b: T) => boolean): T[] {
      const f = comparator ?? ((a, b) => a === b);

      return this.filter((v1, i, a) => a.findIndex((v2) => f(v1, v2)) === i);
    };
  }

  if (!Array.prototype.first) {
    Array.prototype.first = function <T>(amount?: number): T | T[] {
      return amount === undefined ? this[0] : this.slice(0, Math.clamp(amount, 0, this.length));
    };
  }

  if (!Array.prototype.last) {
    Array.prototype.last = function <T>(amount?: number): T | T[] {
      return amount === undefined ? this[this.length - 1] : this.slice(this.length - Math.clamp(amount, 0, this.length));
    };
  }

  if (!Array.prototype.mapMany) {
    Array.prototype.mapMany = function <TIn, TOut>(mapFn: (v: TIn, i: number) => TOut[]): TOut[] {
      return ([] as TOut[]).concat(...this.map((v, i) => mapFn(v, i)));
    };
  }

  if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function <T, TGroup>(groupFn: (value: T, index: number) => TGroup): Map<TGroup, T[]> {
      const res: Map<TGroup, T[]> = new Map();

      for (let i = 0; i < this.length; i++) {
        const key = groupFn(this[i], i);
        const v = res.get(key);

        if (v === undefined) {
          res.set(key, [this[i]]);
        } else {
          v.push(this[i]);
        }
      }

      return res;
    };
  }

  if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function <T>(): T[] {
      const n = this.length;

      for (let i = 0; i < n; i++) {
        const swapWith = Math.floor(Math.random() * (n - i) + i);
        const buf = this[i];
        this[i] = this[swapWith];
        this[swapWith] = buf;
      }

      return this;
    };
  }

  if (!Array.prototype.count) {
    Array.prototype.count = function <T>(pred: (el: T, index: number) => boolean): number {
      let n = 0;

      for (let i = 0; i < this.length; i++) {
        if (pred(this[i], i)) {
          n++;
        }
      }

      return n;
    };
  }
}
