import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
   api:'http://www.betern.com/cjzs/admin/',
  //  api:'http://www.betern.com/cjzs/admin',
  //  api:'apis',
   img:'http://www.betern.com/choujiang/assets/upload/',
   token:get('admin_token',604800000),
   userName:get('userName',604800000) || 'admin',
  },
  mutations: {
    change (state) {
      // 刷新
      state.token = get('admin_token',604800000)
    }
  }
})
