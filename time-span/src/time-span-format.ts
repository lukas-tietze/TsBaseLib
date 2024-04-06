import { TimeSpan, TimeSpanComponent } from './time-span.js';

/**
 * Stellt ein Format für Zeitspannen dar.
 */

export class TimeSpanFormat {
  private static readonly MIN_FORMAT: Readonly<Record<TimeSpanComponent, number>> = {
    d: TimeSpan.MS_DAY,
    h: TimeSpan.MS_HOUR,
    m: TimeSpan.MS_MINUTE,
    s: TimeSpan.MS_SECOND,
    ms: 0,
  };

  private static readonly MAX_FORMAT: Readonly<Record<TimeSpanComponent, number>> = {
    d: Number.MAX_SAFE_INTEGER,
    h: TimeSpan.MS_DAY,
    m: TimeSpan.MS_HOUR,
    s: TimeSpan.MS_MINUTE,
    ms: TimeSpan.MS_SECOND,
  };

  private static readonly DEFAULT_UNITS: Readonly<Record<TimeSpanComponent, string>> = {
    d: 'd',
    h: 'h',
    m: 'm',
    s: 's',
    ms: 'ms',
  };

  private static readonly EMPTY_UNITS: Readonly<Record<TimeSpanComponent, string>> = {
    d: '',
    h: '',
    m: '',
    s: '',
    ms: '',
  };

  private static readonly FULL_LEADING_ZEROS: Readonly<Record<TimeSpanComponent, number>> = {
    d: 2,
    h: 2,
    m: 2,
    s: 2,
    ms: 3,
  };

  private static readonly NO_LEADING_ZEROS: Readonly<Record<TimeSpanComponent, number>> = {
    d: 0,
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  };

  private readonly units: Record<TimeSpanComponent, string>;
  private readonly leadingZeros: Record<TimeSpanComponent, number>;
  private readonly separator: string;
  private readonly showZero: boolean;
  private readonly showDays: boolean;
  private readonly showHours: boolean;
  private readonly showMinutes: boolean;
  private readonly showSeconds: boolean;
  private readonly showMilliseconds: boolean;
  private readonly intl: Intl.NumberFormat;

  constructor(
    culture: string | undefined,
    options: {
      separator?: string;
      min?: TimeSpanComponent;
      max?: TimeSpanComponent;
      units?: Partial<Record<TimeSpanComponent, string>> | false;
      numberStyles?: 'full' | 'numeric' | Partial<Record<TimeSpanComponent, 'full' | 'numeric'>>;
      showZero?: boolean;
    }
  ) {
    this.intl = new Intl.NumberFormat(culture);

    switch (options.numberStyles) {
      case 'full':
        this.leadingZeros = TimeSpanFormat.FULL_LEADING_ZEROS;
        break;
      case 'numeric':
        this.leadingZeros = TimeSpanFormat.NO_LEADING_ZEROS;
        break;
      default:
        this.leadingZeros = {
          d: options.numberStyles?.d === 'full' ? TimeSpanFormat.FULL_LEADING_ZEROS.d : TimeSpanFormat.NO_LEADING_ZEROS.d,
          h: options.numberStyles?.h === 'full' ? TimeSpanFormat.FULL_LEADING_ZEROS.h : TimeSpanFormat.NO_LEADING_ZEROS.h,
          m: options.numberStyles?.m === 'full' ? TimeSpanFormat.FULL_LEADING_ZEROS.m : TimeSpanFormat.NO_LEADING_ZEROS.m,
          s: options.numberStyles?.s === 'full' ? TimeSpanFormat.FULL_LEADING_ZEROS.s : TimeSpanFormat.NO_LEADING_ZEROS.s,
          ms: options.numberStyles?.ms === 'full' ? TimeSpanFormat.FULL_LEADING_ZEROS.ms : TimeSpanFormat.NO_LEADING_ZEROS.ms,
        };
        break;
    }

    const min = TimeSpanFormat.MIN_FORMAT[options.min ?? 'ms'];
    const max = TimeSpanFormat.MAX_FORMAT[options.max ?? 'd'];

    this.showDays = max > TimeSpan.MS_DAY;
    this.showHours = max > TimeSpan.MS_HOUR && min <= TimeSpan.MS_HOUR;
    this.showMinutes = max > TimeSpan.MS_MINUTE && min <= TimeSpan.MS_HOUR;
    this.showSeconds = max > TimeSpan.MS_SECOND && min <= TimeSpan.MS_SECOND;
    this.showMilliseconds = min <= 0;

    switch (options.units) {
      case false:
        this.units = TimeSpanFormat.EMPTY_UNITS;
        break;
      case undefined:
        this.units = TimeSpanFormat.DEFAULT_UNITS;
        break;
      default:
        this.units = {
          d: options.units.d ?? 'd',
          h: options.units.h ?? 'h',
          m: options.units.m ?? 'm',
          s: options.units.s ?? 's',
          ms: options.units.ms ?? 'ms',
        };
    }
    this.separator = options.separator ?? '';
    this.showZero = options.showZero ?? false;

    this.format = this.format.bind(this);
  }

  //// TODO: Doku
  public static Hours(culture: string | undefined): TimeSpanFormat {
    return new TimeSpanFormat(culture, {
      separator: ':',
      units: {
        h: '',
        m: 'h',
      },
      max: 'h',
      min: 'm',
      showZero: true,
      numberStyles: {
        h: 'numeric',
        m: 'full',
      },
    });
  }

  //// TODO: Doku
  public static Default(culture: string | undefined): TimeSpanFormat {
    return new TimeSpanFormat(culture, {
      separator: ':',
      units: false,
      max: 'h',
      min: 's',
      showZero: true,
      numberStyles: 'full',
    });
  }

  /**
   * Formatiert die Zeitspanne {@link format} entsprechend
   * der Optionen der aktuellen Instanz.
   *
   * @param timeSpan Der zu formatierende Wert.
   * @returns Den erzeugten String.
   */
  public format(timeSpan: TimeSpan): string {
    let total = Math.abs(timeSpan.totalMilliseconds);
    let res = '';

    if (this.showDays) {
      let amount: number | undefined;

      if (total > TimeSpan.MS_DAY) {
        amount = Math.floor(total / TimeSpan.MS_DAY);
        total -= amount * TimeSpan.MS_DAY;
      } else if (this.showZero) {
        amount = 0;
      }

      if (amount !== undefined) {
        res += this.intl.format(amount).padStart(this.leadingZeros.d, '0') + this.units.d + this.separator;
      }
    }

    if (this.showHours) {
      let amount: number | undefined;

      if (total > TimeSpan.MS_HOUR) {
        amount = Math.floor(total / TimeSpan.MS_HOUR);
        total -= amount * TimeSpan.MS_HOUR;
      } else if (this.showZero || (res && this.showMinutes)) {
        amount = 0;
      }

      if (amount !== undefined) {
        res += this.intl.format(amount).padStart(this.leadingZeros.h, '0') + this.units.h + this.separator;
      }
    }

    if (this.showMinutes) {
      let amount: number | undefined;

      if (total > TimeSpan.MS_MINUTE) {
        amount = Math.floor(total / TimeSpan.MS_MINUTE);
        total -= amount * TimeSpan.MS_MINUTE;
      } else if (this.showZero || (res && this.showSeconds)) {
        amount = 0;
      }

      if (amount !== undefined) {
        res += this.intl.format(amount).padStart(this.leadingZeros.m, '0') + this.units.m + this.separator;
      }
    }

    if (this.showSeconds) {
      let amount: number | undefined;

      if (total > TimeSpan.MS_SECOND) {
        amount = Math.floor(total / TimeSpan.MS_SECOND);
        total -= amount * TimeSpan.MS_SECOND;
      } else if (this.showZero || (res && this.showMilliseconds)) {
        amount = 0;
      }

      if (amount !== undefined) {
        res += this.intl.format(amount).padStart(this.leadingZeros.s, '0') + this.units.s + this.separator;
      }
    }

    if (this.showMilliseconds && (total > 0 || this.showZero)) {
      res += Math.floor(total).toString().padStart(this.leadingZeros.ms, '0') + this.units.ms;
    }

    res = res.endsWith(this.separator) ? res.substring(0, res.length - this.separator.length) : res;
    res = timeSpan.totalMilliseconds < 0 ? '-' + res : res;

    return res || '0';
  }
}
