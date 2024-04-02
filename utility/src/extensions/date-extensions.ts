// -------------------------------------------------------------------------------
// Diese Datei erweitert die Funktion der eingebauten Klasse `Date`.
// -------------------------------------------------------------------------------

declare global {
  interface Date {
    /**
     * Erzeugt eine neue {@link Date}-Instanz, die der aktuellen Instanz plus
     * der gegebenen Stunden entspricht.
     *
     * @param hours Die zu addierenden Stunden.
     * @returns Eine neue {@link Date}-Instanz zu der die gegebenen Stunden addiert wurden.
     */
    addHours(hours: number): Date;

    /**
     * Erzeugt eine neue {@link Date}-Instanz, die der aktuellen Instanz plus
     * der gegebenen Minuten entspricht.
     *
     * @param minutes Die zu addierenden Minuten.
     * @returns Eine neue {@link Date}-Instanz zu der die gegebenen Minuten addiert wurden.
     */
    addMinutes(minutes: number): Date;

    /**
     * Erzeugt eine neue {@link Date}-Instanz, die der aktuellen Instanz plus
     * der gegebenen Sekunden entspricht.
     *
     * @param seconds Die zu addierenden Sekunden.
     * @returns Eine neue {@link Date}-Instanz zu der die gegebenen Sekunden addiert wurden.
     */
    addSeconds(seconds: number): Date;

    /**
     * Erzeugt einen Zeitstempel im Format `YYYY-MM-DD hh:mm:ss.fff`.
     *
     * @returns Das Datum als Zeitstempel.
     */
    toTimeStampString(): string;

    /**
     * Vergleicht die aktuelle Instanz mit {@link other} und
     * gibt einen Wert zurück, der die Reihenfolge beider Instanzen darstellt.
     *
     * @param other Die Instanz mit der die aktuelle Instanz verglichen werden soll.
     * @returns - `< 0` wenn die aktuelle Instanz vor {@link other} liegt
     *          - `= 0` wenn beide gleich sind.
     *          - `> 0` wenn die aktuelle Instanz nach {@link other} kommt
     */
    compare(other: Date): number;
  }
}

/**
 * Registriert die Erweiterungen für die Klasse {@link Date}.
 */
export function useDateExtensions(): void {
  if (!Date.prototype.addHours) {
    Date.prototype.addHours = function (hours: number) {
      const copy = new Date(this);

      copy.setHours(copy.getHours() + hours);

      return copy;
    };
  }

  if (!Date.prototype.addMinutes) {
    Date.prototype.addMinutes = function (minutes: number) {
      const copy = new Date(this);

      copy.setMinutes(copy.getMinutes() + minutes);

      return copy;
    };
  }

  if (!Date.prototype.addSeconds) {
    Date.prototype.addSeconds = function (seconds: number) {
      const copy = new Date(this);

      copy.setSeconds(copy.getSeconds() + seconds);

      return copy;
    };
  }

  if (!Date.prototype.toTimeStampString) {
    Date.prototype.toTimeStampString = function () {
      const YYYY = this.getUTCFullYear();
      const MM = this.getUTCMonth().toString().padStart(2, '0');
      const DD = this.getUTCDate().toString().padStart(2, '0');
      const hh = this.getUTCHours().toString().padStart(2, '0');
      const mm = this.getUTCMinutes().toString().padStart(2, '0');
      const ss = this.getUTCSeconds().toString().padStart(2, '0');
      const fff = this.getUTCMilliseconds().toString().padStart(3, '0');

      return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}.${fff}`;
    };
  }

  if (!Date.prototype.compare) {
    Date.prototype.compare = function (other: Date) {
      return this.getTime() - other.getTime();
    };
  }
}
