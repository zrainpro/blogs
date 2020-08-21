<template>
  <div class="category-home">
    <div v-if="list.length" class="content">
      <div v-for="item in list" :key="item._id" class="article">
        <div class="img" @click="linkTo(`/article/${item._id}`)"><img :src="item.topicImg || require('../assets/category.jpg')" alt=""></div>
        <div class="info">
          <div class="title" @click="linkTo(`/article/${item._id}`)">{{item.title}} <span>{{moment(item.createTime).format('MM月DD日·YYYY年')}}</span></div>
          <div class="intro" @click="linkTo(`/article/${item._id}`)" v-html="item.intro" />
          <div class="category">
            <div><div v-for="tag in (item.tag || '').split(',').filter(_ => _)" :key="tag" class="tag">{{tag}}</div></div>
            <div>
              <span class="mark"><icon use="iconyuedu" /> {{item.view || 1}}</span>
              <span class="mark"><icon use="icondianzan1" /> {{item.like || 0}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!loading && page.total <= page.page * page.limit" class="loadend">我是有底线的 ~0.0~ </div>
      <div v-loading="loading" class="loading" />
    </div>
    <Empty v-else />
  </div>
</template>

<script>
  import Empty from '../components/Empty';
  import moment from 'moment';

  export default {
    name: 'category',
    components: { Empty },
    data() {
      return {
        moment,
        list: [],
        page: { page: 1, limit: 5, total: 0 },
        loading: false
      }
    },
    watch: {
      $route: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            this.$global.loading = true; // 开启加载动画
            this.$safeEmitComponentMethod('changeTheme');
            this.getList();
          });
        }
      }
    },
    mounted () {
      window.addEventListener('scroll', this.scroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.scroll);
    },
    methods: {
      // 滚动重新获取数据
      scroll(event) {
        // 先节流
        if (!this.canScroll) {
          this.canScroll = true;
          window.requestAnimationFrame(() => {
            this.canScroll = false;
            // 防抖
            if (!this.loading && this.page.page * this.page.limit <= this.page.total) {
              const scrollHeight = document.documentElement.scrollHeight;
              const scrollTop = document.documentElement.scrollTop;
              const clientHeight = window.innerHeight;
              if (clientHeight + scrollTop >= scrollHeight - 50) {
                // 防抖
                this.loading = true;
                this.page.page++;
                this.getList().then(() => {
                  this.loading = false;
                });
              }
            }
          })
        }
      },
      // 获取文章
      getList() {
        return new Promise(resolve => {
          this.$parseRouter().then(menu => {
            const params = { ...this.page };
            menu && (params.category = menu.id);
            this.apiGet('/api/article/list', { params }).then(res => {
              this.list.splice((this.page.page - 1) * this.page.limit, this.page.limit, ...(res.data || []))
              this.page = {
                page: res.page,
                limit: this.page.limit,
                total: res.total
              }
              resolve();
            })
          })
        })
      },
      // 跳转
      linkTo(url) {
        this.$router.push(url)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('../style/var');
  .category-home {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    .content {
      width: @content-width;
      .article {
        background-color: @content-color;
        display: flex;
        flex-direction: row;
        height: 140px;
        box-shadow: @box-shadow;
        transition: all 0.2s;
        &:hover {
          box-shadow: @hover-box-shadow;
          transform: translateY(8px);
        }
        .img {
          width: 140px;
          height: 140px;
          cursor: pointer;
          >img {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          padding: 15px 15px;
          flex: 1;
          text-align: left;
          line-height: 18px;
          .title {
            font-size: 18px;
            cursor: pointer;
            &:hover {
              color: @link;
            }
            span {
              font-size: 14px;
              float: right;
            }
          }
          .intro {
            margin: 10px 0;
            padding-left: 10px;
            height: 50px;
            overflow: hidden;
            font-size: 14px;
            line-height: 1.5em;
            text-indent: 28px;
            color: #999999;
            cursor: pointer;
          }
          .category {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            >* {
              display: flex;
              flex-direction: row;
            }
            .mark {
              svg {
                font-size: 16px;
                margin-right: 4px;
              }
              +.mark {
                margin-left: 12px;
              }
            }
          }
        }
        +.article {
          margin-top: 20px;
        }
      }
      .loading {
        height: 40px;
        margin-top: 20px;
        /deep/ .el-loading-mask {
          background-color: rgba(255,255,255, 0.6);
        }
      }
      .loadend {
        height: 40px;
        line-height: 40px;
        margin-top: 20px;
        background-color: rgba(255,255,255,0.6);
        color: @link;
      }
    }
  }
</style>
