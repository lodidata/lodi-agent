import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

var router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index')
    }, {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index')
    }, {
      path: '/homeList',
      name: 'homeList',
      component: () => import('@/views/home/home-list')
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('@/views/wallet/index')
    },
    {
      path: '/addCard',
      name: 'addCard',
      component: () => import('@/views/wallet/card')
    },
    {
      path: '/walletRecord',
      name: 'walletRecord',
      component: () => import('@/views/wallet/record')
    },
    {
      path: '/walletShare',
      name: 'walletShare',
      component: () => import('@/views/wallet/shareholder')
    }
  ],
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition || typeof savedPosition == 'undefined') {
      if (savedPosition) {
        return savedPosition;
      }
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

export default router
