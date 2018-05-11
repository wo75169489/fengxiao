import Vue from 'vue';
import VueResource from 'vue-resource';
import VueLazyload from 'vue-lazyload';
import BoostrapVue from 'bootstrap-vue';
import VueProgressBar from 'vue-progressbar';
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor';
import VueQuillEditor from 'vue-quill-editor';
import Vuex from 'vuex'
import store from './store.js'

import App from './App.vue';
import router from './router';
import './config';

import '../theme/index.css';

// import './js/common/api';
import './js/common/login';
import './js/common/storage';

// 颜色选择器插件
import colorPicker from './plugin/vue-color-picker'
Vue.use(colorPicker)
Vue.use(VueResource);
// Vue.use(axios)
Vue.use(BoostrapVue);
Vue.use(VueLazyload);
Vue.use(VueProgressBar);
// 设置进度条，超过50ms未响应的API将显示进度条
Vue.use(VueResourceProgressBarInterceptor, {
  latencyThreshold: 50,
  responseLatency: 50,
});
Vue.use(VueQuillEditor);

Vue.config.productionTip = false;
// Vue.prototype.$http = axios
function formatComponentName(vm) {
  if (vm.$root === vm) return 'root';
  var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');

}
// 测试环境不监听BUG
if (__API_HOSTURL__ !== 'http://apidaily.mockuai.com/') {
  Vue.config.errorHandler = function (err, vm, info) {
    var componentName = formatComponentName(vm);
    var propsData = vm.$options && vm.$options.propsData;

    fundebug.notifyError(err,
      {
        metaData:
          {
            componentName: componentName,
            propsData: propsData,
            info: info
          }
      });
  };
}
// Vue.http.interceptors.push((request, next) => {
//   let that = this
//   if(!store.state.token){
//     request.headers.map['admin_token'] = null
//   }
//   next((response) => {
//     if (response.status === 403) {
//       window.localStorage.removeItem('admin_token')
//       store.commit('change')
//       router.push('login')
//     }
//     return response;
//   });
// });
// router.beforeEach((to, from, next) => {
//   if (to.name != 'Login') {
//     if (store.state.token) {
//       Vue.http.headers.common['admin_token'] = store.state.token
//       next()
//     } else {
//       next({
//         path: '/login',
//       })
//     }
//   } else {
//     if (store.state.token) {
//       Vue.http.headers.common['admin_token'] = store.state.token
//       next({
//         path: '/index'
//       })
//     } else {
//       next()
//     }
//   }
// })
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
  },
  created: function () {


  }
});
