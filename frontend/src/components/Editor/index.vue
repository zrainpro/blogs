<template>
  <div>
    <div ref="editor" contenteditable="true" class="editor" />
    <MonacoEditor />
  </div>
</template>

<script>
  import MonacoEditor from './monaco';

  export default {
    name: 'editor',
    components: { MonacoEditor },
    data() {
      return {
        form: '',
        hotKeys: [
          { text: '######', tagName: 'h6', desc: 'H6' },
          { text: '#####', tagName: 'h5', desc: 'H6' },
          { text: '####', tagName: 'h4', desc: 'H6' },
          { text: '###', tagName: 'h3', desc: 'H6' },
          { text: '##', tagName: 'h2', desc: 'H6' },
          { text: '#', tagName: 'h1', desc: 'H6' },
          { text: '>', tagName: 'blockquote', createTag: true, desc: 'H6' }
        ],
        lineTagName: 'p' // 行元素的标签名
      }
    },
    mounted () {
      this.initEditor();
    },
    methods: {
      initEditor() {
        this.$refs.editor.appendChild(this.createLineElement()); // 写入初始代码
        // 更改默认换行标签, 统一不同浏览器的行为
        document.execCommand('defaultParagraphSeparator', false, this.lineTagName);
        /**
         * MutationObserver 的 options 说明
         * attributeFilter 要监视的特定属性名称的数组, 如果未包含此属性, 则对所有属性的更改都会触发变动通知, 无默认值
         * attributeOldValue 当见识节点的属性改动时,将此属性设为 true 将记录任何有改动的属性的上一个值
         * attributes 设为 true 以观察收监视元素的属性值变更, 默认值为 false
         * characterData 设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据变化,无默认值.
         * characterDataOldValue 设为 true 以在文本在受监视节点发生更改时记录节点文本的先前值
         * childList 设为 true 以监视目标节点添加或者删除新的子节点, 默认值为 false
         * subtree 设为 true 以监视范围扩展至目标节点整个节点树中的所有节点, MutationObserverInit 的其他值也会
         *         作用于此子树下的所有节点, 而不仅仅只作用于目标节点, 默认为 false
         */
        const config = { childList: true, subtree: true, characterData: true };
        // const configText = { characterData: true };
        const observer = new MutationObserver((mutationList) => {
          // observer.takeRecords();
          // console.log(mutationList);
          // 控制里面字符不能为空
          if (!this.$refs.editor.innerHTML || this.$refs.editor.innerHTML.replace(' ', '') === '<br>') {
            this.$refs.editor.appendChild(this.createLineElement()); // 插入初始代码
            return;
          }
          for (let mutation of mutationList) {
            if (mutation.type === 'characterData') {
              //  && mutation.target.parentElement?.tagName === this.lineTagName.toUpperCase()
              if (mutation.target.textContent.length < 8) {
                const codes = this.hotKeys.find(_ => new RegExp(`^${_.text}\\s`).test(mutation.target.textContent));
                if (codes) {
                  // 确定触发的标签没有被删除
                  if (Array.prototype.find.call(this.$refs.editor.childNodes, _ => _ === mutation.target.parentElement)) {
                    // 写入新标签
                    this.$refs.editor.insertBefore(this.createLineElement(codes.tagName, codes.createTag ? this.createLineElement() : false), mutation.target.parentElement);
                    // 移除原标签
                    this.$refs.editor.removeChild(mutation.target.parentElement);
                  }
                }
              }
            }
          }
        });
        observer.observe(this.$refs.editor, config)
      },
      createLineElement(tagName = this.lineTagName, childrenElement) {
        const element = document.createElement(tagName);
        element.appendChild(childrenElement || document.createElement('br'));
        return element;
      }
    }
  }
</script>

<style lang="less" scoped>
.common-title () {
  margin-top: 0;
  margin-bottom: 0;
  white-space: normal;
  word-spacing: 1px;
  color: #262626;
  font-weight: bold;
  padding: 0;
}
.editor {
  text-align: left;
  height: 300px;
  color: #262626;
  line-height: 1.74;
  outline-style: none;
  word-break: break-word;
  letter-spacing: 0.05em;
  background-color: #ffffff;
  /deep/ * {
    transition: all 0ms !important;
  }
  /deep/ h1 {
    .common-title;
    font-size: 28px;
    line-height: 36px;
    padding: 7px 0;
  }
  /deep/ h2 {
    .common-title;
    font-size: 24px;
    line-height: 32px;
    padding: 7px 0;
  }
  /deep/ h3 {
    .common-title;
    font-size: 20px;
    line-height: 28px;
    padding: 7px 0;
  }
  /deep/ h4 {
    .common-title;
    font-size: 16px;
    line-height: 24px;
    padding: 7px 0;
  }
  /deep/ h5 {
    .common-title;
    font-size: 14px;
    line-height: 24px;
    padding: 7px 0;
  }
  /deep/ h6 {
    .common-title;
    font-size: 14px;
    line-height: 24px;
    padding: 7px 0;
    font-weight: normal;
  }
  /deep/ p {
    white-space: normal;
    margin: 0;
  }
  /deep/ div {
    white-space: normal;
    margin: 0;
  }
  /deep/ blockquote {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 1em;
    margin-left: 0;
    border-left: 3px solid #eee;
    color: #8C8C8C;
  }
}
</style>
