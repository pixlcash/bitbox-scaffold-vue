// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Paint from './components/paint'
import Bitbox from './components/Bitbox'
import Login from './components/Login'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(VueRouter)
const routes = [
  {path: '/paint', component: Paint},
  {path: '/', component: Bitbox},
  {path: '/login', component: Login}
]
const router = new VueRouter({routes, mode: 'history'})
Vue.config.productionTip = false
export const bus = new Vue()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
