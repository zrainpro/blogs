<template>
  <div class="edit-article">
    编辑器
    <Editor />
  </div>
</template>

<script>
  import Editor from '../../components/Editor';
  export default {
    name: 'EditArticle',
    components: { Editor }
  }
</script>

<style lang="less" scoped>
.edit-article {
  padding: 20px;
}
</style>
