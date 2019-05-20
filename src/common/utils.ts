// only accessible within this file, so use `Utils.isNodeEnv(env)` from the outside.
declare var process: { env: any };

/** Returns whether `process.env.NODE_ENV` exists and equals `env`. */
export function isNodeEnv(env: string) {
  return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === env;
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}