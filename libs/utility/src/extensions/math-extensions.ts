// -------------------------------------------------------------------------------
// Diese Datei erweitert die Funktion der eingebauten Klasse `Math`.
// -------------------------------------------------------------------------------

declare global {
  interface Math {
    /**
     * Clamped einen Wert.
     *
     * Das Ergebnis ist {@link max}, wenn `{@link value} > {@link max}`
     * und {@link min}, wenn `{@link value} < {@link min}`
     * und sonst {@link value}.
     *
     * @param value Der zu beschränkende Wert.
     * @param min Das inklusive Minimum.
     * @param max Das inklusive Maximum.
     * @returns Einen Wert im Bereich `[min, max]`.
     */
    clamp(value: number, min: number, max: number): number;

    /**
     * Führt eine lineare Interpolation zwischen `a` und `b` durch.
     *
     * @param a Der erste Wert.
     * @param b Der zweite Wert.
     * @param v Das Gewicht der Interpolation.
     * @returns Den interpolierten Wert.
     */
    lerp(a: number, b: number, v: number): number;

    /**
     * Ermittelt das bei der Interpolation genutzt Gewicht und
     * stellt damit die Umkehroperation zu `Math.lerp` dar.
     *
     * @param min Der Mindestwert.
     * @param max Der Höchstwert.
     * @param value
     * @returns Das ermittelte Gewicht der Interpolation.
     */
    invLerp(min: number, max: number, value: number): number;
  }
}

/**
 * Registriert die Erweiterungen für die Klasse {@link Math}.
 */
export function useMathExtensions(): void {
  Math.clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  Math.lerp = (a, b, v) => a + (b - a) * v;

  Math.invLerp = (a, b, v) => (b - Math.clamp(v, a, b)) / (b - a);
}
