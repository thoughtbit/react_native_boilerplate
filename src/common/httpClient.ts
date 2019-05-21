/**
 * HTTP Clinet (基于fetch)
 */

import { serializeParams, generateRequestUrlWithParams, assertLongQuery } from './utils';

class HttpClient {
  /**
   * Create a new instance of HttpClient.
   */
  constructor() {
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * Sends a single request to server.
   */
  async sendRequest(url: string, options = {}) {
    // 判断Query String 参数值是否太大
    assertLongQuery(url);

    const defaultOptions = {
      timeout: 20 * 1000,
      credentials: 'include', // 是否可以将对请求的响应暴露给页面, Credentials可以是 cookies, authorization headers 或 TLS client certificates.
    };

    const defaultHeaders = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=utf-8',
    };

    let requestUrl = url;
    let data = options.data || {};
    let requestOptions = { ...defaultOptions, ...options };

    if (!requestOptions.headers) {
      requestOptions.headers = {};
    }

    // 重新设置 Accept 和 Content-Type
    requestOptions.headers = Object.assign(defaultHeaders, requestOptions.headers);

    let method = requestOptions.method || 'GET';
    method = method.toUpperCase();

    // 根据请求类型处理数据
    let contentType = 'json';
    for (const key in requestOptions.headers) {
      if (requestOptions.headers.hasOwnProperty(key)) {
        if (key.toLowerCase() === 'content-type') {
          contentType = requestOptions.headers[key];
          if (contentType.indexOf('application/json') === 0) {
            contentType = 'json';
          } else if (contentType.indexOf('application/x-www-form-urlencoded') === 0) {
            contentType = 'urlencoded';
          } else {
            contentType = 'string';
          }
          break;
        }
      }
    }

    if (method === 'GET') {
      requestUrl = generateRequestUrlWithParams(url, data);
    } else {
      if (contentType === 'json') {
        try {
          data = JSON.stringify(data);
        } catch (error) {
          data = data.toString();
        }
      } else if (contentType === 'urlencoded') {
        data = serializeParams(data);
      } else {
        data = data.toString();
      }
    }

    if (method !== 'GET' && method !== 'HEAD') {
      requestOptions.body = data;
    }

    this.interceptors.request.forEach(interceptor => {
      const request = interceptor(requestUrl, requestOptions);
      requestUrl = request.url;
      requestOptions = request.options;
    });

    const fetchPromise = new Promise((resolve, reject) => {
      requestOptions.requestId = new Date().getTime();
      fetch(url, requestOptions)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });

    let response = this.timeoutPromise(fetchPromise, requestOptions.timeout);

    this.interceptors.response.forEach(interceptor => {
      response = interceptor(response);
    });

    return response;
  }

  /**
   * 超时
   * @param fetchPromise
   * @param timeout
   * @returns {Promise<any>}
   */
  timeoutPromise(fetchPromise, timeout) {
    let abortFn = null;

    // 这是一个可以被reject的promise
    const abortPromise = new Promise((resolve, reject) => {
      abortFn = () => {
        reject(new Error({ status: 504 }));
      };
    });

    // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    const racePromise = Promise.race([fetchPromise, abortPromise]);

    setTimeout(() => {
      abortFn();
    }, timeout);

    return racePromise;
  }
}

export default HttpClient;
