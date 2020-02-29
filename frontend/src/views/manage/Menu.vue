<template>
  <div class="menu">
    <h1 class="title">菜单管理</h1>
    <div>
      <el-button type="primary" plain size="small" @click="addMenu()">追加</el-button>
      <el-button type="success" plain size="small" @click="save()">保存</el-button>
    </div>
    <div class="menu-box">
      <div v-for="(item, index) in menu" :key="index">
        <div class="menu-item">
          <Label name="菜单名"><el-input v-model="item.name" size="small" /></Label>
          <Label name="地址"><el-input v-model="item.address" size="small" /></Label>
          <el-button type="text" @click="addMenu(item)">添加子节点</el-button>
          <el-switch
            v-if="item._id"
            v-model="item.disabled"
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
            @change="changeStatus($event, item)"
          />
        </div>
        <div v-if="item.children" class="menu-children">
          <div v-for="(it, ind) in item.children" :key="ind" class="menu-item">
            <Label name="菜单名"><el-input v-model="it.name" size="small" /></Label>
            <Label name="地址"><el-input v-model="it.address" size="small" /></Label>
            <el-switch
              v-if="it._id"
              v-model="it.disabled"
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="禁用"
              @change="changeStatus($event, it)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Label from '../../components/Label';

export default {
  name: 'manageMenu',
  components: { Label },
  data() {
    return {
      menu: []
    }
  },
  mounted() {
    this.getMenuData();
  },
  methods: {
    getMenuData() {
      this.apiGet('/api/category/list/all').then(res => {
        if (res.code === 200) {
          this.menu = res.data;
        }
      })
    },
    // 添加菜单
    addMenu(item) {
      if (!item) {
        this.menu.push({
          name: '',
          address: '',
          disabled: 0
        })
      } else {
        !item.children && (item.children = []);
        item.children.push({
          name: '',
          address: '',
          disabled: 0
        });
        this.menu = JSON.parse(JSON.stringify(this.menu));
      }
    },
    // 保存
    save() {
      let error = false;
      this.menu.find(item => {
        if (!item.name || !item.address) {
          error = true;
          return true;
        } else {
          item.children && item.children.find(it => {
            if (!it.name || !it.address) {
              error = true;
              return true;
            }
          })
          return error;
        }
      });
      if (error) {
        this.$message.error('请填写完整在保存');
      } else {
        this.apiPost('/api/category/patch', {
          category: this.menu
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功');
            // 获取最新数据
            this.getMenuData();
          }
        })
      }
    },
    // 启用禁用
    changeStatus(val, item) {
      this.apiPost(`/api/category/${item._id}/status`, { disabled: val }).then(res => {
        if (res.code === 200) {
          this.$message.success(`${val ? '禁用' : '启用'}成功`)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url(../../style/var.less);
.menu {
  text-align: left;
  padding: 15px;
  h1.title {
    font-size: 18px;
    padding-left: 15px;
    border-left: 4px solid @link;
    margin-bottom: 20px;
  }
  .menu-box {
    margin-top: 20px;
    padding: 20px;
    background-color: #eaeaea;
  }
  .menu-item {
    display: flex;
    flex-direction: row;
    padding: 4px 10px;
    background-color: #76D7C4;
    border: 1px solid #E8F8F5;
    >* + * {
      margin-left: 20px;
    }
    .el-input {
      width: 200px;
    }
  }
  .menu-children {
    background-color: #F9E79F;
    padding-left: 40px;
  }
}
</style>
