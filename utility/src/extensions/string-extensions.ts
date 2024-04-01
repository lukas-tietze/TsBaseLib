declare global {
  interface String {
    /**
     * Prüft, ob der String eines der im anderen String vorhandenen Zeichen enthält oder nicht.
     *
     * @param other Die Lister der zu prüfenden Buchstaben.
     * @returns `true`, wenn der String mindestens einen Buchstaben aus {@link other} enthält, sonst `false`.
     */
    includesAnyOf(other: string): boolean;

    /**
     * Entfernt alle Vorkommen von {@link str} vom Anfang und Ende des Strings.
     *
     * @param str Die zu entfernende Zeichenkette.
     * @returns Den bereinigten String.
     */
    trimString(str: string): string;
  }
}

export function useStringExtensions(): void {
  String.prototype.includesAnyOf = function (other: string) {
    for (const c of other) {
      if (this.includes(c)) {
        return true;
      }
    }

    return false;
  };

  String.prototype.trimString = function (str: string) {
    let res = this.toString();

    while (res.startsWith(str)) {
      res = res.substring(str.length);
    }

    while (res.endsWith(str)) {
      res = res.substring(0, res.length - str.length);
    }

    return res;
  };
}
