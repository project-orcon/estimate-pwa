import Vue from 'vue'
import Router from 'vue-router'
import HomeView from './views/HomeView.vue'
import NewView from './views/NewView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/newTask',
      name: 'newTask',
      component: NewView
    }
  ]
})
