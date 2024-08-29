import type { DiProvider } from './di-provider';
import type { InjectionToken } from './injection-token';
import type { Ctor, ProviderFunction } from './types';

/**
 * Diese Klasse ermöglicht die Konfiguration der Dependency-Injection.
 */
export interface DiCollection {
  /**
   * Legt fest, das unbekannte Dienste mit beschränktem Gültigkeitsbereich (Scoped)
   * im {@link DiProvider} erzeugt werden dürfen, auch wenn sie nicht registriert wurden.
   * Diese Dienste werden dann ad hoc registriert.
   *
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  allowUnknownScopedServices(): DiCollection;

  /**
   * Fügt alle Dienste hinzu, die mit `Injectable` markiert wurden.
   *
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addDecorated(): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu, die bei der ersten Nutzung
   * durch Aufrufen des Konstruktors instanziiert wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addSingleton<T>(ctor: Ctor<T>): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu und nutzt die gegebene
   * Instanz.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param value Die zu nutzende Instanz des Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addSingleton<T>(ctor: Ctor<T>, value: T): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu, der bei der ersten
   * Benutzung durch Aufruf der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addSingleton<T>(ctor: Ctor<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu und nutzt die gegebene
   * Instanz.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param value Die zu nutzende Instanz des Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addSingleton<T>(token: InjectionToken<T>, value: T): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu, der bei der ersten
   * Benutzung durch Aufruf der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addSingleton<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * des gegebenen Konstruktors instanziiert.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addScoped<T>(ctor: Ctor<T>): DiCollection;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addScoped<T>(ctor: Ctor<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addScoped<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, durch Aufruf
   * des gegebenen Konstruktors neu instanziiert.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addTransient<T>(ctor: Ctor<T>): DiCollection;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addTransient<T>(ctor: Ctor<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  addTransient<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiCollection;
}
