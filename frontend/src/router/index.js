import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'; // 首页
import Article from '../views/Article'; // 文章页
import Category from '../views/Category'; // 分类文章
import Login from '../views/Login'; // 登录页

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/',
    redirect: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/home',
        name: '主页',
        component: Category
      },
      {
        path: '/category/*',
        name: '分类',
        component: Category
      },
      {
        path: '/article/:id',
        name: '文章',
        component: Article
      }
    ]
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
