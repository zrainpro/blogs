<template>
  <div ref="editor" class="monaco-editor" />
</template>

<script>
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

  export default {
    name: 'monaco-editor',
    data() {
      return {
        form: ''
      }
    },
    mounted () {
      this.monacoInstance = monaco.editor.create(this.$refs.editor, {
        language: 'html',
        tabSize: 2,
        theme: 'vs-dark'
      })
      this.monacoInstance.onDidChangeModelContent((event) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.form = this.monacoInstance.getValue();
        }, 500);
      })
    },
    destroyed () {
      this.monacoInstance.dispose();
    }
  }
</script>

<style lang="less" scoped>
  .monaco-editor {
    text-align: left;
    height: 300px;
    /deep/ * {
      transition: all 0ms !important;
    }
  }
</style>
