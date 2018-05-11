/**
 *  __API_APPKEY__ : appkey
 *  __API_APPPWD__ : apppwd
 *  __API_HOSTURL__ : 接口地址
 **/

module.exports = {
  // 测试环境
  test: {
    __API_APPKEY__: "'4f5508d72d9d78c9242bf1c867ac1063'",
    __API_APPPWD__: "'95b6150f98aad76a13bb0ddc699e29e1'",
    __API_HOSTURL__: "'http://apidaily.mockuai.com/'", // 最后的 / 必须加上
  },
  // 预发环境
  wapa: {
    __API_APPKEY__: "'93fa291b32611b6e30afc6edadf1d7e4'",
    __API_APPPWD__: "'475f1de784cf2a2aef2d661caad3b4f8'",
    __API_HOSTURL__: "'http://apiwapa.mockuai.com/'",  // 最后的 / 必须加上
  },
  // 线上
    online: {
    __API_APPKEY__: "'1e5eabce43074f07aeed315557429b25'",
    __API_APPPWD__: "'1af204579d4774c240baf83231faa236'",
    __API_HOSTURL__: "'http://api.mockuai.com/'",  // 最后的 / 必须加上
  }
}
