/**
 * Diese Klasse stellt ein Token dar, das im DI-Container zum
 * Abrufen eines bestimmten Wertes von einem bestimmten Typ genutzt werden
 * kann. Der Name ist lediglich eine Hilfestellung für den Programmierer
 * zum Debuggen.
 * Im DI-Container werden Werte dem Token aufgrund der Identität des Tokens
 * zugeordnet und nicht aufgrund des Namens.
 *
 * @template T Der Typ des Wertes, der dem Token zugeordnet ist.
 */

export class InjectionToken<T> {
  /**
   * Initialisiert eine neue Instanz der Klasse.
   *
   * @param name Der Name des Tokens. Wird nur zu Debug-Zwecken benötigt.
   *             Wird keine Name gegeben, wird ein zufälliger erzeugt.
   */
  constructor(public readonly name?: string) {
    this.name ??= `Anonymous-${Date.now().toString()}-${Math.random().toFixed(5).substring(2)}`;
  }
}
