type Handler = (...args: any[]) => any;
type NextFunction<T> = (...args: [...HandlerArgs<T>]) => HandlerReturn<T>;

type MiddlewareStage<T> = (...args: [...HandlerArgs<T>, NextFunction<T>]) => HandlerReturn<T>;
type HandlerArgs<T> = T extends (...args: infer TArgs) => any ? TArgs : never;
type HandlerReturn<T> = T extends (...args: any[]) => infer TReturn ? TReturn : never;

export class MiddlewareStackBuilder<T extends Handler> {
  private readonly stack: MiddlewareStage<T>[] = [];

  public build(finalHandler: NextFunction<T>): NextFunction<T> {
    let fn = finalHandler;

    for (let i = this.stack.length; i > 0; i--) {
      const stage = this.stack[i - 1];
      const next = fn;

      fn = function (...args: [...HandlerArgs<T>]): HandlerReturn<T> {
        return stage(...args, next);
      };
    }

    return fn;
  }

  public add(stage: MiddlewareStage<T>): void {
    this.stack.push(stage);
  }

  public remove(stage: MiddlewareStage<T>): boolean {
    const i = this.stack.indexOf(stage);

    if (i < 0) {
      return false;
    }

    this.stack.splice(i, 1);

    return true;
  }
}
