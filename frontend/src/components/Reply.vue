<template>
  <div ref="box" class="reply">
    <el-button type="text" @click="show = !show">回复</el-button>
    <div v-show="show" class="reply-box">
      <div v-if="showUser">
        <el-form :model="user" :rules="rules" inline label-width="80px">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="user.nickname" />
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="user.email" />
          </el-form-item>
          <el-form-item label="个人网站" prop="blog">
            <el-input v-model="user.blog" />
          </el-form-item>
          <el-form-item label="头像">
            <div class="avatar-box">
              <img :src="user.avatar" alt="" @click="showChooseAvatar = !showChooseAvatar">
              <div v-if="showChooseAvatar" ref="topBox" class="avatar-list">
                <div>
                  <img v-for="item in avatarList" :key="item" class="avatar-item" :src="item" alt="" @click="chooseAvatar(item)">
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <textarea v-model="user.content" maxlength="1000" class="reply-content" placeholder="说点什么吧~~" />
      <div class="reply-bottom">
        <div class="avatar-box">
          <el-tooltip v-if="!showUser" :content="`亲爱的“${user.nickname}”,点击可以修改头像哦`">
            <img class="avatar-item" :src="user.avatar" alt="" @click="showAvatar = !showAvatar">
          </el-tooltip>
          <div v-if="showAvatar" ref="bottomBox" class="avatar-list">
            <div>
              <img v-for="item in avatarList" :key="item" class="avatar-item" :src="item" alt="" @click="chooseAvatar(item)">
            </div>
          </div>
          <el-tooltip v-if="!showUser" :content="`亲爱的“${user.nickname}”,点击可以个人信息哦`">
            <el-button type="text" @click="showUser = true">{{user.nickname}}</el-button>
          </el-tooltip>
        </div>
        <div>
          <el-button ref="cancel" type="text" @click="show = false">取消回复</el-button>
          <el-button type="primary" size="small" @click="handleOk">提交评论</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Reply',
    props: {
      selfUser: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        user: {
          nickname: '',
          avatar: '',
          email: '',
          blog: '',
          content: ''
        },
        rules: {
          nickname: [
            { required: true, message: '请输入昵称' },
            { max: 10, message: '昵称不能超过十个字符' }
          ],
          email: [
            { type: 'email', required: true, message: '请输入正确的电子邮箱' }
          ],
          blog: [
            { type: 'url', message: '请输入正确的网站地址, 加上http:// 哦' }
          ]
        },
        avatarList: [
        ],
        show: false,
        showUser: true,
        showAvatar: false,
        showChooseAvatar: false
      }
    },
    mounted () {
      this.$event.on('click', this.blurHide); // 注册失去焦点隐藏
      // 获取头像数据
      this.getImg();
      const user = localStorage.getItem('user')
      if (user) {
        try {
          this.user = JSON.parse(user);
          if (this.user.nickname && this.user.avatar && this.user.email) {
            this.showUser = false;
          }
        } catch (e) {
          console.error(e)
        }
      }
      // 如果父组件传入用户信息强制使用父级传入的
      if (this.selfUser) {
        this.user = this.selfUser;
        this.showUser = false;
      }
      if (!this.user.avatar) {
        this.user.avatar = require('../assets/head1.jpg');
      }
    },
    destroyed () {
      this.$event.remove('click', this.blurHide);
    },
    methods: {
      blurHide(event) {
        if (!this.$refs.box.contains(event.target)) {
          this.show = false;
        } else if (this.$refs.topBox && !this.$refs.topBox.contains(event.target)) {
          this.showChooseAvatar = false;
        } else if (this.$refs.bottomBox && !this.$refs.bottomBox.contains(event.target)) {
          this.showAvatar = false;
        }
      },
      getImg() {
        // 读取全局数据避免重复请求
        if (!this.$global.avatarList) {
          this.apiGet('/api/common/json', { params: { key: 'avatar' } }).then(res => {
            if (res.code === 200) {
              this.avatarList = res.data;
              this.$storeData('avatarList', res.data);
            }
          })
        } else {
          this.avatarList = this.$global.avatarList;
        }
      },
      chooseAvatar(item) {
        this.user.avatar = item;
        this.showAvatar = false;
        this.showChooseAvatar = false;
      },
      handleOk() {
        const check = [
          { key: 'nickname', message: '请输入昵称' },
          { key: 'email', message: '请输入邮箱' },
          { key: 'content', message: '请输入评论内容' }
        ]
        for (const item of check) {
          if (!this.user[item.key]) {
            this.$message.error(item.message);
            return;
          }
        }
        // 昵称不能包含博主
        if (this.user.nickname.includes('博主')) {
          this.$message.error('不能冒充博主。 PS: 手动滑稽');
          return;
        }
        // 把用户信息写入 local
        localStorage.setItem('user', JSON.stringify({
          nickname: this.user.nickname,
          email: this.user.email,
          avatar: this.user.avatar,
          blog: this.user.blog
        }));
        this.$emit('reply', JSON.parse(JSON.stringify(this.user)));
        this.user.content = '';
        this.showUser = false;
        this.show = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/var";
  .reply {
    display: inline-block;
    position: relative;
    .avatar-item {
      width: 55px;
      height: 55px;
      box-shadow: @box-shadow;
      border-radius: 5px;
      cursor: pointer;
    }
    .reply-box {
      width: 630px;
      position: absolute;
      right: -0.5em;
      top: 3em;
      z-index: 1000;
      padding: 20px;
      border-radius: 5px;
      border: 1px solid rgba(200, 200, 200, 0.5);
      box-shadow: @box-shadow;
      background-color: rgba(255,255,255, 0.2);
      backdrop-filter: blur(3px);
      &::before {
        content: '';
        display: block;
        width: 18px;
        height: 18px;
        border-top: 1px solid rgba(200, 200, 200, 0.8);
        border-left: 1px solid rgba(200, 200, 200, 0.8);
        transform: rotate(45deg);
        position: absolute;
        top: -10px;
        right: 0.8em;
      }
    }
    .avatar-box {
      /*width: 55px;*/
      height: 55px;
      position: relative;
      >img {
        width: 55px;
        height: 55px;
        box-shadow: @box-shadow;
        border-radius: 5px;
        cursor: pointer;
        vertical-align: middle;
        margin-right: 2em;
      }
      .avatar-list {
        position: absolute;
        bottom: 68px;
        left: 0;
        padding: 5px;
        background-color: rgba(255,255,255,0.7);
        backdrop-filter: blur(3px);
        box-shadow: @box-shadow;
        >div {
          width: 410px;
          max-height: 270px;
          line-height: 0;
          overflow: auto;
          >img {
            margin: 5px;
          }
        }
        &::after {
          content: '';
          display: block;
          position: absolute;
          bottom: -10px;
          left: 20px;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgba(255,255,255,0.9);
          box-shadow: @box-shadow;
        }
      }
    }
    .reply-content {
      width: 100%;
      height: 100px;
      background-color: #2D4654;
      color: #F0F2F7;
      border-radius: 5px;
      resize: vertical;
      padding: 15px;
      outline: none;
      overflow: auto;
    }
    .reply-bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
    }
  }
</style>
