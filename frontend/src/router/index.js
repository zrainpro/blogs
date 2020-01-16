import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'; // 首页
import Article from '../views/Article'; // 文章页

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/category/*',
    name: '分类',
    component: Home
  },
  {
    path: '/article/:id',
    name: '文章',
    component: Article
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// router.beforeEach((to) => {
// })

export default router
