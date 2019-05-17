import Vue from 'vue'
import Router from 'vue-router';
import BodyWrap from './views/BodyWrap.vue'
import Moderation from './views/Moderation.vue'
import DetectText from './views/DetectText.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      alias : '/rekog',
      name: 'BodyWrap',
      component: BodyWrap,
      children : [
        {
          path : 'detectLabel',
          name : 'detectLabel',
          component: () => import(/* webpackChunkName: "DetectLabel" */ './views/ImageTag.vue')
        },
        {
          path: 'detectText',
          name: 'DetectText',
          component: () => import(/* webpackChunkName: "detectText" */ './views/DetectText.vue')
        },
        {
          path: 'moderation',
          name: 'Moderation',
          component: () => import(/* webpackChunkName: "moderation" */ './views/Moderation.vue')
        },
      ]
    },
    {
      path : '/rekog',
      redirect : '/rekog/detectLabel'
    },
    {
      path: '/admin',
      name : 'Admin',
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue')
    }


  ]
})
