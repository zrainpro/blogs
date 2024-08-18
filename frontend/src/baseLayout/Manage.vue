<template>
  <div class="manage">
    <div class="layout">
      <div class="logo">
        后台
      </div>
      <div class="menu">
        <router-link
          v-for="(item, index) in menu"
          :key="index"
          :class="`menu-item ${$route.path.includes(item.route) ? 'menu-focus' : ''}`"
          :to="item.route"
        >
          {{item.name}}
        </router-link>
      </div>
    </div>
    <div class="content">
      <div class="topbar">
        <div>
          <router-link to="/" target="_blank">网站首页</router-link>
        </div>
        <div>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{userInfo.nickname}} 您好<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="info">网站信息</el-dropdown-item>
                <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="router">
        <router-view v-slot="{ Component }">
          <transition>
            <component :is="Component"></component>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'manageLayout',
  data() {
    return {
      menu: [
        { name: '首页', route: '/manage/home' },
        { name: '菜单管理', route: '/manage/menu' },
        { name: '文章管理', route: '/manage/article/lists' },
        { name: '评论管理', route: '/manage/comment' },
        { name: '背景图管理', route: '/manage/background' },
        { name: '评论头像管理', route: '/manage/head' },
        { name: '友链管理', route: '/manage/link' }
      ],
      userInfo: {}
    }
  },
  mounted() {
    const userInfo = window.localStorage.getItem('dXNlcg==');
    if (userInfo) {
      try {
        this.userInfo = JSON.parse(userInfo);
      } catch (e) {
        console.error(e)
      }
    } else {
      this.$message.info('登录过期,请重新登录!')
      this.$router.replace('/login')
    }
    // 把登出事件挂载到全局
    this.$onComponentMethod('loginout', {
      handler: this.loginout.bind(this)
    });
  },
  methods: {
    handleCommand(command) {
      if (command === 'loginout') {
        this.loginout()
      } else if (command === 'info') {
        this.info();
      }
    },
    // 跳转到网站信息
    info() {
      this.$router.push('/manage/info')
    },
    // 退出登录
    loginout() {
      this.apiPost('/api/loginout').then(res => {
        if (res.code === 200) {
          this.$message.success('登出成功');
          window.localStorage.removeItem('dXNlcg=='); // 删除用户信息
          this.$router.push('/');
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url(../style/var.less);
.manage {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  .layout {
    width: 240px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #333;
    color: #eee;
    flex-shrink: 0;
    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 18px;
      border-bottom: 1px solid #eee;
    }
    .menu {
      overflow-y: auto;
      flex: 1;
      .menu-item {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        padding-left: 20px;
        &:hover {
          background-color: #666;
        }
      }
      .menu-focus {
        background-color: #666;
        color: @link;
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;
    background-color: #e9e9e9;
    .topbar {
      height: 60px;
      width: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
    }
    .router {
      flex: 1;
      width: calc(100% - 30px);
      margin: 15px;
      background-color: #fff;
      overflow: auto;
    }
  }
}
</style>
