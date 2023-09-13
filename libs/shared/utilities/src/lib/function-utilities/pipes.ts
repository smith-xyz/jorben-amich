export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

export const pipePromises =
  <T>(...fns: Array<(arg: T) => Promise<T>>) =>
  (value: T) =>
    fns.reduce((p, fn) => p.then(fn), Promise.resolve(value));
