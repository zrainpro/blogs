import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeLayout from '../baseLayout/Frontend.vue'; // 首页layout
import Base from '../baseLayout/base'; // router-view
import Article from '../views/Article'; // 文章页
import Category from '../views/Category'; // 分类文章

Vue.use(VueRouter);

const routes = [
  {
    path: '/init',
    name: '初始化',
    component: () => import('../views/Init.vue') // 初始化
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login') // 登录页
  },
  {
    path: '/manage',
    redirect: '/manage/home',
    name: 'ManageLayout',
    component: () => import('../baseLayout/Manage.vue'), // 后台首页layout
    children: [
      {
        path: '/manage/home',
        name: '管理首页',
        component: () => import('../views/manage/Home.vue') // 后台首页
      },
      {
        path: '/manage/menu',
        name: '菜单管理',
        component: () => import('../views/manage/Menu.vue') // 菜单管理
      },
      {
        path: '/manage/article',
        redirect: '/manage/article/lists',
        name: '文章管理',
        component: Base, // 文章管理
        children: [
          {
            path: '/manage/article/lists',
            name: '文章管理',
            component: () => import('../views/manage/Article.vue') // 文章管理
          },
          {
            path: '/manage/article/create',
            name: '创建文章',
            component: () => import('../views/manage/EditArticle') // 创建文章
          },
          {
            path: '/manage/article/:id',
            name: '编辑文章',
            component: () => import('../views/manage/EditArticle') // 编辑文章
          }
        ]
      },
      {
        path: '/manage/comment',
        name: '评论管理',
        component: () => import('../views/manage/Comment.vue') // 评论管理
      },
      {
        path: '/manage/background',
        name: '背景图管理',
        component: () => import('../views/manage/background.vue') // 背景图管理
      },
      {
        path: '/manage/head',
        name: '评论头像管理',
        component: () => import('../views/manage/head.vue') // 评论头像管理
      },
      {
        path: '/manage/link',
        name: '友链管理',
        component: () => import('../views/manage/Link.vue') // 友链管理
      },
      {
        path: '/manage/*',
        name: '404',
        component: () => import('../views/404')
      }
    ]
  },
  {
    path: '/',
    redirect: '/home',
    name: 'home',
    component: HomeLayout,
    children: [
      {
        path: '/',
        name: '主页',
        component: Category
      },
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
      },
      {
        path: '/*',
        name: '404',
        component: () => import('../views/404')
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
