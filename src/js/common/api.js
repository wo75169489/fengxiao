import md5 from 'md5';
import Vue from 'vue';

/**
 * mockuai.com 请求api接口封装
 *
 * @author 景烁
 * @requires lib.storage[lib.storage] lib.login
 *
 */
(function (win, lib) {
  // helper methods
  function sortObject(o) {
    let sorted = {},
      key,
      a = [];

    for (key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key);
      }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
    }
    return sorted;
  }

  function makeSign(params) {
    const app_pwd = lib.api.app_pwd;
    params = sortObject(params);

    let dictionary = app_pwd;
    for (const key in params) {
      dictionary += (`${key}=${params[key]}&`);
    }
    dictionary = dictionary.slice(0, -1);
    dictionary += app_pwd;

    const api_sign = md5(dictionary);
    return api_sign;
  }

  function makeSignWithOutFile(params) {
    const app_pwd = lib.api.app_pwd;
    params = sortObject(params);

    let dictionary = app_pwd;
    for (const key in params) {
      if (key == 'file') {
        continue;
      }
      dictionary += (`${key}=${params[key]}&`);
    }
    dictionary = dictionary.slice(0, -1);
    dictionary += app_pwd;

    const api_sign = md5(dictionary);
    return api_sign;
  }

  function getSession(isChange, callback) {
    // 需要重新刷新 session_token
    if (isChange) {
      // lib.storage.set('session_token', '');
      lib.storage.rm('session_token');
    }

    lib.api.session_token = lib.storage.get('session_token');

    if (lib.api.session_token) {
      callback && callback();
    } else {
      const data = {
        format: 'json',
        app_key: lib.api.app_key,
        timestamp: Math.floor(Date.now() / 1000),
      };
      $.getJSON(`${Env.apiUrl}wdzg/auth/session_token/get?format=json&app_key=${data.app_key}&timestamp=${data.timestamp}&api_sign=${makeSign(data)}`, (response) => {
        lib.api.session_token = response.data.session_token;
        lib.storage.set('session_token', lib.api.session_token);

        callback && callback();
      });
    }
  }

  function changeAccess(cb) {
    const data = {
      format: 'json',
      app_key: lib.api.app_key,
      timestamp: Math.floor(Date.now() / 1000),
      refresh_token: lib.storage.get('refresh_token'),
      access_token: lib.storage.get('access_token'),
      session_token: lib.storage.get('session_token'),
    };
    let chang_url = '';
    if (lib.api.testApi) {
      chang_url = `${lib.api.testApi}wdzg/auth/access_token/refresh?format=json&app_key=${data.app_key}&timestamp=${data.timestamp}&refresh_token=${data.refresh_token}&access_token=${data.access_token}&session_token=${data.session_token}&api_sign=${makeSign(data)}`;
    } else {
      chang_url = `${Env.sslApiUrl}wdzg/auth/access_token/refresh?format=json&app_key=${data.app_key}&timestamp=${data.timestamp}&refresh_token=${data.refresh_token}&access_token=${data.access_token}&session_token=${data.session_token}&api_sign=${makeSign(data)}`;
    }
    lib.storage.set('access_token', '');
    $.ajax({
      type: 'post',
      url: chang_url,
      data,
      dataType: 'json',
      success(data) {
        // console.log(data);
        if (data.code == 50006 || data.code == 50004) {
          if (lib.notification) {
            lib.notification.alert('当前登录信息已失效，请重新登录', () => {
              lib.login && lib.login.goLogin();
            }).show();
          } else {
            alert('当前登录信息已失效，请重新登录');
            lib.login && lib.login.goLogin();
          }
          return;
        }
        lib.storage.set('access_token', data.access_token);
        cb && cb();
      },
      error(data) {
        alert(data.msg);
      },
      complete() {
        // console.log('changeAccess ok');
      },
    });
  }

  function handleResponse(opts, data) {
    switch (data.code) {
      case 10000:
        // 调用成功
        opts.success && opts.success(data);
        break;
      case 50001:
      // 缺少参数session_token
      case 50002:
        if (lib.api.needSessionToken) {
          lib.api.requestQueue.push(opts.fn);
          return;
        }
        lib.api.needSessionToken = true;
        // session_token无效或已过期
        getSession(true, () => {
          opts.fn.call();
          lib.api.needSessionToken = false;
          lib.api.callRequestQueue();
        });
        break;
      case 50003:
      // 缺少access_token
      case 50004:
        if (lib.api.needAccessToken) {
          lib.api.requestQueue.push(opts.fn);
          return;
        }
        // access_token无效或已过期
        lib.api.needAccessToken = true;
        changeAccess(() => {
          opts.fn.call();
          lib.api.needAccessToken = false;
          lib.api.callRequestQueue();
        });
        break;
      case 50005:
      // refresh_token参数缺少
      case 50006:
        // refresh_token令牌错误或过期, 原先登陆状态退出
        if (opts.login) {
          opts.login();
        } else {
          alert('登陆失效，请重新登陆');
          lib.login && lib.login.goLogin();
        }
        break;
      default:
        // 其他情况
        opts.error && opts.error(data);
    }
  }

  // 客户端中使用客户端代理调用接口
  let jsonpID = +new Date();
  $.ajaxAppJsonp = function (options) {
    let _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName)
        ? _callbackName() : _callbackName) || (`Zepto${jsonpID++}`),
      $proxy = $(`<div id="${callbackName}">`),
      responseData,
      abort = function (errorType) {
        $proxy.triggerHandler('error', errorType || 'abort');
      },
      xhr = {abort},
      abortTimeout;

    $proxy.on('load error', (e, errorType) => {
      clearTimeout(abortTimeout);
      $proxy.off().remove();

      if (e.type == 'error' || !responseData) {
        options.error.call();
      } else {
        let data;
        try {
          data = JSON.parse(responseData[0]);
        } catch (e) {
          data = responseData[0];
        }
        options.success.call(document, data, 'success', xhr);
      }

      responseData = undefined;
    });

    window[callbackName] = function () {
      responseData = arguments;
      $proxy.trigger('load');
    };

    $proxy.appendTo('body');

    if (options.timeout > 0) {
      abortTimeout = setTimeout(() => {
        abort('timeout');
      }, options.timeout);
    }

    return callbackName;
  };

  function func_ajax(opts, ajaxType) {
    if (mockOrAppCall(opts, ajaxType)) return;

    const url = opts.ssl ? Env.sslApiUrl : Env.apiUrl;
    const data = $.extend(true, {}, opts.data);
    const access_token = lib.storage.get('access_token');

    data.format = 'json';
    data.app_key = lib.api.app_key;
    data.timestamp = Math.floor(Date.now() / 1000);
    data.session_token = lib.storage.get('session_token');
    if (access_token) {
      data.access_token = access_token;
    }

    // 解决post提交，换行报签名错误
    if (ajaxType == 'POST') {
      for (var key in data) {
        try {
          data[key] = data[key].replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
        } catch (e) {
        }
      }
    }
    data.api_sign = makeSign(data);

    if (ajaxType == 'GET') {
      Vue.http.get(`${url}${opts.api}`, {
        params: data,
        responseType: 'json',
        emulateJSON: true
      }).then(response => {
        handleResponse(opts, response.body);
      }, error => {
        opts.error && opts.error(null, error.status, error.statusText);
      }).then(response => {
        opts.complete && opts.complete(response);
      });
    } else if (ajaxType == 'POST') {
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      Vue.http.post(`${url}${opts.api}`, formData, {
        responseType: 'json',
      }).then(response => {
        handleResponse(opts, response.body);
      }, error => {
        opts.error && opts.error(error, error.status, error.statusText);
      }).then(response => {
        opts.complete && opts.complete(response);
      });
    }

    // $.ajax({
    //   url: url + opts.api,
    //   type: ajaxType,
    //   data,
    //   dataType: 'json',
    //   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    //   success(data) {
    //     // 状态码处理
    //     handleResponse(opts, data);
    //   },
    //   error(xhr, errorType, error) {
    //     opts.error && opts.error(xhr, errorType, error);
    //   },
    //   complete(xhr, status) {
    //     opts.complete && opts.complete(xhr, status);
    //   },
    // });
  }

  function file_ajax(opts, ajaxType) {
    const url = opts.ssl ? Env.sslApiUrl : Env.apiUrl;
    const data = $.extend(true, {}, opts.data);
    const access_token = lib.storage.get('access_token');

    data.format = 'json';
    data.app_key = lib.api.app_key;
    data.timestamp = Math.floor(Date.now() / 1000);
    data.session_token = lib.storage.get('session_token');
    if (access_token) {
      data.access_token = access_token;
    }
    data.api_sign = makeSignWithOutFile(data);

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if(typeof opts.progress === 'function'){
      $.ajax({
        url: url + opts.api,
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        xhr: function(){
          var xhr = $.ajaxSettings.xhr();
          if(opts.progress && xhr.upload) {
            xhr.upload.addEventListener("progress" , opts.progress, false);
            return xhr;
          }
        },
        success: function(data){
          handleResponse(opts, data);
        }
      }).done(function(resp) {
      });
    }else{
      $.ajax({
        url: url + opts.api,
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        success(data) {
          // 状态码处理
          handleResponse(opts, data);
        },
        error(xhr, errorType, error) {
          opts.error && opts.error(xhr, errorType, error);
        },
        complete(xhr, status) {
          opts.complete && opts.complete(xhr, status);
        },
      });
    }
  }

  // 非正常请求处理
  function mockOrAppCall(opts, ajaxType) {
    // 支持mock数据
    if (opts.mock) {
      const mockData = opts.mock;

      $.getJSON(mockData.path, (data) => {
        if (mockData.error) {
          opts.error && opts.error(data);
        } else {
          opts.success && opts.success(data);
        }
        opts.complete && opts.complete();
      });
      return true;
    }

    return false;
  }

  // helper attr
  var Env = (function () {
    const location_href = location.href;
    let apiUrl = '';
    let sslApiUrl = '';
    let platform = '';

    if (location_href.indexOf('online.m.mockuai.com') != -1 || location_href.indexOf('http://m.mockuai.com') != -1 || location_href.indexOf('isonline') != -1) {
      platform = 'online';
      apiUrl = 'http://api.mockuai.com/'; // 线上
    } else if (location_href.indexOf('test.m.mockuai.com') != -1 || location_href.indexOf('istest') != -1) {
      platform = 'test';
      apiUrl = 'http://test.api.mockuai.com/'; // 测试
    } else if (location_href.indexOf('rc.m.mockuai.com') != -1 || location_href.indexOf('isrc') != -1) {
      platform = 'rc';
      apiUrl = 'http://rc.api.mockuai.com/'; // 预发
    } else {
      platform = 'dev';
      apiUrl = 'http://api.mockuai.com/'; // 开发 服务器
    }

    apiUrl = 'http://api.mockuai.com/';
    sslApiUrl = 'https://api.mockuai.com/';

    return {
      apiUrl,
      sslApiUrl,
      platform,
    };
  }());

  // exports
  lib.api = {
    // 是否需要全新的session_token
    needSessionToken: false,
    // 是否需要全新的access_token
    needAccessToken: false,
    // 等待请求队列
    requestQueue: [],
    inited: false,
    defaultOpts: {
      app_key: __API_APPKEY__,
      app_pwd: __API_APPPWD__,
      testApi: __API_HOSTURL__,
    },
    // 重置状态
    reset() {
      this.needSessionToken = false;
      this.needAccessToken = false;
      this.requestQueue = [];

      this.inited = false;
    },
    init(opts) {
      // 防止重复设置
      if (this.inited) return;
      this.inited = true;

      opts = opts || this.defaultOpts;

      const app_key = localStorage.getItem('app_key');
      const app_pwd = localStorage.getItem('app_pwd');
      if (app_key && app_pwd) {
        opts.app_key = app_key;
        opts.app_pwd = app_pwd;
      }

      this.app_key = opts.app_key;
      this.app_pwd = opts.app_pwd;

      if (opts.testApi) {
        Env.apiUrl = opts.testApi;
        Env.sslApiUrl = opts.testApi;
        this.testApi = opts.testApi;
      }
    },
    verify(needLogin) {
      if (!lib.storage) {
        console.error('lib.storage 必须先加载');
        return;
      }

      if (needLogin) {
        if (!lib.login) {
          console.error('lib.login 必须先加载');
          return;
        }

        if (!lib.login.isLogin()) {
          lib.login.goLogin();
          return;
        }

        return !this.needSessionToken && !this.needAccessToken;
      }
      return !this.needSessionToken;
    },
    get(opts) {
      this.init();

      const requestMethod = 'GET';

      const fn = function () {
        func_ajax(opts, requestMethod);
      };
      opts.fn = fn;

      if (this.verify(opts.needLogin)) {
        getSession(false, fn);
      } else {
        this.requestQueue.push(fn);
      }
    },
    post(opts) {
      this.init();

      const requestMethod = 'POST';

      const fn = function () {
        func_ajax(opts, requestMethod);
      };
      opts.fn = fn;

      if (this.verify(opts.needLogin)) {
        getSession(false, fn);
      } else {
        this.requestQueue.push(fn);
      }
    },
    file(opts) {
      this.init();

      const requestMethod = 'POST';

      const fn = function () {
        file_ajax(opts, requestMethod);
      };
      opts.fn = fn;

      if (this.verify(opts.needLogin)) {
        getSession(false, fn);
      } else {
        this.requestQueue.push(fn);
      }
    },
    callRequestQueue() {
      const fns = this.requestQueue;
      for (let i = 0, len = fns.length; i < len; i++) {
        fns[i].call();
      }
      // reset
      this.requestQueue = [];
    },
  };
}(window, window.lib || (window.lib = {})));
