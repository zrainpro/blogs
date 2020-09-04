<template>
  <div class="article">
    <h1 class="manage-title">文章管理</h1>
    <!--  条件搜索  -->
    <div class="search">
      <CreateForm label-width="80px" :data-source="searchForm" @onOk="handleOk">
        <template slot="btn">
          <el-button size="small" @click="$router.push('/manage/article/create')">写文章</el-button>
        </template>
      </CreateForm>
    </div>
    <!-- 文章列表 -->
    <el-table :data="lists">
      <el-table-column label="标题" prop="title">
        <template slot-scope="scope">
          <router-link :to="`/manage/article/${scope.row._id}`">{{scope.row.title}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="categoryName" width="80" />
      <el-table-column label="标签" prop="tag" width="140">
        <template slot-scope="scope">
          <div class="tag-box">
            <span v-for="item in (scope.row.tag || '').split(',').filter(_ => _)" :key="item" class="tag">{{item}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否禁用" prop="disabled" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.disabled"
                     :active-value="0"
                     :inactive-value="1"
                     active-text="启用"
                     inactive-text="禁用"
                     @change="disabledArticle(scope.row._id, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column label="浏览量" prop="view" width="100" />
      <el-table-column label="点赞数" prop="like" width="100" />
      <el-table-column label="点踩数" prop="dislike" width="100" />
      <el-table-column label="更新时间" prop="updateTime" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="red" @click="deleteItem(scope.row)">删除</el-button>
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
import CreateForm from '../../components/CreateForm';
import moment from 'moment';
import { parseData } from '../../utils/function';
export default {
  name: 'manageArticle',
  components: { CreateForm },
  data() {
    return {
      lists: [],
      page: { page: 1, limit: 10, total: 0, disabled: 0 },
      searchForm: {
        main: [
          { type: 'input', key: 'keyword', label: '关键字' },
          {
            type: 'select',
            key: 'disabled',
            label: '状态',
            default: 0,
            options: [
              { value: 0, label: '启用' },
              { value: 1, label: '禁用' },
              { value: 2, label: '所有' }
            ]
}
        ],
        more: [
          { type: 'cascader', key: 'category', label: '分类', options: [] },
          { type: 'input', key: 'tag', label: '标签', placeholder: '逗号分隔标签' }
        ]
      }
    }
  },
  mounted () {
    // 获取分类数据
    this.apiGet('/api/category/list/all').then(res => {
      if (res.code === 200) {
        this.searchForm.more[0].options = parseData(res.data, { label: 'name', value: '_id' });
        this.searchForm = { ...this.searchForm };
      }
    });
    // 获取文章数据
    this.getData();
  },
  methods: {
    // 获取文章数据
    getData() {
      this.apiPost('/api/article/list/all', this.page).then(res => {
        if (res.code === 200) {
          this.lists = res.data.map(item => ({
            ...item,
            categoryName: item.category?.name,
            updateTime: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
            createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
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
    // 点击搜索
    handleOk(info) {
      this.page = {
        ...this.page,
        ...info,
        category: info.category && info.category[info.category.length - 1]
      };
      this.getData();
    },
    // 禁用/启用 文章
    disabledArticle(id, val) {
      this.apiPost(`/api/article/${id}/disabled`, { disabled: val }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功!');
        }
      })
    },
    // 删除文章
    deleteItem(item) {
      this.$confirm('您确定删除嘛? 该操作不可恢复').then(res => {
        console.log(res, item)
        this.apiPost(`/api/article/${item._id}/delete`).then(() => {
          this.getData(); // 重新获取数据
          this.$message.success('删除成功!')
        })
      }).catch(() => this.$message.error('删除失败, 请稍后再试!'));
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  text-align: left;
  padding: 15px;
  .tag-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .tag {
      margin: 2px;
    }
  }
  .pagination {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
