<template>
  <div class="reply">
    <el-button type="text" @click="show = !show" @blur="show = false">回复</el-button>
    <div v-show="show" class="replay-box">
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
              <div v-if="showChooseAvatar" class="avatar-list">
                <div>
                  <img v-for="item in avatarList" :key="item" class="avatar-item" :src="item" alt="" @click="chooseAvatar(item)">
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <textarea v-model="user.content" maxlength="1000" class="reply-content" />
      <div class="reply-bottom">
        <div class="avatar-box">
          <el-tooltip :content="`亲爱的“${user.nickname}”,点击可以修改头像哦`">
            <img class="avatar-item" :src="user.avatar" alt="" @click="showAvatar = !showAvatar">
          </el-tooltip>
          <div v-if="showAvatar" class="avatar-list">
            <div>
              <img v-for="item in avatarList" :key="item" class="avatar-item" :src="item" alt="" @click="chooseAvatar(item)">
            </div>
          </div>
        </div>
        <div>
          <el-button type="text" @click="show = false">取消回复</el-button>
          <el-button type="primary" size="small" @click="handleOk">提交评论</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Reply',
    data() {
      return {
        user: {
          nickname: '',
          avatar: '',
          email: '',
          blog: ''
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
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head1.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head2.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head3.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head4.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head5.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head6.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head7.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head8.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head9.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head10.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head11.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head12.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head13.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head14.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head15.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head16.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head17.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head18.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head19.jpg',
          'https://yuyublog.oss-cn-shanghai.aliyuncs.com/head/head20.jpg'
        ],
        show: false,
        showUser: true,
        showAvatar: false,
        showChooseAvatar: false
      }
    },
    mounted () {
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
      // todo 从接口获取头像列表
      if (!this.user.avatar) {
        this.user.avatar = this.avatarList[0];
      }
    },
    methods: {
      chooseAvatar(item) {
        this.user.avatar = item;
        this.showAvatar = false;
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
        // 把用户信息写入 local
        localStorage.setItem('user', JSON.stringify({
          nickname: this.user.nickname,
          email: this.user.email,
          avatar: this.user.avatar,
          blog: this.user.blog
        }));
        this.$emit('reply', this.user);
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
    .replay-box {
      width: 630px;
      position: absolute;
      right: 0;
      top: 3em;
      z-index: 1000;
      padding: 20px;
      border-radius: 5px;
      box-shadow: @box-shadow;
      background-color: rgba(255,255,255, 0.2);
      backdrop-filter: blur(3px);
      &::before {
        content: '';
        display: block;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid rgba(255,255,255,0.2);
        position: absolute;
        top: -10px;
        right: 0.5em;
      }
    }
    .avatar-box {
      width: 55px;
      height: 55px;
      position: relative;
      >img {
        width: 100%;
        height: 100%;
        box-shadow: @box-shadow;
        border-radius: 5px;
        cursor: pointer;
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
          border-top: 10px solid rgba(255,255,255,0.4);
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
