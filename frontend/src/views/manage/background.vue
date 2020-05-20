<template>
  <div class="background">
    <h1 class="manage-title">背景图管理</h1>
    <div style="margin-bottom: 20px">
      <el-popover
        placement="top-start"
        width="300"
        trigger="click"
      >
        <slot name="content">
          <div class="add">
            <el-input v-model="tempUrl" size="small" placeholder="请输入图片地址" />
            <el-button size="small" plain type="success" @click="addItem">确定</el-button>
          </div>
        </slot>
        <el-button slot="reference" size="small" plain>添加</el-button>
      </el-popover>
      <el-button v-if="false" type="success" plain size="small" @click="save">保存</el-button>
    </div>
    <div class="tip">建议图片地址不设置协议,自动匹配 http 与 https</div>
    <div class="head-box">
      <div v-for="(item, index) in list" :key="item" class="head-box-item">
        <img :src="item" alt="">
        <div class="delete">
          <icon use="iconyanjing" class="hover-blue" @click.native="(show = true) && (url = item)" />
          <icon use="iconicon_trashcan" class="hover-red" @click.native="deleteItem(index)" />
        </div>
      </div>
    </div>
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
        url: '',
        tempUrl: ''
      }
    },
    mounted () {
      this.getData();
    },
    methods: {
      // 删除图片
      deleteItem(index) {
        this.$confirm('删除操作不可回退,确认删除吗').then(() => {
          this.list.splice(index, 1);
          this.save('删除成功');
        })
      },
      // 添加图片
      addItem() {
        if (!this.tempUrl) {
          this.message.info('图片地址不能为空哦');
          return;
        }
        this.list.push(this.tempUrl);
        this.tempUrl = '';
        this.save('添加成功!');
      },
      getData() {
        this.apiGet('/api/common/json', { params: { key: 'background' } }).then(res => {
          if (res.code === 200) {
            this.list = res.data;
          }
        })
      },
      save(msg) {
        this.apiPost('/api/common/json', { key: 'background', value: this.list.filter(_ => !!_) }).then(res => {
          if (res.code === 200) {
            this.$message.success(msg || '保存成功!');
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
  .head-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    border: 1px solid #e8e8e8;
    margin-top: 20px;
  }
  .head-box-item {
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    margin: 10px;
    >img {
      height: 120px;
    }
  }
  .delete {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.2);
    font-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    opacity: 0;
    &:hover {
      opacity: 1;
    }
    svg {
      font-size: 32px;
      fill: #fffdef;
      cursor: pointer;
      &:hover {
        fill: #1E8449;
      }
    }
  }
  /deep/ .el-input {
    width: 300px;
  }
}
</style>
