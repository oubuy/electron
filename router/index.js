import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';
const store = require('../store/index.js').default;
const Base64 = require('js-base64').Base64;
import electron from 'electron';

Vue.use(iView);
Vue.use(electron);

Vue.use(Router)

const router= new Router({
  routes: [{
      path: '/',
      // component: Main,
      redirect: '/main/home'
    },
    {
      path: '/main',
      name: 'main',
      component: require('@/view/main').default,
      redirect: '/main/home',
      children: [{
          path: 'home',
          name: 'home',
          component: require('@/view/home').default
        },
        {
          path: 'product',
          name: 'product',
          component: require('@/view/product/product').default,
          meta:{keepAlive:true}
        },
        {
          path: 'product_children_info',
          name: 'product_children_info',
          component: require('@/view/product/product_children_info').default
        },
        {
          path: 'product_info',
          name: 'product_info',
          component: require('@/view/product/product_info').default,
          // meta:{keepAlive:true}
        },
        {
          path: 'case',
          name: 'case',
            component: require('@/view/case/case').default,
          // component: require('@/view/case/case_list').default,
          meta:{keepAlive:true}
        },
        {
          path: 'case_info',
          name: 'case_info',
          component: require('@/view/case/case_info').default
        },
      
        {
          path: 'model',
          name: 'model',
          component: require('@/view/model/building').default,
          meta:{keepAlive:true}
        },
        {
          path: 'scene',
          name: 'scene',
          component: require('@/view/scene/scene').default,
          // component: require('@/view/scene/scene_w').default,
          meta:{keepAlive:true}
          // ,
          // meta:{keepAlive:true}
        },
        // {
        //   path: 'scene_w',
        //   name: 'scene_w',
        //   component: require('@/view/scene/scene_w').default
        //   // ,
        //   // meta:{keepAlive:true}
        // },
        {
          path:'full_spherical',
          name:'full_spherical',
          component: require('@/view/full_spherical/full_spherical').default,
          // component: require('@/view/full_spherical/full_spherical_list').default,          
          meta:{keepAlive:true}
        },
        {
          path:'full_spherical_info',
          name:'full_spherical_info',
          component: require('@/view/full_spherical/full_spherical_info').default
        },
        {
          path:'change_brick',
          name:'change_brick',
          component: require('@/view/change_brick/change_brick').default,
          // component: require('@/view/change_brick/change_brick_list').default,
          meta:{keepAlive:true}
        },
        {
          path:'change_brick_info',
          name:'change_brick_info',
          component: require('@/view/change_brick/change_brick_info').default
        },
        {
          path: 'favorites',
	      name: 'favorites',
	      component: require('@/view/favorites/favorites').default
        },
        {
          path: 'figure',
          name: 'figure',
            component: require('@/view/figure/figure').default,
          // component: require('@/view/case/case_list').default,
          meta:{keepAlive:true}
        },
        {
          path: 'figure_info',
          name: 'figure_info',
          component: require('@/view/figure/figure_info').default
        },
      ]
    },
    {
       path: '/web',
       name: 'web',
       component: require('@/view/web').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// 在每个路由生效之前，先进行一些处理，请参考 vue-router官方文档-导航钩子
router.beforeEach((to, from, next) => {
  // 对 to.matched 数组中的每个路由调用箭头函数
    // 判断登录状态
    let token = store.getters.loginUser.token
    if(token==undefined){
      next()
    }else{
      let decodeToken = JSON.parse(Base64.decode(token.split('.')[1]));
      let exp = decodeToken.exp;
      // let _this=this;
      let currsetTime = parseInt(new Date().getTime() / 1000);
      let t = exp - currsetTime
      // console.log('t',t)
      if(exp - currsetTime > 0) {
        // 继续路由
        next()
      } else {
        store.dispatch("logout");
        electron.ipcRenderer.send("user-logout");
        iView.Message.warning('登录已过期，请重新登录');
        // 重定向到登录界面
        next({
          path: '/'
        })
      }
    }
})

export default router;

