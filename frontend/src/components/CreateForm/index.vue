<template>
  <el-form ref="form"
           :model="form"
           :rules="rules"
           :label-width="labelWidth"
           :inline="inline"
  >
    <el-form-item v-for="(item, index) in dataSource.main"
                  :key="index"
                  :label="item.label"
                  :prop="item.key"
    >
      <FormItem ref="mainForm" :item="item" :form="form" />
    </el-form-item>
    <el-form-item>
      <el-button v-if="showOk" type="primary" plain size="small" @click="handleOk">{{okText}}</el-button>
      <el-button v-if="showReset" type="warning" plain size="small" @click="resetData">{{resetText}}</el-button>
      <slot name="btn" />
    </el-form-item>
    <div v-if="dataSource.more">
      <el-form-item v-for="(item, index) in (dataSource.more || [])"
                    :key="index"
                    :label="item.label"
                    :prop="item.key"
      >
        <FormItem ref="moreForm" :item="item" :form="form" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  import FormItem from './FormItem'
  export default {
    name: 'CreateForm',
    components: { FormItem },
    props: {
      dataSource: {
        type: Object,
        default: () => ({
          main: [],
          more: []
        })
      },
      labelWidth: {
        type: String,
        default: '100px'
      },
      rules: {
        type: Object,
        default() { return {} }
      },
      inline: {
        type: Boolean,
        default: true
      },
      showOk: {
        type: Boolean,
        default: true
      },
      showReset: {
        type: Boolean,
        default: true
      },
      okText: {
        type: String,
        default: '搜索'
      },
      resetText: {
        type: String,
        default: '重置'
      }
    },
    data() {
      return {
        form: {} // 表单数据
      }
    },
    mounted () {
      this.setDefault()
    },
    methods: {
      handleOk() {
        this.getData().then(res => {
          this.$emit('onOk', res);
        })
      },
      getData() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(valid => {
            if (valid) {
              resolve(JSON.parse(JSON.stringify(this.form)));
            } else {
              reject(new Error('请填写完整'))
            }
          })
        })
      },
      resetData() {
        // 重置表单
        this.$refs.form.resetFields();
        // 重置自动完成控件
        (this.$refs.mainForm || []).forEach(_ => _.reset());
        (this.$refs.moreForm || []).forEach(_ => _.reset());
        // 重新设置默认值
        this.setDefault();
      },
      // 设置默认值
      setDefault() {
        ([...(this.dataSource.main || []), ...(this.dataSource.more || [])]).forEach(item => {
          if (typeof item.default !== 'undefined') {
            this.$set(this.form, item.key, item.default);
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
