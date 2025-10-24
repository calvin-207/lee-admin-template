import pkg from "../../package.json";

//版本号
const APP_VER = pkg.version;
const API_HOST = import.meta.env.PROD ? window.location.host : "127.0.0.1:9999";
export default {
  //APP版本
  APP_VER: APP_VER,

  //地址
  API_HOST: API_HOST,

  //接口地址
  API_URL: window.location.protocol + "//" + API_HOST,

  //标题
  APP_TITLE: "lee-admin-template",

  //应用名称
  APP_NAME: "lee-admin-template",

  //是否开启多标签
  ISMULTITABS: true,

  //Token前缀，注意最后有个空格，如不需要需设置空字符串
  TOKEN_PREFIX: "JWT ",

  //是否加密localStorage, 为空不加密，可填写AES(模式ECB,移位Pkcs7)加密
  LS_ENCRYPTION: "",

  //localStorageAES加密秘钥，位数建议填写8的倍数
  LS_ENCRYPTION_KEY: "LYBBNJUHUALYBBNLOVE889966",

  //框架布局：default 经典、header 顶部、fenlan 分栏
  FRAMELAYOUT: "default",

  //语言 简体中文 zh-cn、 英文 en（此功能只是示例）
  LANG: "zh-cn",

  // elementplus 组件大小： small、default、large
  ELEMENT_SIZE: "default",

  // elementplus 组件 zIndex
  ELEMENT_ZINDEX: 3000,

  // elementplus button组件 autoInsertSpace 是否自动在两个中文字符之间插入空格
  ELEMENT_BUTTON: false,

  //左侧菜单默认宽度 默认 180
  MENU_WIDTH: 180,

  // 顶部导航颜色 默认 #272E39
  MENU_HEADER_COLOR01: "#272E39",

  // 左侧菜单颜色 默认 #fff
  MENU_HEADER_COLOR02: "#fff",

  // 默认菜单是否折叠
  IS_MENU_COLLAPSE: false,

  //主题颜色 默认 #409EFF #296dff
  COLOR: "#3A7BFF",

  //默认主题 'dark' 暗黑、'light' 正常
  THEME: "light",

  //登录信息数据存储方式 localStorage、sessionStorage
  STORAGE_METHOD: "localStorage",

  //请求超时
  TIMEOUT: 100000,
};
