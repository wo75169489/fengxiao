/**
 * 本地存储实现
 *
 * 优先localstorage, 否则 cookie
 *
 * @author 景烁
 * @create 2014-11-28
 *
 *
 *
 */

(function(win, lib) {
  /* \
     |*|
     |*|  :: cookies.js ::
     |*|
     |*|  A complete cookies reader/writer framework with full unicode support.
     |*|
     |*|  Revision #1 - September 4, 2014
     |*|
     |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
     |*|  https://developer.mozilla.org/User:fusionchess
     |*|
     |*|  This framework is released under the GNU Public License, version 3 or later.
     |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
     |*|
     |*|  Syntaxes:
     |*|
     |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
     |*|  * docCookies.getItem(name)
     |*|  * docCookies.removeItem(name[, path[, domain]])
     |*|  * docCookies.hasItem(name)
     |*|  * docCookies.keys()
     |*|
     \ */

  const docCookies = {
    prefix: '',
    setPrefix(prefix) {
      this.prefix = prefix;
    },
    _key(key) {
      return this.prefix + key;
    },
    get(key) {
      return this.getItem(this._key(key));
    },
    set(key, sValue, vEnd, sPath, sDomain, bSecure) {
      const that = this;
      vEnd = vEnd || 7 * 24 * 60 * 60;
      sPath = sPath || '/';
      if (!sDomain) {
        const host = location.hostname;
        // not ip
        if (!host.match(/\d+\.\d+\.\d+\.\d+/)) {
          const reg = /.+\.([^\.]+\.[^\.]+)$/;
          const match = host.match(reg);

          if (match && match[0]) {
            sDomain = match[0];
          }
        }
      }
      return this.setItem(that._key(key), sValue, vEnd, sPath, sDomain, bSecure);
    },
    rm(key, sPath, sDomain) {
      const that = this;
      sPath = sPath || '/';
      if (!sDomain) {
        const host = location.hostname;
        // not ip
        if (!host.match(/\d+\.\d+\.\d+\.\d+/)) {
          const reg = /.+\.([^\.]+\.[^\.]+)$/;
          const match = host.match(reg);

          if (match && match[1]) {
            this.removeItem(that._key(key), sPath);
            this.removeItem(that._key(key), sPath, match[0]);
            this.removeItem(that._key(key), sPath, match[1]);
          }
        }
      } else {
        this.removeItem(that._key(key), sPath, sDomain);
      }
    },
    getItem(sKey) {
      if (!sKey) { return null }

      const nameEQ = `${sKey}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        let val = '';
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
          val = c.substring(nameEQ.length, c.length);
        }
        if (val) {
          return val;
        }
      }
      return null;
    },
    setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false }
      let sExpires = '';
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
            break;
          case String:
            sExpires = `; expires=${vEnd}`;
            break;
          case Date:
            sExpires = `; expires=${vEnd.toUTCString()}`;
            break;
        }
      }
      document.cookie = `${encodeURIComponent(sKey)}=${encodeURIComponent(sValue)}${sExpires}${sDomain ? `; domain=${sDomain}` : ''}${sPath ? `; path=${sPath}` : ''}${bSecure ? '; secure' : ''}`;
      return true;
    },
    removeItem(sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false }
      document.cookie = `${encodeURIComponent(sKey)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${sDomain ? `; domain=${sDomain}` : ''}${sPath ? `; path=${sPath}` : ''}`;
      return true;
    },
    hasItem(sKey) {
      if (!sKey) { return false }
      return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=`)).test(document.cookie);
    },
    keys() {
      const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
      for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]) }
      return aKeys;
    },
  };

  let localStorage;
  const DB = (function() {
    const main = {
      isLocalStorageOk: false,
      prefix: '',
      data: {},
      init() {
        this.checkLocalStorage();
        this.setMethod();

        return this;
      },
      checkLocalStorage() {
        if ('localStorage' in window && window.localStorage !== null) {
          // ios7 暂时存在问题
          try {
            window.localStorage.setItem('test', 'test');
            window.localStorage.removeItem('test');

            this.isLocalStorageOk = true;
          } catch (e) {
            // console.error(e);
          }
        }
      },

      setPrefix(prefix) {
        this.prefix = prefix;
      },

      // 设置存储方式
      setMethod(method) {
        method = method || '';

        if (this.isLocalStorageOk) {
          localStorage = method == 'cookie' ? docCookies : window.localStorage;
        } else {
          localStorage = docCookies;
        }
      },

      set(key, value) {
        this.data[key] = value;

        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }

        // if (this.isLocalStorageOk) {
        localStorage.setItem(this.prefix + key, value);
        // }
      },

      get(key) {
        let d = this.data[key];

        if (typeof d === 'undefined') {
          d = localStorage.getItem(this.prefix + key);

          try {
            d = JSON.parse(d);
          } catch (e) {
            // do sth
          }
        }
        return d;
      },

      rm(key) {
        if (key) {
          key = this.prefix + key;
          delete this.data[key];
          localStorage.removeItem(key);
        }
      },
    };

    return main.init();
  }());

    // export
  lib.storage = DB;
  lib.cookie = docCookies;
}(window, window.lib || (window.lib = {})));
