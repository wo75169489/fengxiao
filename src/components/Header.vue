<template>
  <header class="app-header navbar">
    <div class="navbar-left"></div>
    <div class="navbar-right">
      <b-nav is-nav-bar class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            <span>当前登录: </span>
            <span class="d-md-down-none">{{userName}}</span>
          </template>
          <b-dropdown-item @click="logout"><i class="icon-logout"></i> 退出登录</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>
    </div>
  </header>
</template>
<style scoped>

</style>
<script>
export default {
  name: 'header',
  props: ['logo_url'],
  data() {
    return {
      userName: null
    }
  },
  mounted() {
    var user = this.$store.state.userName
    this.userName = user || '未知';
  },
  methods: {
    sidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle('sidebar-hidden');
    },
    sidebarMinimize(e) {
      e.preventDefault();
      document.body.classList.toggle('sidebar-minimized');
    },
    mobileSidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle('sidebar-mobile-show');
    },
    asideToggle(e) {
      e.preventDefault();
      document.body.classList.toggle('aside-menu-hidden');
    },

    logout() {
      this.$http({url:`${this.$store.state.api}logout`}).then(result=>{
          if(result.body.message == 'success'){
              window.localStorage.removeItem('admin_token')
              this.$store.commit('change')
              this.$router.push('login')
              this.$message('登出成功')
           }else{
              this.$message.error(result.status + '系统错误')
           }
      }).catch(function(error){
        this.$message.error(error.status + '系统错误')
      })
      // lib.api.post({
      //   api:'wdzg/b/user/logout',
      //   data: {},
      //   success: () => {
      //     this.$router.push({path: '/pages/login'});
      //   },
      //   error: (data) => {
      //     this.$message.error(data && data.msg);
      //   }
      // })
    }
  },
};
</script>
