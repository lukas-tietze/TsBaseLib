import type { DiProvider } from './di-provider';

export type Ctor<T> = (new (...params: any[]) => T) | (new () => T);
export type ConstructedType<T> = T extends Ctor<infer TConstructed> ? TConstructed : never;
export type ProviderFunction<T> = ((scopedDi: DiProvider) => T) | (() => T);
export type Scope = 'singleton' | 'scoped' | 'transient';
