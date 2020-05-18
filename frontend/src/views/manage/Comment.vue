<template>
  <div class="comment">
    <h1 class="manage-title">评论管理</h1>
    <!--  条件搜索  -->
    <div class="search">
      <CreateForm label-width="80px" :data-source="searchForm" @onOk="handleOk" />
    </div>
    <div class="operation">
      <el-button type="success" plain size="small" @click="enabled(true)">批量启用</el-button>
      <el-button type="warning" plain size="small" @click="enabled(false)">批量删除</el-button>
      <el-button type="danger" plain size="small" @click="deleteComment">彻底删除</el-button>
    </div>
    <!-- 评论列表 -->
    <el-table :data="lists" @selection-change="selection = $event">
      <el-table-column type="selection" width="30" />
      <el-table-column label="内容" prop="content" width="300" show-overflow-tooltip />
      <el-table-column label="所属文章" prop="article">
        <template slot-scope="{ row }">
          <a :href="`/article/${row.article._id}`" target="_blank">{{row.article.title}}</a>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="电子邮箱" prop="email" />
      <el-table-column label="博客地址" prop="disabled" width="150">
        <template slot-scope="scope">
          <a :href="scope.row.blog" target="_blank">{{scope.row.blog}}</a>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" prop="like" width="80" />
      <el-table-column label="点踩数" prop="dislike" width="80" />
      <el-table-column label="创建时间" prop="createTime" width="100" />
      <el-table-column label="操作" width="120">
        <template slot-scope="{ row }">
          <Reply :self-user="user" @reply="replay($event, row)"></Reply>
          <el-button
            type="text"
            :class="row.disabled === 0 ? 'red' : 'green'"
            @click="enabled(row.disabled === 0 ? 1 : 0, [row._id])"
          >
            {{row.disabled === 0 ? '删除' : '启用'}}
          </el-button>
          <el-button type="text" @click="deleteComment([row._id])">彻底删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="page.total > page.limit" class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import CreateForm from '../../components/CreateForm';
import Reply from '../../components/Reply';

export default {
  name: 'manageComment',
  components: { CreateForm, Reply },
  data() {
    return {
      lists: [],
      selection: [],
      page: { page: 1, limit: 10, total: 0 },
      searchForm: {
        main: [
          { type: 'input', key: 'keyword', label: '关键字' },
          { type: 'select',
            key: 'disabled',
            label: '状态',
            default: 0,
            options: [
              { value: 0, label: '正常' },
              { value: 1, label: '回收站' },
              { value: 2, label: '所有' }
            ] },
          { type: 'searchSelect', key: 'article', label: '所属文章', callback: this.getArticleData }
        ]
      },
      user: {}
    }
  },
  created () {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  },
  mounted () {
    // 获取评论信息
    this.getData();
  },
  methods: {
    // 获取文章信息
    getArticleData(text, cb) {
      this.apiPost('/api/article/list/all', { keyword: text }).then(res => {
        if (res.code === 200) {
          cb(res.data.map(item => ({
            value: item._id,
            label: item.title
          })))
        }
      })
    },
    // 获取评论信息
    getData() {
      this.apiPost('/api/comment/list', this.page).then(res => {
        if (res.code === 200) {
          this.lists = res.data.map(_ => ({
            ..._,
            createTime: moment(_.createTime).format('YYYY-MM-DD HH:mm:ss')
          }));
          this.page.total = res.total;
        }
      })
    },
    // 分页
    pageChange(current) {
      this.page.page = current;
      this.getData();
    },
    handleOk(info) {
      this.page = { ...this.page, ...info };
      this.getData();
    },
    // 批量启用 / 禁用
    enabled(type, id) {
      if (!this.selection.length && !id) {
        this.$message.warning('请先选择要操作的评论哦!');
      } else {
        this.$confirm('如该评论有回复则回复会一同被删除或者启用哦!').then(() => {
          this.apiPost('/api/comment/enabled', {
            comments: id || this.selection.map(_ => _._id),
            code: type ? 0 : 1
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              // 重新获取数据
              setTimeout(this.getData, 100);
            }
          });
        })
      }
    },
    // 彻底删除(清库)
    deleteComment(id) {
      this.$confirm(
        '确定彻底删除嘛!彻底删除之后无法恢复!\n如果该评论有回复,则相关的回复也会一并删除, 请谨慎操作!'
      ).then(() => {
        this.apiPost('/api/comment/delete', id || this.selection.map(_ => _._id)).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            setTimeout(this.getData, 100); // 重新获取数据
          }
        })
      })
    },
    // 回复评论
    replay(item, row) {
      // 获取管理员信息
      const admin = JSON.parse(sessionStorage.getItem('user'));
      this.apiPost('/api/comment/create', {
        article: row.article._id,
        nickname: admin.nickname + '（博主）',
        avatar: admin.avatar,
        email: admin.email,
        blog: location.origin,
        content: item.content,
        pid: row._id,
        rootPid: row.rootPid
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('评论成功!');
          this.getData();
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  text-align: left;
  padding: 15px;
  .operation {
    margin-bottom: 10px;
  }
  .pagination {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  /deep/ .el-table {
    overflow: visible;
  }
  /deep/ .el-table .cell {
    overflow: visible;
  }
  /deep/ .el-table__body-wrapper {
    overflow: visible;
  }
}
</style>
