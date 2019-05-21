import ApiClinet from './apiClient';
import ApiConfig from '../config/apiConfig';

const ApiService = {
  get(url, data, options) {
    return ApiClinet.get(url, data, options);
  },
  post(url, data, options) {
    return ApiClinet.post(url, data, options);
  },
  put(url, data, options) {
    return ApiClinet.put(url, data, options);
  },
  delete(url, data, options) {
    return ApiClinet.delete(url, data, options);
  }
};

export default ApiService;

// 用户管理服务
export const UserService = {
  // 用户登录
  login(params) {
    return ApiClinet.get(ApiConfig.APP_BASE_API.LOGIN_URL, params);
  },
  // 找回密码
  findPassword(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.FIND_PASSWORD_URL, params);
  },
  // 修改密码
  modifyPassword(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.MODIFY_PASSWORD_URL, params);
  },
  // 用户注册
  signup(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.SIGNUP_URL, params);
  },
  // 查询用户
  get() {
    return ApiClinet.get(ApiConfig.APP_BASE_API.USER_INFO_URL);
  }
};

// 用户列表管理服务
export const UsersService = {
  get(params) {
    return ApiClinet.get(ApiConfig.APP_BASE_API.USER_URL, params);
  },
  create(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.USERS_URL, params);
  },
  update(params) {
    return ApiClinet.update(ApiConfig.APP_BASE_API.USERS_URL, params);
  },
  destroy() {
    return ApiClinet.delete(ApiConfig.APP_BASE_API.USERS_URL);
  }
};
