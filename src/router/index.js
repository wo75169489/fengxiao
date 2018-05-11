import Vue from 'vue';
import Router from 'vue-router';

import commonRouter from './common';
import notFound from './404';
import pageRouter from './page';

Vue.use(Router);

const baseRouter = [];

function combineRouter(routers) {
  return routers.reduce((pre, cur) => pre.concat(cur), baseRouter);
}

const pageRouters = [
  commonRouter,
  pageRouter,
];

// 404
pageRouters.push(notFound);

const router = new Router({
  mode: 'hash',
  // 激活路由时路由链接的类名
  linkActiveClass: 'open active',
  //跳转到一个新页面时,定位到顶端
  scrollBehavior: () => ({ y: 0 }),
  routes: combineRouter(pageRouters),
});
// router.beforeEach((to, from, next) => {
//   if(to.meta.requireAuth) { // 如果路由项需要权限校验
//     /* 
//       从Vuex拿出token码，说明已登陆
//      （前端的token可伪造，所以这并不是完全靠谱，后面继续说）
//     */
//     if (store.state.token) { 
//       next() // 正常跳转页面
//     } else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath}  
//         /* 将跳转的路由地址作为参数带给登陆页，登录成功后跳转回该页面 */
//       })
//     }
//   } else { // 如果不需要权限校验，直接进入路由页面
//       next();
//   }
// })

export default router;
