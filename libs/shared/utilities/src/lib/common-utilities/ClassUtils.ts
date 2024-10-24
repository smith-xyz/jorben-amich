function classMethodsToObjectMethod<TClass extends object>(cls: TClass) {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(cls))
    .filter((prop) => typeof cls[prop] === 'function' && prop !== 'constructor')
    .reduce((acc, curr) => {
      acc[curr] = cls[curr];
      return acc;
    }, {});
}

export { classMethodsToObjectMethod };
