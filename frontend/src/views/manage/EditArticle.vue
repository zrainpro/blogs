<template>
  <div class="edit-article">
    <div class="edit-article-operation">
      <div class="edit-article-tag">
        <CreateForm ref="form"
                    label-width="50px"
                    :show-ok="false"
                    :show-reset="false"
                    :data-source="searchForm"
        />
        <span class="edit-article-info">保存于 {{saveTime}}</span>
      </div>
      <div>
        <el-button type="success" plain size="small" @click="handleSave">暂存</el-button>
        <el-button type="primary" plain size="small" @click="handlePublish">发布</el-button>
      </div>
    </div>
    <el-input v-model="title" size="big" placeholder="无标题" class="edit-article-title" />
    <Editor ref="editor" class="editor" />
  </div>
</template>

<script>
  import Editor from '../../components/Editor';
  import CreateForm from '../../components/CreateForm';
  import moment from 'moment';
  import { parseData } from '../../utils/function'
  export default {
    name: 'EditArticle',
    components: { Editor, CreateForm },
    data() {
      return {
        id: '',
        title: '',
        saveTime: moment().format('HH:mm:ss'),
        searchForm: {
          main: [
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
          this.options = parseData(res.data, { label: 'name', value: '_id' });
          this.searchForm.main[0].options = this.options;
          this.searchForm = { ...this.searchForm };
        }
        if (this.$route.params.id) {
          this.id = this.$route.params.id;
          // 获取文章数据
          this.apiGet(`/api/article/${this.id}/back/detail`).then(result => {
            if (result.code === 200) {
              this.title = result.data?.title; // 标题
              this.$refs.editor.setValue(result.data?.preserve); // 设置正文数据
              this.searchForm.main[0].default = this.parseCategory(result.data.category, this.options);
              this.searchForm.main[1].default = result.data.tag;
              this.$refs.form.setDefault(); // 设置默认值
            }
          })
        }
      });
    },
    methods: {
      parseCategory(id = '', source = []) {
        const result = [];
        for (const it of source) {
          if (it.value === id) {
            result.push(it.value);
            break;
          } else if (it.children) {
            const temp = this.parseCategory(id, it.children);
            if (temp && temp.length) {
              result.push(it.value);
              result.push(...temp);
            }
          }
        }
        return result;
      },
      // 获取数据
      async getData() {
        const form = await this.$refs.form.getData();
        if (!form.category || !form.category.length) {
          this.$message.error('请选择分类');
          return;
        }
        return {
          category: form.category[form.category.length - 1],
          tag: form.tag,
          preserve: this.$refs.editor.getValue(),
          title: this.title || '无标题',
          id: this.id
        }
      },
      // 点击暂存
      async handleSave() {
        const params = await this.getData();
        if (!params) return
        this.apiPost('/api/article/preserve', params).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功');
            this.id = res.data._id; // 记录ID
          }
        })
      },
      // 点击发布
      async handlePublish() {
        const params = await this.getData();
        if (!params) return
        this.apiPost('/api/article/patch', { ...params, content: params.preserve }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.edit-article {
  padding: 20px;
  .edit-article-operation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    .edit-article-tag {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .edit-article-info {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  .edit-article-title {
    font-size: 36px;
    padding-left: 25px;
    margin: 20px 0;
    /deep/ * {
      border: none;
      color: #000000;
      font-weight: 600;
    }
  }
  .editor {
    max-width: 920px;
  }
}
</style>
