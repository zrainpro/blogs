<template>
  <div class="background">
    <h1 class="manage-title">背景图管理</h1>
    <div style="margin-bottom: 20px">
      <el-button plain size="small" @click="list.push('')">添加</el-button>
      <el-button type="success" plain size="small" @click="save">保存</el-button>
    </div>
    <div class="tip">建议图片地址不设置协议,自动匹配 http 与 https</div>
    <el-form>
      <el-form-item v-for="(item, index) in list" :key="item">
        <div class="img-item">
          <div style="margin-right: 20px">{{index + 1}}.</div>
          <el-input v-model="list[index]" />
          <img @click="(show = true) && (url = item)" :src="item" alt="" class="img">
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="show"
      width="1200px"
    >
      <img :src="url" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'background',
    data() {
      return {
        list: [],
        show: false,
        url: ''
      }
    },
    mounted () {
      this.getData();
    },
    methods: {
      getData() {
        this.apiGet('/api/common/json', { params: { key: 'background' } }).then(res => {
          if (res.code === 200) {
            this.list = res.data;
          }
        })
      },
      save() {
        this.apiPost('/api/common/json', { key: 'background', value: this.list.filter(_ => !!_) }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功');
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.background {
  text-align: left;
  padding: 20px;
  .tip {
    color: #999999;
    font-size: 12px;
  }
  .img-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .img {
      height: 80px;
      margin-left: 40px;
      cursor: pointer;
    }
  }
  /deep/ .el-input {
    width: 300px;
  }
}
</style>
