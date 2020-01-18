<template>
  <div class="article">
    <h1 class="title">{{info.title}}</h1>
    <div class="intro">
      <span>{{moment(info.createTime).format('HH时mm分·MM月DD日·YYYY年')}}</span>
      <span>{{moment(info.updateTime).format('HH时mm分·MM月DD日·YYYY年')}}修改</span>
    </div>
    <div v-html="info.content"></div>
    <div class="article-tag">
      <span style="margin-right: 10px">文章标签: </span>
      <span v-for="item in (info.tag || '').split(',')" :key="item" class="tag">{{item}}</span>
    </div>
    <div class="mark">
      <div>
        <span><icon use="iconyuedu" />{{info.view || 1}}</span>
        <span @click="handleLikeArticle(info)"><icon use="icondianzan1" />{{info.like || 0}}</span>
        <span @click="handleDislikeArticle(info)"><icon use="iconfandui" />{{info.dislike || 0}}</span>
      </div>
      <div>
        <Reply @reply="replayArticle" />
      </div>
    </div>
    <!--  评论  -->
    <div class="comment">
      <CommentItem v-for="item in comment"
                   :key="item._id"
                   :detail="item"
                   @like="handleLikeComment"
                   @dislike="handleDislikeComment"
                   @reply="replayArticle($event, { pid: item._id, rootPid: item._id })"
      >
        <div class="comment-children" v-if="item.children && item.children.length">
          <CommentItem v-for="it in item.children"
                       :key="it._id"
                       :detail="it"
                       @like="handleLikeComment"
                       @dislike="handleDislikeComment"
                       @reply="replayArticle($event, { pid: it._id, rootPid: item._id })"
          />
        </div>
      </CommentItem>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import CommentItem from '../components/CommentItem';
  import Reply from '../components/Reply';
  export default {
    name: 'Article',
    components: {
      CommentItem,
      Reply
    },
    data() {
      return {
        moment,
        info: {},
        comment: []
      }
    },
    mounted () {
      this.getArticle()
    },
    methods: {
      // 获取文章相关信息
      getArticle() {
        this.$global.loading = true; // 开启加载动画
        // 获取文章信息
        this.apiGet(`/api/article/${this.$route.params.id}/detail`).then(res => {
          this.$safeEmitComponentMethod('changeTheme', this.info.topicImg);
          if (res.code === 200) {
            this.info = res.data;
          }
        });
        // 获取评论信息
        this.getComment();
      },
      // 获取评论信息
      getComment() {
        // 获取评论信息
        this.apiGet(`/api/comment/${this.$route.params.id}/list`).then(res => {
          if (res.code === 200) {
            this.comment = res.data;
          }
        })
      },
      // 点赞评论
      handleLikeComment(detail) {
        this.apiPost(`/api/comment/${detail._id}/like`).then(res => {
          if (res.code === 200) {
            detail.like += 1
          }
        })
      },
      // 点踩评论
      handleDislikeComment(detail) {
        this.apiPost(`/api/comment/${detail._id}/dislike`).then(res => {
          if (res.code === 200) {
            detail.dislike += 1
          }
        })
      },
      // 点赞文章
      handleLikeArticle(detail) {
        if (!(localStorage.getItem('likeArticle') || '').includes(detail._id)) {
          localStorage.setItem('likeArticle', `${localStorage.getItem('likeArticle') || ''}_${detail._id}`)
          this.apiPost(`/api/article/${detail._id}/like`).then(res => {
            if (res.code === 200) {
              detail.like += 1
            }
          })
        } else {
          this.$message.info('您已经点过赞了哦')
        }
      },
      // 点踩评论
      handleDislikeArticle(detail) {
        if (!(localStorage.getItem('dislikeArticle') || '').includes(detail._id)) {
          localStorage.setItem('dislikeArticle', `${localStorage.getItem('dislikeArticle') || ''}_${detail._id}`)
          this.apiPost(`/api/article/${detail._id}/dislike`).then(res => {
            if (res.code === 200) {
              detail.dislike += 1
            }
          })
        } else {
          this.$message.info('您已经点过踩了哦')
        }
      },
      // 评论文章
      replayArticle(item, otherInfo = {}) {
        this.apiPost('/api/comment/create', {
          article: this.$route.params.id,
          nickname: item.nickname,
          avatar: item.avatar,
          email: item.email,
          blog: item.blog,
          content: item.content,
          pid: otherInfo.pid,
          rootPid: otherInfo.rootPid
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('评论成功!');
            this.getComment();
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('../style/var');
  .article {
    width: @content-width;
    background-color: @content-color;
    padding: 30px;
    text-align: left;
    /* 标题 */
    .title {
      font-size: 24px;
      &::after {
        content: '';
        display: block;
        width: 120px;
        height: 2px;
        background-color: #42b983;
        margin: 30px 0;
      }
    }
    /* 标签 */
    .article-tag {
      margin-top: 30px;
    }
    /* 点赞相关 */
    .mark {
      margin-top: 30px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      span {
        font-size: 18px;
        cursor: pointer;
        svg {
          font-size: 18px;
          margin-right: 5px;
        }
        &:hover {
          color: @red;
          svg {
            fill: @red;
          }
        }
        +span {
          margin-left: 20px;
        }
      }
    }
    /* 评论 */
    .comment {
      margin-top: 40px;
      .comment-children {
        margin: 10px 0 10px 70px;
        padding: 15px;
        background-color: rgba(0,0,0,0.04);
      }
    }
  }
</style>
