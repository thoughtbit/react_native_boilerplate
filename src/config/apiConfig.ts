import AppConfig from './appConfig';

const { BASE_URL } = AppConfig;

export default {
  BASE_URL,
  // WebSocket
  WEB_SOCKET_URL: '',

  // 第三方接口
  OPEN_API: {},

  // 应用接口
  APP_BASE_API: {
    LOGIN_URL: `${BASE_URL}/auth/login`,
    FIND_PASSWORD_URL: `${BASE_URL}/auth/find_pwd`,
    MODIFY_PASSWORD_URL: `${BASE_URL}/auth/modify_pwd`,
    VALIDATE_TOKEN_URL: `${BASE_URL}/auth/validate_token`,
    SIGNUP_URL: `${BASE_URL}/auth/signup`,
    USER_INFO_URL: `${BASE_URL}/user`,
    USERS_URL: `${BASE_URL}/users`,
  },
};
