<template>
  <div class="home">
    <div v-if="list.length" class="content">
      <div v-for="item in list" :key="item._id" class="article">
        <div class="img" @click="linkTo(`/article/${item._id}`)"><img :src="item.topicImg || require('../assets/category.jpg')" alt=""></div>
        <div class="info">
          <div class="title" @click="linkTo(`/article/${item._id}`)">{{item.title}} <span>{{moment(item.createTime).format('MM月DD日·YYYY年')}}</span></div>
          <div class="intro" @click="linkTo(`/article/${item._id}`)">{{item.intro}}</div>
          <div class="category">
            <div><div class="tag" v-for="tag in (item.tag || '').split(',')" :key="tag">{{tag}}</div></div>
            <div>
              <span class="mark"><icon use="iconyuedu" /> {{item.view || 1}}</span>
              <span class="mark"><icon use="icondianzan1" /> {{item.like || 0}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import Empty from '../components/Empty';
import moment from 'moment';

export default {
  name: 'home',
  components: { Empty },
  data() {
    return {
      moment,
      list: []
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.getList()
      }
    }
  },
  methods: {
    // 获取文章
    getList() {
      this.$global.loading = true; // 开启加载动画
      this.$emitComponentMethod('changeTheme')
      this.$parseRouter().then(menu => {
        const params = {};
        menu && (params.category = menu.id);
        this.apiGet('/api/article/list', { params }).then(res => {
          this.list = res.data
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
  .home {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
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
            color: #666666;
            cursor: pointer;
          }
          .category {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
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
    }
  }
</style>
