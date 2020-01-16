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
        <span><icon use="icondianzan1" />{{info.like || 0}}</span>
        <span><icon use="iconfandui" />{{info.dislike || 0}}</span>
      </div>
      <div>
        <el-button type="text">展开评论</el-button>
      </div>
    </div>
    <!--  评论  -->
    <div class="comment">
      <CommentItem v-for="item in comment"
                   :key="item._id"
                   :detail="item"
                   @like="handleLikeComment"
                   @dislike="handleDislikeComment"
      >
        <div class="comment-children">
          <CommentItem v-for="it in item.children"
                       :key="it._id"
                       :detail="it"
                       @like="handleLikeComment"
                       @dislike="handleDislikeComment"
          />
        </div>
      </CommentItem>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import CommentItem from '../components/CommentItem';
  export default {
    name: 'Article',
    components: {
      CommentItem
    },
    data() {
      return {
        moment,
        info: {},
        comment: [],
        visitor: {
          nickname: '',
          email: '',
          blog: '',
          avatar: ''
        }
      }
    },
    mounted () {
      this.getArticle()
    },
    methods: {
      // 获取文章相关信息
      getArticle() {
        this.$global.loading = true; // 开启加载动画
        this.$emitComponentMethod('changeTheme', 'http://static.runoob.com/images/demo/demo2.jpg');
        // 获取文章信息
        this.apiGet(`/api/article/${this.$route.params.id}/detail`).then(res => {
          if (res.code === 200) {
            this.info = res.data;
          }
        });
        // 获取评论信息
        this.apiGet(`/api/comment/${this.$route.params.id}/list`).then(res => {
          if (res.code === 200) {
            this.comment = res.data;
          }
        })
        // 获取访客信息
        this.visitor = JSON.parse(localStorage.getItem('visitorInfo') || '{}');
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
        this.apiPost(`/api/article/${detail._id}/like`).then(res => {
          if (res.code === 200) {
            detail.like += 1
          }
        })
      },
      // 点踩评论
      handleDislikeArticle(detail) {
        this.apiPost(`/api/article/${detail._id}/dislike`).then(res => {
          if (res.code === 200) {
            detail.dislike += 1
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
      align-items: center;
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
      .comment-item {
        +.comment-item {
          margin-top: 20px;
        }
        .comment-detail {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
        }
        .comment-children {
          margin-top: 10px;
          padding: 15px;
          margin-left: 70px;
          background-color: rgba(0,0,0,0.04);
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
          span {
            cursor: pointer;
            svg {
              margin-right: 4px;
            }
            +span {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
</style>
