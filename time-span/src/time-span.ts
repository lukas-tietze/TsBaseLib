import { TimeSpanFormat } from './time-span-format';

/**
 * Schlüssel für Bestandteile einer Zeitspann.
 */
export type TimeSpanComponent = 'd' | 'h' | 'm' | 's' | 'ms';

/**
 * Stellt erweiterte Optionen für den Aufruf von {@link TimeSpan.toString} dar.
 */
export type ToStringOptions = {
  /**
   * Gibt an, ob Millisekunden dargestellt werden sollen oder nicht.
   * Standardmäßig werden Millisekunden dargestellt, wenn der Wert ungleich 0 ist.
   */
  milliseconds?: boolean;
};

/**
 * Stellt Daten zur Initialisierung einer {@link TimeSpan}-Instanz
 * aus verschiedenen Grundwerten bereit.
 */
type TimeSpanObjectInit = {
  /**
   * Die Anzahl der Tage.
   */
  days?: number;

  /**
   * Die Anzahl der Stunden.
   */
  hours?: number;

  /**
   * Die Anzahl der Minuten.
   */
  minutes?: number;

  /**
   * Die Anzahl der Sekunden.
   */
  seconds?: number;

  /**
   * Die Anzahl der Millisekunden.
   */
  milliseconds?: number;
};

/**
 * Stellt Optionen zum Initialisieren einer {@link TimeSpan}-Instanz
 * über {@link TimeSpan.fromAny} dar.
 */
export type TimeSpanInit = TimeSpan | string | number | TimeSpanObjectInit;

/**
 * Diese Klasse stellt eine Zeitspanne dar.
 */
export class TimeSpan {
  /**
   * Die Millisekunden pro Stunde.
   */
  public static readonly MS_HOUR = 3_600_000;

  /**
   * Die Millisekunden pro Tag.
   */
  public static readonly MS_DAY = 86_400_000;

  /**
   * Die Millisekunden pro Minute.
   */
  public static readonly MS_MINUTE = 60_000;

  /**
   * Die Millisekunden pro Sekunde.
   */
  public static readonly MS_SECOND = 1000;

  /**
   * Holt eine {@link TimeSpan}-Instanz, die eine Zeitspanne von 0 Sekunden darstellt.
   */
  public static readonly ZERO: TimeSpan = new TimeSpan(0);

  /**
   * Holt eine {@link TimeSpan}-Instanz, die die größte darstellbare Zeitspanne darstellt.
   */
  public static MAX: TimeSpan = new TimeSpan(Number.MAX_SAFE_INTEGER);

  /**
   * Die Millisekunden der dargestellten Zeitspanne.
   */
  private readonly value: number;

  /**
   * Initialisiert eine neue Instanz der Klasse mit den gegebenen Millisekunden.
   *
   * @param milliseconds Die initialen Millisekunden.
   */
  constructor(milliseconds: number) {
    this.value = milliseconds;
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz aus einem Wert, der wie folgt interpretiert wird:
   *
   * | Wert                                                | Verarbeitung                                 |
   * | --------------------------------------------------- | -------------------------------------------- |
   * | Instanz von {@link TimeSpan}                        | Kopie erzeugen                               |
   * | Objekt, das {@link TimeSpanObjectInit} entspricht   | Aufruf von {@link TimeSpan.fromTimes}        |
   * | Zahl                                                | Aufruf von {@link TimeSpan.fromMilliseconds} |
   * | String                                              | Aufruf von {@link TimeSpan.parse}            |
   *
   * @param init Der initiale Wert.
   * @returns Die erzeugte Instanz.
   */
  public static fromAny(init: TimeSpanInit): TimeSpan {
    if (typeof init === 'number') {
      return new TimeSpan(init);
    } else if (typeof init === 'string') {
      return TimeSpan.parse(init);
    } else if (typeof init === 'object') {
      if ('value' in init && typeof init.value === 'number') {
        return new TimeSpan(init.value);
      } else {
        return TimeSpan.fromTimes(init as TimeSpanObjectInit);
      }
    } else {
      throw new Error('TimeSpan initialization with illegal value');
    }
  }

  /**
   * Liest eine {@link TimeSpan}-Instanz aus einem String ein.
   * Das erlaubte Format ist dabei
   *
   * @param value Der auszuwertende String.
   * @returns Die erzeugte Instanz.
   */
  public static parse(value: string): TimeSpan {
    return new TimeSpan(this.msFromString(value));
  }

  /**
   * Erzeugt eine {@link TimeSpan}-Instanz aus Einzelwerten.
   * Diese Einzelwerte dürfen nicht negativ sein.
   *
   * @param value Die Einzelwerte.
   * @returns Die erzeugte Instanz.
   */
  public static fromTimes(value: TimeSpanObjectInit): TimeSpan {
    return new TimeSpan(this.msFromTimes(value));
  }

  /**
   * Berechnet die gesamten Millisekunden aus Einzelwerten.
   * Diese Einzelwerte dürfen nicht negativ sein.
   *
   * @param value Die Einzelwerte.
   * @returns Die erzeugte Instanz.
   */
  private static msFromTimes(value: TimeSpanObjectInit): number {
    return (
      Math.max(0, value.days || 0) * this.MS_DAY +
      Math.max(0, value.hours || 0) * this.MS_HOUR +
      Math.max(0, value.minutes || 0) * this.MS_MINUTE +
      Math.max(0, value.seconds || 0) * this.MS_SECOND +
      Math.max(0, value.milliseconds || 0)
    );
  }

  /**
   * Parst einen String und gibt die Millisekunden zurück. Erlaubt ist das Format, das
   * auch von {@link toString} genutzt wird, z.B.
   *
   * - `4:31:12`
   * - `0:00:00`
   * - `1251:00:00`
   * - `1:00:00.341`
   *
   * Beschreibung:
   * Formal: `[-]h[h[h[h...]]]:mm:ss[.fff]`
   * - optionales `-`
   * - beliebig viele Ziffern für die Angabe der Stunden
   * - Trennzeichen `:`
   * - 2 Ziffern für die Angabe der Minuten
   * - Trennzeichen `:`
   * - 2 Ziffern für die Angabe der Sekunden
   * - Trennzeichen `.`
   * - optional 3 Ziffern für die Angabe der Millisekunden
   */
  private static msFromString(value: string): number {
    const g = /^(?<minus>-)?(?<h>\d+):(?<m>\d{2}):(?<s>\d{2})(.(?<ms>\d{3}))?/.exec(value);

    if (!g?.length) {
      throw new Error(`Illegal string for TimeSpan "${value}"`);
    }

    const ms = this.msFromTimes({
      milliseconds: Number(g?.groups?.ms) || undefined,
      seconds: Number(g?.groups?.s) || undefined,
      minutes: Number(g?.groups?.m) || undefined,
      hours: Number(g?.groups?.h) || undefined,
    });

    return g?.groups?.minus ? -ms : ms;
  }

  /**
   * Holt die Dauer der Zeitspanne in Millisekunden.
   */
  public get totalMilliseconds(): number {
    return this.value;
  }

  /**
   * Holt die Millisekunden-Komponente.
   */
  public get milliseconds(): number {
    return this.value % TimeSpan.MS_SECOND;
  }

  /**
   * Holt die Sekunden-Komponente.
   */
  public get seconds(): number {
    return Math.trunc((this.value % TimeSpan.MS_MINUTE) / TimeSpan.MS_SECOND);
  }

  /**
   * Holt die Minuten-Komponente.
   */
  public get minutes(): number {
    return Math.trunc((this.value % TimeSpan.MS_HOUR) / TimeSpan.MS_MINUTE);
  }

  /**
   * Holt die Stunden-Komponente.
   */
  public get hours(): number {
    return Math.trunc((this.value % TimeSpan.MS_DAY) / TimeSpan.MS_HOUR);
  }

  /**
   * Holt die Tages-Komponente.
   */
  public get days(): number {
    return Math.trunc(this.value / TimeSpan.MS_DAY);
  }

  /**
   * Holt die Dauer der Zeitspanne in Sekunden.
   */
  public get totalSeconds(): number {
    return this.value / TimeSpan.MS_SECOND;
  }

  /**
   * Holt die Dauer der Zeitspanne in Minuten.
   */
  public get totalMinutes(): number {
    return this.value / TimeSpan.MS_MINUTE;
  }

  /**
   * Holt die Dauer der Zeitspanne in Stunden.
   */
  public get totalHours(): number {
    return this.value / TimeSpan.MS_HOUR;
  }

  /**
   * Holt die Dauer der Zeitspanne in Tagen.
   */
  public get totalDays(): number {
    return this.value / TimeSpan.MS_DAY;
  }

  /**
   * Gibt ein {@link Date} zurück, das dem jetzigen Zeitpunkt plus
   * der dargestellten Zeitspanne entspricht.
   *
   * @returns Ein {@link Date}, das dem aktuellen Zeitpunkt plus der dargestellten Zeitspanne entspricht.
   */
  public fromNow(): Date {
    return new Date(Date.now() + this.value);
  }

  /**
   * Addiert die dargestellte Zeitspanne zu einem gegeben Zeitpunkt.
   * Der Zeitpunkt kann dabei entweder als {@link Date}, als {@link string} oder
   * als {@link number} (in Ticks) gegeben werden.
   *
   * @param to Das Datum, zu dem die Zeitspanne hinzugefügt werden soll.
   * @returns Ein {@link Date}, das dem Zeitpunkt {@link to } plus der dargestellten Zeitspanne entspricht.
   */
  public addTo(to: Date | string | number): Date {
    return new Date(new Date(to).getTime() + this.value);
  }

  public subtractFrom(to: Date | string | number): Date {
    return new Date(new Date(to).getTime() - this.value);
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, deren Wert, die Summe
   * aus der aktuellen Instanz und {@link to} darstellt.
   *
   * @param to Der zweite Summand.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public add(other: TimeSpan): TimeSpan {
    return new TimeSpan(this.value + other.value);
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, deren Wert, die Differenz
   * aus der aktuellen Instanz und {@link to} darstellt.
   *
   * @param to Der Subtrahend.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public sub(other: TimeSpan): TimeSpan {
    return new TimeSpan(this.value - other.value);
  }

  /**
   * Erzeugt eine neue Zeitspanne, bei der die gegebenen Millisekunden addiert wurden.
   *
   * @param milliseconds Die zu addierenden Millisekunden.
   * @returns Die aktuelle Instanz.
   */
  public addMilliseconds(milliseconds: number): TimeSpan {
    return new TimeSpan(Math.round(this.value + milliseconds));
  }

  /**
   * Erzeugt eine neue Zeitspanne, bei der die gegebenen Sekunden addiert wurden.
   *
   * @param seconds Die zu addierenden Sekunden.
   * @returns Die aktuelle Instanz.
   */
  public addSeconds(seconds: number): TimeSpan {
    return new TimeSpan(Math.round(this.value + seconds * TimeSpan.MS_SECOND));
  }

  /**
   * Erzeugt eine neue Zeitspanne, bei der die gegebenen Minuten addiert wurden.
   *
   * @param minutes Die zu addierenden Minuten.
   * @returns Die aktuelle Instanz.
   */
  public addMinutes(minutes: number): TimeSpan {
    return new TimeSpan(Math.round(this.value + minutes * TimeSpan.MS_MINUTE));
  }

  /**
   * Erzeugt eine neue Zeitspanne, bei der die gegebenen Stunden addiert wurden.
   *
   * @param hours Die zu addierenden Stunden.
   * @returns Die aktuelle Instanz.
   */
  public addHours(hours: number): TimeSpan {
    return new TimeSpan(Math.round(this.value + hours * TimeSpan.MS_HOUR));
  }

  /**
   * Erzeugt eine neue Zeitspanne, bei der die gegebenen Tage addiert wurden.
   *
   * @param days Die zu addierenden Tage.
   * @returns Die aktuelle Instanz.
   */
  public addDays(days: number): TimeSpan {
    return new TimeSpan(Math.round(this.value + days * TimeSpan.MS_DAY));
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, die dem Betrag
   * der aktuellen Zeitspann entspricht.
   *
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public abs(): TimeSpan {
    return new TimeSpan(Math.abs(this.value));
  }

  /**
   * Vergleicht die dargestellte Zeitspanne mit {@link other} und
   * gibt einen Wert zurück, der die Reihenfolge der beiden Werte
   * angibt. eine Zahl `< 0` bedeutet, dass die aktuelle Instanz
   * *vor* {@link other} kommt, `0` bedeutet Gleichheit und eine Zahl
   * `> 0` bedeutet, dass die aktuelle Instanz *nach* {@link other}
   * kommt,
   *
   * Der Vergleichswert kann eine {@link TimeSpan}-Instanz sein, oder
   * ein String, der als Zeitspanne formatiert ist oder eine Zahl,
   * die als Millisekunden einer Zeitspanne interpretiert werden.
   *
   * @param other Der Vergleichswert.
   * @returns Eine Zahl, die die relative Ordnung der aktuellen Instanz zu {@link other} angibt.
   */
  public compare(other: TimeSpan | string | number): number {
    if (typeof other === 'object') {
      return this.value - other.value;
    } else if (typeof other === 'number') {
      return this.value - other;
    } else {
      return this.value - TimeSpan.parse(other).value;
    }
  }

  /**
   * Prüft, ob die aktuelle Instanz und {@link other} die gleiche
   * Zeitspanne darstellen.
   *
   * Der Vergleichswert kann eine {@link TimeSpan}-Instanz sein, oder
   * ein String, der als Zeitspanne formatiert ist oder eine Zahl,
   * die als Millisekunden einer Zeitspanne interpretiert werden.
   *
   * @param other Der Vergleichswert.
   * @returns `true`, wenn die aktuelle Instanz und {@link other} gleich sind, sonst `false`.
   */
  public equals(other: TimeSpan | string | number): boolean {
    return this.compare(other) === 0;
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, die eine Zeitspanne
   * über die gegebenen Millisekunden darstellt.
   *
   * @param milliseconds Die Millisekunden.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public static fromMilliseconds(milliseconds: number): TimeSpan {
    return new TimeSpan(milliseconds);
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, die eine Zeitspanne
   * über die gegebenen Sekunden darstellt.
   *
   * @param milliseconds Die Millisekunden.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public static fromSeconds(seconds: number): TimeSpan {
    return new TimeSpan(seconds * this.MS_SECOND);
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, die eine Zeitspanne
   * über die gegebenen Minuten darstellt.
   *
   * @param milliseconds Die Millisekunden.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public static fromMinutes(minutes: number): TimeSpan {
    return new TimeSpan(minutes * this.MS_MINUTE);
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, die eine Zeitspanne
   * über die gegebenen Stunden darstellt.
   *
   * @param milliseconds Die Millisekunden.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public static fromHours(hours: number): TimeSpan {
    return new TimeSpan(hours * this.MS_HOUR);
  }

  /**
   * Erzeugt eine neue {@link TimeSpan}-Instanz, die eine Zeitspanne
   * über die gegebenen Tage darstellt.
   *
   * @param milliseconds Die Millisekunden.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public static fromDays(days: number): TimeSpan {
    return new TimeSpan(days * this.MS_DAY);
  }

  /**
   * Erzeugt eine {@link TimeSpan}-Instanz, die die Zeit zwischen
   * {@link a} und {@link b} darstellt.
   * Wenn {@link b} vor {@link a} liegt, ist die Spanne negativ.
   *
   * @param a Der erste Zeitpunkt.
   * @param b Der zweite Zeitpunkt.
   * @returns Eine neue {@link TimeSpan}-Instanz.
   */
  public static fromDifference(a: Date | string | number, b: Date | string | number): TimeSpan {
    return new TimeSpan(new Date(b).getTime() - new Date(a).getTime());
  }

  /**
   * Formatiert die dargestellte Zeitspanne mit dem
   * gegebenen Format.
   *
   * @param format Das zu nutzende Format.
   * @returns Den formatierten String.
   */
  public format(format: TimeSpanFormat): string {
    return format.format(this);
  }

  /**
   * Erzeugt einen String, der die Zeitspanne darstellt.
   *
   * @returns Den erzeugten String.
   */
  public toString(options?: ToStringOptions): string {
    const hours = (this.hours + this.days * 24).toFixed(0);
    const minutes = this.minutes.toFixed(0).padStart(2, '0');
    const seconds = this.seconds.toFixed(0).padStart(2, '0');

    let res = `${hours}:${minutes}:${seconds}`;

    const ms = this.milliseconds;

    if (options?.milliseconds === true || (options?.milliseconds !== false && ms !== 0)) {
      res += '.' + ms.toFixed(0).padStart(3, '0');
    }

    return res;
  }

  /**
   * Wird von {@link JSON.stringify} aufgerufen und erzeugt
   * die String-Repräsentation der Zeitspanne für die Darstellung in JSON.
   *
   * @returns Den Wert zum Einfügen ins JSON.
   */
  public toJSON(): string {
    return this.toString();
  }

  /**
   * Gibt den numerischen Wert der Instanz zurück, das
   * ist die Anzahl der Millisekunden in der Zeitspanne.
   *
   * Diese Funktion wird z.B. aufgerufen, wenn die Instanz explizit
   * oder implizit in eine Zahl konvertiert wird.
   *
   * @returns Den numerischen Wert der Instanz.
   */
  public valueOf(): number {
    return this.value;
  }
}
