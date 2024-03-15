import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@style/global.scss'
import './permission.js'
import '@/utils/global.js' // 全局通用
import i18n from "./lang" // 国际化


Vue.config.productionTip = false
// 开启performance用于性能分析
Vue.config.performance = process.env.NODE_ENV !== 'production'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
