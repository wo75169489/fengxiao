<template>
    <div class="sidebar">
        <div class="navbar-left" v-if="copyright === '无敌掌柜提供技术支持'">
            <div class="logo">
                <div class="logo-img"></div>
                <div class="logo-text"></div>
            </div>
        </div>
        <SidebarForm/>
        <nav class="sidebar-nav">
            <div slot="header"></div>
            <ul class="nav">
                <template v-for="(item, index) in navItems" v-key="index">
                    <template v-if="item.title">
                        <SidebarNavTitle :name="item.name" :classes="item.class" :wrapper="item.wrapper"/>
                    </template>
                    <template v-else-if="item.divider">
                        <li class="divider"></li>
                    </template>
                    <template v-else>
                        <template v-if="item.children">
                            <!-- First level dropdown -->
                            <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon">
                                <template v-for="(childL1, index) in item.children">
                                    <template v-if="childL1.children">
                                        <!-- Second level dropdown -->
                                        <SidebarNavDropdown :name="childL1.name" :url="childL1.url" :icon="childL1.icon">
                                            <li class="nav-item" v-for="(childL2, index) in childL1.children">
                                                <SidebarNavLink :name="childL2.name" :url="childL2.url" :icon="childL2.icon" :badge="childL2.badge" :variant="item.variant"/>
                                            </li>
                                        </SidebarNavDropdown>
                                    </template>
                                    <template v-else>
                                        <SidebarNavItem :classes="item.class">
                                            <SidebarNavLink :name="childL1.name" :url="childL1.url" :icon="childL1.icon"
                                                            :badge="childL1.badge" :variant="item.variant"/>
                                        </SidebarNavItem>
                                    </template>
                                </template>
                            </SidebarNavDropdown>
                        </template>
                        <template v-else>
                            <SidebarNavItem :classes="item.class" :itemName="item.name">
                                <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon"
                                                :badge="item.badge" :variant="item.variant"/>
                            </SidebarNavItem>
                        </template>
                    </template>
                </template>
            </ul>
            <slot></slot>
        </nav>
        <SidebarFooter/>
        <div class="nav-tooltip collapsed" @click="sidebarToggle">
            <div class="nav-tooltip-rel">
                <div>
                    <i class="icon el-icon-d-arrow-right"></i>
                    <i class="icon el-icon-d-arrow-left"></i>
                    <span class="nav-name">收缩侧边栏</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SidebarFooter from "./SidebarFooter";
import SidebarForm from "./SidebarForm";
import SidebarHeader from "./SidebarHeader";
import SidebarMinimizer from "./SidebarMinimizer";
import SidebarNavDropdown from "./SidebarNavDropdown";
import SidebarNavLink from "./SidebarNavLink";
import SidebarNavTitle from "./SidebarNavTitle";
import SidebarNavItem from "./SidebarNavItem";

export default {
  name: "sidebar",
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    },
    copyright: {
      type: String,
      default: ""
    }
  },
  components: {
    SidebarFooter,
    SidebarForm,
    SidebarHeader,
    SidebarMinimizer,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle("open");
    },
    mobileSidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-mobile-show");
    },
    sidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-hidden");
    }
  }
};
</script>

<style lang="scss">
.sidebar {
  .navbar-left {
    display: flex;
    background: #292c33;
    width: 200px;
    height: 55px;
  }

  .el-icon-d-arrow-right {
    display: none;
  }

  .nav-tooltip,
  .nav-tooltip-rel {
    display: inline-block;
  }

  .collapsed {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;
    line-height: 48px;
    background: hsla(0, 0%, 100%, 0.09);
    font-size: 14px;
    color: #9e9e9e;
    cursor: pointer;
    .icon {
      position: absolute;
      left: 28px;
      top: 0;
      height: 48px;
      line-height: 48px;
    }
    .nav-name {
      position: absolute;
      left: 65px;
      top: 0;
      height: 48px;
      line-height: 48px;
    }
    &:hover {
      color: #ffffff;
    }
  }
}

.sidebar-hidden {
  .el-icon-d-arrow-left {
    display: none;
  }
  .el-icon-d-arrow-right {
    display: block;
  }
}

.logo {
  padding: 16px 0 0 18px;
  .logo-img {
    background: url("http://img.mockuai.com/tms/2018/1/17/upload_25b78af9600dee70bf31091c09c4749d.png")
      no-repeat;
    background-size: 100%;
    width: 30px;
    height: 30px;
    display: inline-block;
    vertical-align: middle;
  }

  .logo-text {
    background: url("http://img.mockuai.com/tms/2018/1/17/upload_4c4e4b09474937b90a1589caecdcc1e1.png")
      no-repeat;
    background-size: 100%;
    width: 84px;
    height: 19px;
    display: inline-block;
    margin-left: 14px;
    vertical-align: middle;
  }
}

.logo_url {
  display: inline-block;
  width: 150px;
  height: 55px;
  padding: 0.5rem 1rem;
  margin-right: 0;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 75%;
}

.sidebar-nav {
  padding-top: 5px;
}

.nav-link {
  cursor: pointer;
  height: 45px !important;
  line-height: 45px !important;
  padding: 0 !important;
}

.sidebar {
  position: absolute;
  width: 200px;
  left: 0;
  background: #292c33;
  padding-bottom: 48px;
  overflow: hidden;
}

.sidebar .nav-link i {
  margin: 0 18px 0 24px !important;
  vertical-align: middle;
}

.sidebar .nav-link .nav-name {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.09) !important;
}

.nav-link.active {
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 45px;
    background: #4a8ef7;
  }
}
</style>
