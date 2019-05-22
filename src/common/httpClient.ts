/**
 * HTTP Clinet (基于fetch)
 */

import { serializeParams, generateRequestUrlWithParams, assertLongQuery } from './utils';

interface RequestConfig {
  cache?: string;
  headers?: any;
  method?: string;
  data?: any;
  body?: any;
  timeout?: number;
}

class HttpClient {
  interceptors: any
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
  async request(url: string, options: RequestConfig) {
    // 判断Query String 参数值是否太大
    assertLongQuery(url);

    const defaultOptions = {
      timeout: 30 * 1000
    };

    const defaultHeaders = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=utf-8',
    };

    const { method } = options;
    let requestUrl = url;
    let data = options.data || {};
    let headers = options.headers || {};
    let requestOptions = {
      ...defaultOptions, 
      ...options,
      method: method ? method.toUpperCase() : 'GET'
    };

    // 设置默认 Accept 和 Content-Type
    requestOptions.headers = Object.assign(defaultHeaders, headers);
    // 设置默认 Cache
    requestOptions.cache = options.cache || 'default';

    if (method === 'GET' || method === 'HEAD') {
      requestUrl = generateRequestUrlWithParams(url, data);
    } else if(typeof data === 'object') {
      // 根据请求类型处理数据
      let contentType = requestOptions.headers && (requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'])
      if (contentType && contentType.indexOf('application/json') >= 0) {
        try {
          requestOptions.body = JSON.stringify(data);
        } catch (error) {
          requestOptions.body = data.toString();
        }
      } else if (contentType && contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
        requestOptions.body = serializeParams(data)
      } else {
        requestOptions.body = data.toString();
      }
    } else {
      requestOptions.body = data.toString();
    }

    this.interceptors.request.forEach((interceptor: (url: string, req: any) => any) => {
      const request = interceptor(requestUrl, requestOptions);
      requestUrl = request.url;
      requestOptions = request.options;
    });

    const fetchPromise = new Promise((resolve, reject) => {
      fetch(url, requestOptions)
        .then((res: Response) => {
          resolve(res);
        })
        .catch((e: Error): void => {
          reject(e);
        });
    });

    let response = this.timeoutPromise(fetchPromise, requestOptions.timeout);

    this.interceptors.response.forEach((interceptor: (res: any) => any) => {
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
  timeoutPromise(fetchPromise: Promise<any>, timeout: number | undefined) {
    let abortFn: any = null;

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

  async delete (url: string, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'DELETE' }))
  }
  async get (url: string, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'GET' }))
  }
  async head (url: string, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'HEAD' }))
  }
  async options (url: string, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'OPTIONS' }))
  }
  async post (url: string, data: any, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'POST', data }))
  }
  async put (url: string, data: any, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'PUT', data }))
  }
  async patch (url: string, data: any, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'PATCH', data }))
  }
  async upload(url: string, data: any, config = {}) {
    return await this.request(url, Object.assign(config, { method: 'POST', headers: { 'Content-Type': 'multipart/form-data' }, data }))
  }
}

export default HttpClient;
