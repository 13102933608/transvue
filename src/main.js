// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
Vue.prototype.$http = axios
// 发布的时候把baseURL 的localhost改成服务器ip，只需要改这一处就行
axios.defaults.baseURL = 'http://localhost:9000'
// axios.defaults.baseURL = 'http://10.232.69.219:9000' 后台服务器
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
