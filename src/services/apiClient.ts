import HttpClient from '../common/httpClient';

class ApiClient {
  /**
   * Create a new instance of ApiClient.
   */
  constructor() {
    this.store = null;

    this.http = new HttpClient(defaults);
    this.http.interceptors.request.push((url, options) => {
      const { auth } = this.store.getState();
      const nextOptions = options;

      if (auth) {
        nextOptions.headers.Authorization = `Bearer `;
      }
     
      return { url, options: nextOptions };
    });
    this.http.interceptors.response.push((response) => {
      const { auth } = this.store.getState();
      const { status } = response;

      if (auth && auth.isLoggedIn && status === 401) {
        // DeviceEventEmitter.emit('tokenExpiredEvent');
      }
      return response;
    });
  }

  init(store) {
    this.store = store;
  }

  async request(url, options) {
    return await this.http.request(url, options);
  }

  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} data [请求时携带的参数] 对于 GET 方法，会将数据自动转换为 query string
   */
  async get(url, data, options) {
    if (!options) {
      options = {};
    }

    options.data = data;
    options.method = 'GET';
    return await this.request(url, options);
  }

  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} data [请求时携带的参数]
   */
  async post(url, data, options) {
    if (!options) {
      options = {};
    }
    options.data = data;
    options.method = 'POST';
    return await this.request(url, options);
  }

  async put(url, data, options) {
    if (!options) {
      options = {};
    }
    options.data = data;
    options.method = 'PUT';
    return await this.request(url, options);
  }

  async delete(url, data, options) {
    if (!options) {
      options = {};
    }
    options.data = data;
    options.method = 'DELETE';
    return await this.request(url, options);
  }

  async upload(url, formdata, options) {
    if (!options) {
      options = {};
    }
    options.headers = {
      'Content-Type': 'multipart/form-data',
    }
    options.data = formdata;
    options.method = 'POST';
    return await this.request(url, options);
  }
}

const getApiClient = () => {
  return new ApiClient();
};

export { getApiClient };
export default new ApiClient();
