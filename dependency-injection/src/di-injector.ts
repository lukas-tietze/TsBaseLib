import { DependencyDescriptor } from './dependency-descriptor';
import { DiProvider } from './di-provider';
import { InjectableTypes } from './injectable-decorator';
import { InjectionHints } from './injection-hints';
import { InjectionToken } from './injection-token';
import { Ctor, ProviderFunction, Scope } from './types';

/**
 * Diese Klasse ermöglicht die Konfiguration der Dependency-Injection.
 */
export class DiInjector {
  /**
   * Die Sammlung der injizierbaren Dienste.
   */
  private descriptors: Map<Ctor<unknown> | InjectionToken<unknown>, DependencyDescriptor<unknown>>;

  /**
   * Gibt an, ob es erlaubt ist, unbekannte Dienste mit beschränktem Gültigkeitsbereich (Scoped)
   * zu erzeugen, auch wenn sie nicht registriert wurden und diese ad hoc zu registrieren.
   */
  private unknownScopedServicesAllowed: boolean;

  /**
   * Ein Stack zur Speicherung der Abfolge einer Dienst-Instanziierung.
   * Dadurch lassen sich zyklische Abhängigkeiten erkennen und auswerten.
   */
  private instantiationStack: (Ctor<unknown> | InjectionToken<unknown>)[] = [];

  /**
   * Initialisiert eine neue Instanz der Klasse.
   */
  constructor() {
    this.descriptors = new Map();
    this.unknownScopedServicesAllowed = false;
  }

  /**
   * Legt fest, das unbekannte Dienste mit beschränktem Gültigkeitsbereich (Scoped)
   * im {@link DiProvider} erzeugt werden dürfen, auch wenn sie nicht registriert wurden.
   * Diese Dienste werden dann ad hoc registriert.
   *
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public allowUnknownScopedServices(): DiInjector {
    this.unknownScopedServicesAllowed = true;

    return this;
  }

  /**
   * Fügt alle Dienste hinzu, die mit `Injectable` markiert wurden.
   *
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addDecorated(): DiInjector {
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
  public addSingleton<T>(ctor: Ctor<T>): DiInjector;

  /**
   * Fügt einen Dienst als Singleton hinzu und nutzt die gegebene
   * Instanz.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param value Die zu nutzende Instanz des Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(ctor: Ctor<T>, value: T): DiInjector;

  /**
   * Fügt einen Dienst als Singleton hinzu, der bei der ersten
   * Benutzung durch Aufruf der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(ctor: Ctor<T>, provider: ProviderFunction<T>): DiInjector;

  /**
   * Fügt einen Dienst als Singleton hinzu und nutzt die gegebene
   * Instanz.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param value Die zu nutzende Instanz des Dienstes.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(token: InjectionToken<T>, value: T): DiInjector;

  /**
   * Fügt einen Dienst als Singleton hinzu, der bei der ersten
   * Benutzung durch Aufruf der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addSingleton<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiInjector;

  /**
   * Implementierungsfunktion.
   */
  public addSingleton<T>(token: Ctor<T> | InjectionToken<T>, provider?: T | ProviderFunction<T>): DiInjector {
    this.validateAdd('singleton', token);

    let descriptorProviderFunction: ProviderFunction<T>;

    if (typeof token === 'function') {
      const ctor = token as Ctor<T>;

      descriptorProviderFunction = () => new ctor();
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
  public addScoped<T>(ctor: Ctor<T>): DiInjector;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addScoped<T>(ctor: Ctor<T>, provider: ProviderFunction<T>): DiInjector;

  /**
   * Fügt einen Dienst mit beschränkter Lebenszeit zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addScoped<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiInjector;

  /**
   * Implementierungsfunktion.
   */
  public addScoped<T>(token: Ctor<T> | InjectionToken<T>, provider?: ProviderFunction<T>): DiInjector {
    this.validateAdd('scoped', token);

    let descriptorProviderFunction: ProviderFunction<T>;

    if (typeof token === 'function') {
      const ctor = token as Ctor<T>;

      descriptorProviderFunction = () => new ctor();
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
  public addTransient<T>(ctor: Ctor<T>): DiInjector;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param ctor Der Konstruktor des zu registrierenden Dienstes.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addTransient<T>(ctor: Ctor<T>, provider: ProviderFunction<T>): DiInjector;

  /**
   * Fügt einen einmalig nutzbaren Dienst zum Container hinzu.
   * Der Dienst wird bei jeder Nutzung, einmalig pro Scope, durch Aufruf
   * der Factory-Funktion erzeugt wird.
   *
   * @param token Das Token, über das der Dienst identifiziert wird.
   * @param provider Eine Funktion, die die Klasse instanziiert.
   * @returns Die aktuelle Instanz, um Method-Chaining zu ermöglichen.
   */
  public addTransient<T>(token: InjectionToken<T>, provider: ProviderFunction<T>): DiInjector;

  /**
   * Implementierungsfunktion.
   */
  public addTransient<T>(token: Ctor<T> | InjectionToken<T>, provider?: T | ProviderFunction<T>): DiInjector {
    this.validateAdd('transient', token);

    let descriptorProviderFunction: ProviderFunction<T>;

    if (typeof token === 'function') {
      const ctor = token as Ctor<T>;

      descriptorProviderFunction = () => new ctor();
    } else if (typeof provider === 'function') {
      descriptorProviderFunction = provider as ProviderFunction<T>;
    } else {
      const value = provider as T;

      descriptorProviderFunction = () => value;
    }

    this.descriptors.set(token, new DependencyDescriptor({ scope: 'transient' }, descriptorProviderFunction));

    return this;
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

  public createScope(): DiInjector {
    const copy = new DiInjector();

    copy.descriptors = new Map(Array.from(this.descriptors).map(([i, p]) => [i, p.forScopedProvider()]));
    copy.allowUnknownScopedServices = this.allowUnknownScopedServices;
    copy.instantiationStack = [...this.instantiationStack];

    return copy;
  }

  public getService<T>(token: InjectionToken<T> | Ctor<T>, hints?: InjectionHints): T {
    const service = this.getOptionalService(token, hints);

    if (!service) {
      throw new Error(`Für ${token instanceof InjectionToken ? 'das Token' : 'die Klasse'} ${token.name} ist kein Service registriert!`);
    }

    return service;
  }

  public getOptionalService<T>(token: InjectionToken<T> | Ctor<T>, hints?: InjectionHints): T | undefined {
    if (this.instantiationStack.includes(token)) {
      const path = this.instantiationStack.map((ctor) => (ctor instanceof InjectionToken ? '[Token]' : '[Type]') + ctor.name).join(' -> ');

      throw new Error(`Zirkuläre Abhängigkeit bei Dependency-Injection: ${path}`);
    }

    this.instantiationStack.push(token);

    let instance: T | undefined;

    try {
      let descriptor = this.descriptors.get(token) as DependencyDescriptor<T> | undefined;

      if (!descriptor && !(token instanceof InjectionToken) && this.unknownScopedServicesAllowed) {
        const ctor = token;

        descriptor = new DependencyDescriptor({ scope: 'scoped' }, () => new ctor());

        this.descriptors.set(token, descriptor);
      }

      instance = descriptor?.getInstance(this, hints);
    } catch (e) {
      this.instantiationStack = [];

      throw e;
    }

    if (this.instantiationStack.pop() !== token) {
      throw new Error('Stack korrumpiert!');
    }

    return instance;
  }
}
