import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/ImageTag.vue'
import Moderation from './views/Moderation.vue'
import DetectText from './views/DetectText.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/moderation',
      name: 'Moderation',
      component: () => import(/* webpackChunkName: "moderation" */ './views/Moderation.vue')
    },
    {
      path: '/detectText',
      name: 'DetectText',
      component: () => import(/* webpackChunkName: "detectText" */ './views/DetectText.vue')
    }
  ]
})
