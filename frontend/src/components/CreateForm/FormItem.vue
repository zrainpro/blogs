<template>
  <!-- 输入框类型 -->
  <el-input v-if="item.type === 'input'"
            v-model="form[item.key]"
            size="small"
            :disabled="item.disabled"
            :type="item.inputType || 'text'"
            :placeholder="item.placeholder"
  />
  <!-- 下拉框类型 -->
  <el-select v-else-if="item.type === 'select'"
             v-model="form[item.key]"
             size="small"
             :multiple="item.multiple"
             :clearable="item.clearable || false"
             :multiple-limit="item.limit"
             :placeholder="item.placeholder"
             :filterable="item.filterable"
  >
    <el-option v-for="it in item.options" :key="it.value" :label="it.label" :value="it.value" />
  </el-select>
  <!-- 级联选择 -->
  <el-cascader v-else-if="item.type === 'cascader'"
               v-model="form[item.key]"
               size="small"
               :options="item.options"
               :placeholder="item.placeholder"
               :clearable="item.clearable"
               :filterable="item.filterable"
               :props="{ checkStrictly: true }"
  />
  <!-- 自动搜索 -->
  <el-autocomplete
    v-else-if="item.type === 'searchSelect'"
    v-model="autoComplete"
    size="small"
    :value-key="displayAutoCompleteKey"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    @select="form[item.key] = $event.value"
    @change="!$event.value && (form[item.key] = '')"
  >
<!--    <template #default="{ item: it }">-->
<!--      <span>{{ it.label }}</span>-->
<!--    </template>-->
  </el-autocomplete>
</template>

<script>
  export default {
    name: 'FormItem',
    props: {
      item: {
        type: Object,
        default() { return {} }
      },
      form: {
        type: Object,
        default() { return {} }
      },
      displayAutoCompleteKey: {
        type: String,
        default: 'label'
      }
    },
    data() {
      return {
        autoComplete: ''
      }
    },
    watch: {
      autoComplete() {
        console.log(this.autoComplete);
      }
    },
    methods: {
      querySearch(queryString, cb) {
        this.item.callback && this.item.callback(queryString, cb)
      },
      reset() {
        this.autoComplete = '';
      }
    }
  }
</script>

<style scoped>

</style>
