<template>
  <div class="comment-item">
    <div class="comment-detail">
      <div class="comment-head"><img :src="detail.avatar || require('../assets/defaultHead.jpg')" alt=""></div>
      <div class="comment-content">
        <!-- 名字, 有写博客直接链接到博客 -->
        <div class="comment-nickname">
          <div>
            <a v-if="detail.blog" target="_blank" :href="detail.blog">{{detail.nickname}}</a>
            <span v-else>{{detail.nickname}}</span>
            <span v-if="detail.pidInfo">
              <span style="margin: 0 10px">回复</span>
              <a v-if="detail.pidInfo.blog" target="_blank" :href="detail.pidInfo.blog">{{detail.pidInfo.nickname}}</a>
              <span v-else>{{detail.pidInfo.nickname}}</span>
            </span>
          </div>
          <span>{{moment(detail.updateTime).format('YYYY-MM-DD HH:mm')}}</span>
        </div>
        <div class="comment-text">{{detail.content}}</div>
        <!-- 点赞回复等 -->
        <div class="comment-mark">
          <span @click="handleLike"><icon use="icondianzan1" />{{detail.like || 0}}</span>
          <span @click="handleDislike"><icon use="iconfandui" />{{detail.dislike || 0}}</span>
          <Reply @reply="handleReply" />
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
  import moment from 'moment';
  import Reply from './Reply';
  export default {
    name: 'CommentItem',
    components: { Reply },
    props: {
      detail: {
        type: Object,
        default() { return {} }
      }
    },
    data() {
      return {
        moment
      }
    },
    methods: {
      handleLike() {
        this.$emit('like', this.detail)
        // if (!(localStorage.getItem('likeComment') || '').includes(this.detail._id)) {
        //   localStorage.setItem('likeComment', `${localStorage.getItem('likeComment') || ''}_${this.detail._id}`)
        // }
      },
      handleDislike() {
        this.$emit('dislike', this.detail)
        // if (!(localStorage.getItem('dislikeComment') || '').includes(this.detail._id)) {
        //   localStorage.setItem('dislikeComment', `${localStorage.getItem('dislikeComment') || ''}_${this.detail._id}`)
        // }
      },
      handleReply(item) {
        this.$emit('reply', item)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url(../style/var);
  .comment-item {
    .comment-detail {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .comment-head {
      width: 55px;
      height: 55px;
      border-radius: 5px;
      overflow: hidden;
      margin-right: 20px;
      box-shadow: @head-box-shadow;
      >img {
        width: 100%;
        height: 100%;
      }
    }
    .comment-content {
      flex: 1;
      .comment-nickname {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #dddddd;
        >*:nth-child(1) {
          border-bottom: 1px solid @link;
          padding-bottom: 5px;
        }
      }
      .comment-text {
        margin-top: 4px;
        font-size: 14px;
        color: #666666;
      }
    }
    .comment-mark {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      span {
        cursor: pointer;
        svg {
          margin-right: 4px;
        }
        +* {
          margin-left: 10px;
        }
      }
    }
  }
</style>
