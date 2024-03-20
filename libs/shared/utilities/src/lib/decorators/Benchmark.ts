export function Benchmark(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const className = target.constructor.name;
  const targetMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    const start = Date.now();
    const results = await targetMethod.apply(this, args);
    const end = Date.now();
    const duration = end - start;
    console.log(`${className}:${propertyKey} benchmark: ${duration}ms`);
    return results;
  };

  return descriptor;
}
