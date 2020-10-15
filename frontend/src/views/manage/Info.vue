<template>
  <div style="width: 400px;padding-top: 50px">
    <Form :dataSource="options"
          :inline="false"
          ref="form"
          ok-text="提交"
          @onOk="submit"
          :show-reset="false"></Form>
  </div>
</template>

<script>
  import Form from '../../components/CreateForm';
  export default {
    components: { Form },
    name: "Info",
    data() {
      return {
        form: {
          beian: '',
          copyright: '',
          nickname: '',
          user: '',
          password: '',
          email: '',
          phone: ''
        },
        options: {
          main: [
            { type: 'input', key: 'nickname', label: '昵称' },
            { type: 'input', key: 'user', label: '登陆名' },
            { type: 'input', key: 'password', label: '密码' },
            { type: 'input', key: 'email', label: '邮箱' },
            { type: 'input', key: 'phone', label: '手机号' },
            { type: 'input', key: 'beian', label: '备案号' },
            { type: 'input', key: 'copyright', label: 'copyright' }
          ]
        }
      }
    },
    mounted() {
      // 获取用户信息
      const userInfo = window.localStorage.getItem('dXNlcg==');
      try {
        this.form = {
          ...this.form,
          ...JSON.parse(userInfo)
        };
        this.setDefault(); // 设置默认数据
      } catch (e) {
        console.error(e)
      }
      // 获取备案号
      this.apiGet('/api/common/json', { params: { key: 'beian' } }).then(res => {
        if (res.data && res.data.value) {
          this.form.beian = res.data.value;
          this.form.copyright = res.data.copyright || 'Copyright © 2017- {now}. All Rights Reserved. {备案号}';
          this.setDefault(); // 设置默认数据
        }
      });
    },
    methods: {
      setDefault() {
        this.options.main.forEach(item => {
          if (this.form[item.key]) {
            this.$set(item, 'default', this.form[item.key]);
          }
        });
        this.$refs.form.setDefault(); // 设置组件的默认值
      },
      submit(form) {
        const params = {
          user: this.form.user,
          nickname: form.nickname,
          email: form.email,
          phone: form.phone
        }
        if (form.password) {
          params.password = window.btoa(form.password)
        }
        if (form.user !== this.form.user) {
          params.newUser = form.user;
        }
        this.apiPost('/api/user/modify', params).then(res => {
          if (res.code === 200) {
            this.$message.success('修改用户信息成功!')
            // 修改了用户名或者密码要重新登录
            if (params.newUser || params.password) {
              this.$emitComponentMethod('loginout'); // 登出设备
            }
          }
        })
        // 更新备案号
        if (form.beian) {
          this.apiPost('/api/common/json', {
            key: 'beian',
            value: { value: form.beian, copyright: form.copyright }
          }).then(res => {
            this.$message.success('修改备案号成功')
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
