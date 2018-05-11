export default {
  get(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      lib.api.get({
        api: url,
        data: params,
        success: (data) => { resolve(data.data) },
        error: data => { reject(data) },
      });
    });
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      lib.api.post({
        api: url,
        data: params,
        success: (data) => { resolve(data.data) },
        error: data => { reject(data) },
      });
    });
  },
};
