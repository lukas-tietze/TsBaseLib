import { useAllExtensions } from '../extensions';
import { MetadataKey } from './meta-data-key';

export class Metadata {
  private static metadataByConstructor: Map<NewableFunction, Record<string, any>> = new Map();

  private src: Record<string, any>;

  constructor(private ctor: NewableFunction) {
    useAllExtensions();

    this.src = Metadata.metadataByConstructor.getOrAdd(this.ctor, {});
  }

  public get<T = unknown>(name: string | MetadataKey<T>): T | undefined {
    return this.src[name.toString()];
  }

  public has(name: string): boolean {
    return name in this.src;
  }

  public set<T>(name: MetadataKey<T> | string, value: T): T {
    return (this.src[name.toString()] = value);
  }

  public getOrSet<T = unknown>(name: string | MetadataKey<T>, value: T): T {
    return (this.src[name.toString()] ??= value);
  }

  public all(): Readonly<Record<string, unknown>> {
    return this.src;
  }

  public hasAny(): boolean {
    return Object.getOwnPropertyNames(this.src).length > 0;
  }

  public withInheritance(): Metadata[] {
    let proto = this.ctor.prototype;
    const res: Metadata[] = [];

    while (proto) {
      res.push(Metadata.fromPrototype(proto));
      proto = Object.getPrototypeOf(proto);
    }

    return res;
  }

  public static fromInstance(src: object): Metadata {
    return this.fromPrototype(Object.getPrototypeOf(src));
  }

  public static fromConstructor(src: NewableFunction): Metadata {
    return new Metadata(src);
  }

  public static fromPrototype(src: object): Metadata {
    return new Metadata(src.constructor);
  }

  public static fromPrototypeOrConstructor(src: object | NewableFunction): Metadata {
    return typeof src === 'function' ? this.fromConstructor(src) : this.fromPrototype(src);
  }
}
