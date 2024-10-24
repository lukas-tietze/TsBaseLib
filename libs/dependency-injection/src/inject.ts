import { DiProvider } from './di-provider.js';
import { InjectionToken } from './injection-token.js';
import { Ctor, DiCtor } from './types.js';

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
