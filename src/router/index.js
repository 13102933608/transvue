import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import PwdRet from '../components/admin/PwdRet.vue'
import BaseReport from '../components/report/BaseReport.vue'
import VehicleImp from '../components/report/VehicleImp.vue'
import VehicleDel from '../components/report/VehicleDel.vue'
import BaseDel from '../components/report/BaseDel.vue'
import VehicleReport from '../components/report/VehicleReport.vue'
import RoadReport from '../components/report/RoadReport.vue'
import RoadChart from '../components/report/RoadChart.vue'
import PieChart from '../components/report/PieChart.vue'
Vue.use(VueRouter)

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '*',
      redirect: '/welcome'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome', // 最好写path: 'welcome',不加/
          component: Welcome
        },
        {
          path: '/user',
          component: UserList
        },
        {
          path: '/pwdret',
          component: PwdRet
        },
        {
          path: '/basereport',
          component: BaseReport
        },
        {
          path: '/vehicleimp',
          component: VehicleImp
        },
        {
          path: '/basedel',
          component: BaseDel
        },
        {
          path: '/vehicledel',
          component: VehicleDel
        },
        {
          path: '/vehiclereport',
          component: VehicleReport
        },
        {
          path: '/roadreport',
          component: RoadReport
        },
        {
          path: '/roadchart',
          component: RoadChart
        },
        {
          path: '/piechart',
          component: PieChart
        }
      ]
    }
  ]
})
// 路由守卫
Router.beforeEach((to, from, next) => {
  // to:将要访问的地址   from：从哪儿来的请求  next：将要干什么
  // next()  访问to的地址   next(url)  重定向到url地址
  if (to.path === '/login') { //  如果是登录，放行
    // console.log('first login')
    return next()
  }
  const userflag = window.sessionStorage.getItem('username')
  // console.log('router:' + userflag)
  if (!userflag) {
    // console.log('no login')
    return next('/login')// 如果没有登录验证，则返回登录页面
  }
  // console.log('succ')
  next() // 已经登录验证，放行
})
export default Router
