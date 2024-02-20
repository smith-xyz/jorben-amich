export type LogLevel = 'debug' | 'log' | 'error' | 'warn' | 'trace' | 'info';

export type LoggingFormatter = (...args: unknown[]) => string;

const defaultFormatter = (
  klassName: string,
  methodName: string,
  ...args: unknown[]
) => {
  return (
    `Class=${klassName} METHOD=${methodName}` +
    args.map((arg, index) => ` ARG${index + 1}=${JSON.stringify(arg)}`).join('')
  );
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
