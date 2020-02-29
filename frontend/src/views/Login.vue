<template>
  <div class="login">
    <div class="login-box">
      <img class="login-logo" src="../assets/logo.png" alt="">
      <el-form :model="user" :rules="rules" ref="login" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="success" plain @click="$router.push('/')">返回首页</el-button>
        <el-button type="primary" plain @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        user: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名' }
          ],
          password: [
            { required: true, message: '请输入密码' }
          ]
        }
      }
    },
    mounted () {
      // 去除背景色
      document.body.removeAttribute('style');
      if (sessionStorage.getItem('user')) {
        this.$router.push('/manage');
      }
    },
    methods: {
      login() {
        this.$refs.login.validate(valid => {
          if (valid) {
            this.apiPost('/api/login', {
              user: this.user.name,
              password: window.btoa(this.user.password)
            }).then(res => {
              if (res.code === 200) {
                window.sessionStorage.setItem('user', JSON.stringify(res.data));
                this.$message.success('登录成功');
                this.$router.push('/manage');
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login {
    width: 100vw;
    height: 100vh;
    background-color: #2D4654;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box {
      padding: 30px;
      width: 400px;
      background-color: rgba(255,255,255,1);
      border-radius: 5px;
    }
    .login-logo {
      width: 100px;
      height: 100px;
      margin-bottom: 40px;
    }
  }
</style>
