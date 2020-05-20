<template>
  <div class="head">
    <h1 class="manage-title">评论头像管理</h1>
    <div>
      <el-popover
        placement="top-start"
        width="300"
        trigger="click"
      >
        <slot name="content">
          <div class="add">
            <el-input v-model="tempUrl" size="small" placeholder="请输入图片地址" />
            <el-button size="small" plain type="success" @click="add">确定</el-button>
          </div>
        </slot>
        <el-button slot="reference" size="small" plain>添加</el-button>
      </el-popover>
      <el-button size="small" plain type="success" style="margin-left: 10px" @click="save">保存</el-button>
    </div>
    <div class="head-box">
      <div v-for="(item, index) in list" :key="item" class="head-box-item">
        <img :src="item" alt="">
        <div class="delete" @click="deleteItem(index)"><icon class="hover-red" use="iconicon_trashcan" /></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'head',
    data() {
      return {
        list: [],
        tempUrl: ''
      }
    },
    mounted () {
      this.getData();
    },
    methods: {
      getData() {
        this.apiGet('/api/common/json', { params: { key: 'avatar' } }).then(res => {
          if (res.code === 200) {
            this.list = res.data;
          }
        })
      },
      add() {
        if (!this.tempUrl) {
          this.$message.error('请输入图片地址');
        } else {
          this.list.push(this.tempUrl);
          this.tempUrl = '';
        }
      },
      deleteItem(index) {
        this.list.splice(index, 1);
      },
      save() {
        this.apiPost('/api/common/json', { key: 'avatar', value: this.list }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功!');
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.head {
  text-align: left;
  padding: 20px;
  .head-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 600px;
    border: 1px solid #e8e8e8;
    margin-top: 20px;
  }
  .head-box-item {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    margin: 10px;
    >img {
      width: 100%;
      height: 100%;
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
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    svg {
      fill: #fffdef;
    }
  }
}
.add {
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: 15px;
  }
}
</style>
