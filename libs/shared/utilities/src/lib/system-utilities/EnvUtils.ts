function envVariableValidator(requiredEnvVars: string[]) {
  const missing = requiredEnvVars.filter(
    (variable) =>
      !process.env[variable] ||
      (typeof process.env[variable] === 'string' &&
        process.env[variable].length === 0)
  );

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(',')}`);
  }
}

export const EnvUtils = {
  envVariableValidator,
};
