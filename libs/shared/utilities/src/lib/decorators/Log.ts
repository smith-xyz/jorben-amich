export type LogLevel = 'debug' | 'log' | 'error' | 'warn' | 'trace' | 'info';

export type LoggingFormatter = (...args: unknown[]) => string;

const defaultFormatter = (
  klassName: string,
  methodName: string,
  ...args: unknown[]
) => {
  let base = `Class=${klassName} METHOD=${methodName}`;
  args.forEach(
    (arg, index) => (base += ` ARG${index + 1}=${JSON.stringify(arg)}`)
  );
  return base;
};

export function Log(
  logLevel: LogLevel = 'log',
  formatter: LoggingFormatter = defaultFormatter
): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const targetMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = function (...args: unknown[]) {
      console[logLevel](formatter(className, propertyKey, ...args));
      return targetMethod.apply(this, args);
    };

    return descriptor;
  };
}
