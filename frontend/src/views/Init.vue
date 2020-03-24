<template>
  <div class="init">
    <div class="title">初始化项目</div>
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.user" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.password" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain @click="handleOk">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'init',
  data() {
    return {
        user: {
            user: '',
            nickname: '',
            password: '',
            email: '',
            phone: ''
        }
    }
  },
  create() {
      this.apiGet('/api/needinit').then(res => {
          if (res.code !== 200 || !res.data) {
              this.$router.replace('/'); // 防止重复初始化
          }
      })
  },
  methods: {
      handleOk() {
          this.apiPost('/api/init', {
            ...this.user,
            password: window.btoa(this.user.password)
          }).then(res => {
              if (res.code === 200) {
                  this.$router.replace('/'); // 跳到主页
              }
          })
      }
  }
}
</script>

<style lang="less" scoped>
.init {
  padding: 20px;
  background-color: rgba(255,255,255,0.5);
  width: 350px;
  min-height: 400px;
  margin: calc(50vh - 300px) auto auto auto;
  text-align: left;
  .title {
      text-align: center;
      font-size: 24px;
      color: #27AE60;
      margin-bottom: 20px;
  }
  /deep/ .el-input {
      width: 200px;
  }
}
</style>
