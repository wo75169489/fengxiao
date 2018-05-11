/*
 * 登陆组件验证
 *
 * @requires lib.storage
 * @author 景烁
 */
(function(win, lib) {
  const helper = {
    // 类似 http://localhost:8080/#/pages/login?redirectUrl=http%3A%2F%2Flocalhost%3A8080%2F%23%2Feshow%2Fproduct%2F2%2Fsetting
    getParamsFromUrl() {
      const query_string = {};
      const locationUrl = location.href;
      const query = locationUrl.indexOf('?') > -1 && locationUrl.split('?')[1] || null;

      if (!query) {
        return {};
      }

      const vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');

        // If first entry with this name
        if (typeof query_string[pair[0]] === 'undefined') {
          query_string[pair[0]] = pair[1];
          // If second entry with this name
        } else if (typeof query_string[pair[0]] === 'string') {
          const arr = [query_string[pair[0]], pair[1]];
          query_string[pair[0]] = arr;
          // If third or later entry with this name
        } else {
          query_string[pair[0]].push(pair[1]);
        }
      }
      return query_string;
    },
  };

  lib.login = {
    // 判断是否登陆
    isLogin() {
      return !!lib.storage.get('access_token');
    },

    // 跳转登陆页
    goLogin(redirectUrl, logout) {
      redirectUrl = redirectUrl || location.href;
      lib.storage.set('access_token', '');

      // todo 替换掉形式
      location.href = `/#/pages/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    },

    // 登出
    logout(redirectUrl) {
      redirectUrl = redirectUrl || '';
      lib.storage.rm('access_token');
      lib.storage.rm('session_token');
      lib.storage.rm('refresh_token');
      const that = this;
      setTimeout(() => {
        that.goLogin(redirectUrl, true);
      }, 100);
    },

    // 登陆后写入数据
    login(logData, redirectUrl) {
      if (!logData || !logData.access_token) {
        return;
      }
      // 最后跳首页
      if (!redirectUrl) {
        const params = helper.getParamsFromUrl();
        if (params.redirectUrl) {
          redirectUrl = decodeURIComponent(params.redirectUrl);
        } else {
          redirectUrl = '/';
        }
      }

      lib.storage.set('access_token', logData.access_token);
      lib.storage.set('refresh_token', logData.refresh_token);

      lib.storage.set('user', logData.data.user);
      lib.login.setAppKeyAppPwd(logData.data.user.app_key, logData.data.user.app_pwd);

      // 删除缓存的边栏设置
      lib.storage.rm('moduleList');

      location.replace(redirectUrl);
    },

    setAppKeyAppPwd(appKey, appPwd) {
      localStorage.setItem('app_key', appKey);
      localStorage.setItem('app_pwd', appPwd);
      lib.api.app_key = appKey;
      lib.api.app_pwd = appPwd;
    },

    // 获取账号昵称
    getUserName() {
      return lib.storage.get('userName');
    },
  };
}(window, window.lib || (window.lib = {})));
