import { DependencyDescriptor } from './dependency-descriptor.js';
import { DiProvider } from './di-provider.js';
import { InjectableTypes } from './injectable-decorator.js';
import { InjectionToken } from './injection-token.js';

import type { Ctor, DiCtor, ProviderFunction, Scope } from './types.js';

/**
 * Diese Klasse ermöglicht die Konfiguration der Dependency-Injection.
 */
export class DiCollection {
  /**
   * Die Sammlung der injizierbaren Dienste.
   */
  private readonly descriptors = new Map<Ctor<unknown> | InjectionToken<unknown>, DependencyDescriptor<unknown>>();

  /**
   * Fügt alle Dienste hinzu, die mit `Injectable` markiert wurden.
   *
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addDecorated(): DiCollection {
    for (const { ctor, options } of InjectableTypes) {
      switch (options.scope) {
        case 'scoped':
          this.addScoped(ctor as Ctor<unknown>);
          break;
        case 'singleton':
          this.addSingleton(ctor as Ctor<unknown>);
          break;
        case 'transient':
          this.addTransient(ctor as Ctor<unknown>);
          break;
        case undefined:
          throw new Error(
            `Fehlender Geltungsbereich (Scope) bei Klasse ${ctor.name}! Vermutlich wurde ein Parameter dekoriert, ohne die Klasse mit @Injectable zu markieren.`
          );
      }
    }

    return this;
  }

  /**
   * Fügt einen Dienst als Singleton hinzu, die bei der ersten Nutzung
   * durch Aufrufen des Konstruktors instanziiert wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(ctor: DiCtor<T>): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu und nutzt die gegebene
   * Instanz.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param value Die zu nutzende Instanz des Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(ctor: DiCtor<T>, value: T): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu, der bei der ersten
   * Benutzung durch Aufruf der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(ctor: DiCtor<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu und nutzt die gegebene
   * Instanz.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param value Die zu nutzende Instanz des Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(token: InjectionToken<T>, value: T): DiCollection;

  /**
   * Fügt einen Dienst als Singleton hinzu, der bei der ersten
   * Benutzung durch Aufruf der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Implementierungsfunktion.
   */
  public addSingleton<T>(token: DiCtor<T> | InjectionToken<T>, provider?: T | ProviderFunction<T>): DiCollection {
    this.validateAdd('singleton', token);

    let descriptorProviderFunction: ProviderFunction<T>;

    if (typeof token === 'function') {
      const ctor = token as DiCtor<T>;

      descriptorProviderFunction = (scopedDi) => new ctor(scopedDi);
    } else if (typeof provider === 'function') {
      descriptorProviderFunction = provider as ProviderFunction<T>;
    } else {
      const value = provider as T;

      descriptorProviderFunction = () => value;
    }

    this.descriptors.set(token, new DependencyDescriptor({ scope: 'singleton' }, descriptorProviderFunction));

    return this;
  }

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * des gegebenen Konstruktors instanziiert.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addScoped<T>(ctor: DiCtor<T>): DiCollection;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addScoped<T>(ctor: DiCtor<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addScoped<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Implementierungsfunktion.
   */
  public addScoped<T>(token: DiCtor<T> | InjectionToken<T>, provider?: ProviderFunction<T>): DiCollection {
    this.validateAdd('scoped', token);

    let descriptorProviderFunction: ProviderFunction<T>;

    if (typeof token === 'function') {
      const ctor = token as DiCtor<T>;

      descriptorProviderFunction = (scopedDi) => new ctor(scopedDi);
    } else if (typeof provider === 'function') {
      descriptorProviderFunction = provider;
    } else {
      throw new Error();
    }

    this.descriptors.set(token, new DependencyDescriptor({ scope: 'scoped' }, descriptorProviderFunction));

    return this;
  }

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, durch Aufruf
   * des gegebenen Konstruktors neu instanziiert.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addTransient<T>(ctor: DiCtor<T>): DiCollection;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addTransient<T>(ctor: DiCtor<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addTransient<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiCollection;

  /**
   * Implementierungsfunktion.
   */
  public addTransient<T>(token: DiCtor<T> | InjectionToken<T>, provider?: T | ProviderFunction<T>): DiCollection {
    this.validateAdd('transient', token);

    let descriptorProviderFunction: ProviderFunction<T>;

    if (typeof token === 'function') {
      const ctor = token as DiCtor<T>;

      descriptorProviderFunction = (scopedDi) => new ctor(scopedDi);
    } else if (typeof provider === 'function') {
      descriptorProviderFunction = provider as ProviderFunction<T>;
    } else {
      const value = provider as T;

      descriptorProviderFunction = () => value;
    }

    this.descriptors.set(token, new DependencyDescriptor({ scope: 'transient' }, descriptorProviderFunction));

    return this;
  }

  public buildProvider(): DiProvider {
    return new DiProvider(Array.from(this.descriptors.entries()).map(([k, v]) => [k, v.clone()] as const));
  }

  /**
   * Stellt sicher, das der Dienst, der durch den gegebenen Konstruktor bzw. das gegebene Token
   * identifiziert wird, hinzugefügt werden kann. Wenn der Dienst schon vorhanden ist, wird ein
   * Fehler ausgelöst.
   *
   * @param scope Das Scope des hinzuzufügenden Dienstes.
   * @param identifier Der Konstruktor oder das Token, das den Dienst identifiziert.
   */
  private validateAdd(scope: Scope, identifier: Ctor<unknown> | InjectionToken<unknown>): void {
    const existing = this.descriptors.get(identifier);

    if (existing && existing.scope !== scope) {
      throw new Error(`Der Dienst ${identifier.name} wurde bereits mit einem anderen Scope registriert!`);
    }
  }
}
