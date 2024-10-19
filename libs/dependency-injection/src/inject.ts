import { DiProvider } from './di-provider';
import { InjectionHints } from './injection-hints';
import { InjectionToken } from './injection-token';
import { Ctor, DiCtor } from './types';

export const InjectionContext = {
  currentContext: undefined as DiProvider | undefined,
  contextStack: [] as DiProvider[],

  enterContext(context: DiProvider) {
    this.currentContext = context;
    this.contextStack.push(context);
  },

  leaveContext(): DiProvider | undefined {
    const current = this.contextStack.pop();

    this.currentContext = this.contextStack[0];

    return current;
  },
};

export function inject<T>(tokenOrCtor: InjectionToken<T> | DiCtor<T>) {
  if (!InjectionContext.currentContext) {
    throw new Error('TODO');
  }

  return InjectionContext.currentContext.getService(tokenOrCtor);
}
