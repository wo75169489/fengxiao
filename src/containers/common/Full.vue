<template>
    <div class="app">
        <vue-progress-bar style="background: #4A8EF7"></vue-progress-bar>
        <Sidebar :navItems="nav" :copyright="copyright"/>
        <div class="app-body">
            <AppHeader userName="mockuai" :logo_url="logo_url"/>
            <main class="main" :class="mainBg">
                <div class="container-fluid">
                    <router-view></router-view>
                </div>
            </main>
            <AppAside/>
        </div>
        <AppFooter :tec="tec"/>
        <div id="common-tooltip-popper" class="nav-tooltip-popper" x-placement="right">
            <div class="nav-tooltip-content">
                <div class="nav-tooltip-arrow"></div>
                <div class="nav-tooltip-inner" id="tooltip-name"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .main {
        background-color: #ffffff;
    }

    .mainBg {
        background-color: #e8eaed;
    }

    .app {
        height: 100%;
        position: relative;
        padding-left: 200px;
        overflow: hidden;
        transition: padding-left 0.25s;
    }

    .sidebar-hidden {
        .app {
            padding-left: 65px;
        }
    }

    .container-fluid {
        height: calc(100vh - 105px);
        overflow: auto;
        padding-top: 16px;
    }

    .nav-tooltip-popper {
        position: absolute;
        display: none;
        top: 100px;
        left: 68px;
        padding: 0 5px 0 8px;
        z-index: 1000;
        .nav-tooltip-arrow {
            position: absolute;
            left: 3px;
            top: 50%;
            margin-top: -5px;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            border-width: 5px 5px 5px 0;
            border-right-color: rgba(0, 0, 0, .5);
        }
        .nav-tooltip-inner {
            max-width: 250px;
            min-height: 34px;
            color: #fff;
            text-align: left;
            text-decoration: none;
            background-color: rgba(0, 0, 0, .5);
            border-radius: 4px;
            white-space: nowrap;
            padding: 8px;
            line-height: 1.5;
            font-size: 12px;
            box-shadow: 2px 2px 6px 0 rgba(136, 156, 176, .2);
        }
    }
</style>


<script>
  import {Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb} from '../../components/';
  import sidebar from '@/config/sidebar.json';
  // 获取全局配置的接口
  // const api = {
    //配置信息
    // requestOemConfig(cb) {
    //   lib.api.get({
    //     api: 'wdzg/agent/b/customer/website_config/get',
    //     data: {},
    //     success: (data) => {
    //       cb && cb(data.data.website_config);
    //     },
    //     error: (data) => {
    //       console.error(data);
    //       // this.$message.error('获取模块管理列表失败!');
    //     }
    //   })
    // },
  // }

  export default {
    name: 'full',
    components: {
      AppHeader,
      Sidebar,
      AppAside,
      AppFooter,
      Breadcrumb,
    },
    data() {
      return {
        tec: '',
        logo_url: '',
        user: null,
        nav: [],
        copyright: ''
      };
    },
    computed: {
      name() {
        return this.$route.name;
      },
      list() {
        return this.$route.matched;
      },
      mainBg() {
        if (this.$route.name === '页面装修') {
          return 'mainBg';
        }
      }
    },
    mounted() {
      var that = this;
      this.renderNav();
      // this.user = lib.storage.get('user');
      // api.requestOemConfig(function (data) {
      //   that.tec = data.website_copyright || '';
      //   that.logo_url = data.logo_url || '';
      //   that.copyright = data.tech_support_copyright;
      // });
    },
    methods: {
      renderNav() {
        this.nav = sidebar.nav_list;
      }
    },
  };
</script>
