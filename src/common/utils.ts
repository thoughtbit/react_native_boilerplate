// only accessible within this file, so use `Utils.isNodeEnv(env)` from the outside.
declare var process: { env: any };

/** Returns whether `process.env.NODE_ENV` exists and equals `env`. */
export function isNodeEnv(env: string) {
  return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === env;
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export const noop = (...args: any[]): void => {}

export function serializeParams (params: any) {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&')
}

export function generateRequestUrlWithParams (url: string, params: any) {
  params = typeof params === 'string' ? params : serializeParams(params)
  url += (~url.indexOf('?') ? '&' : '?') + params
  url = url.replace('?&', '?')
  return url
}

/**
 * Max Query String
 */
export function assertLongQuery(url: string) {
  const [, ...queryParts] = url.split('?');
  const query = queryParts.join('');
  if (query.length > 2048) {
    console.error(`Query length (${query.length}) is longer than ${2048}. This doesn't work on some servers [${url}]`);
  }
}