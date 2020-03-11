<template>
  <div>
    <div ref="editor" contenteditable="true" class="editor" />
  </div>
</template>

<script>
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

  export default {
    name: 'editor',
    data() {
      return {
        form: '',
        hotKeys: [
          { text: '######\\s', tagName: 'h6', desc: 'H6' },
          { text: '#####\\s', tagName: 'h5', desc: 'H6' },
          { text: '####\\s', tagName: 'h4', desc: 'H6' },
          { text: '###\\s', tagName: 'h3', desc: 'H6' },
          { text: '##\\s', tagName: 'h2', desc: 'H6' },
          { text: '#\\s', tagName: 'h1', desc: 'H6' },
          { text: '>\\s', tagName: 'blockquote', createTag: true, desc: 'H6' }
        ],
        monaco: {}, // 保存 monaco editor 实例
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
        // todo 在 monaco-editor 中取消监听dom节点变化,节省性能;
        const config = { childList: true, subtree: true, characterData: true };
        const observer = new MutationObserver((mutationList) => {
          // observer.takeRecords();
          // 控制里面字符不能为空
          if (!this.$refs.editor.innerHTML || this.$refs.editor.innerHTML.replace(' ', '') === '<br>') {
            this.$refs.editor.appendChild(this.createLineElement()); // 插入初始代码
            return;
          }
          console.log(mutationList);
          for (let mutation of mutationList) {
            // 文本节点改动
            if (mutation.type === 'characterData') {
              // 超出最长快捷键长度退出
              //  && mutation.target.parentElement?.tagName === this.lineTagName.toUpperCase()
              if (mutation.target.textContent.length > 15) { continue; }
              // 便利快捷键,找出符合的快捷键
              const codes = this.hotKeys.find(_ => new RegExp(`^${_.text}`).test(mutation.target.textContent));
              if (!codes) { continue; }
              // 如果触发的元素被删除提前退出
              if (!Array.prototype.find.call(this.$refs.editor.childNodes, _ => _ === mutation.target.parentElement)) { continue; }
              // 写入标签
              this.$refs.editor.insertBefore(this.createLineElement(codes.tagName, codes.createTag ? this.createLineElement() : false), mutation.target.parentElement);
              this.$refs.editor.removeChild(mutation.target.parentElement); // 移除原标签
            } else if (mutation.type === 'childList') {
              // 判断变更节点是引用的节点,删除的时候退出 blockquote 标签并插入一行新的
              if (mutation.target.nodeName === 'BLOCKQUOTE' && Array.prototype.find.call(mutation.removedNodes, _ => _.nodeName.toLowerCase() === this.lineTagName)) {
                // 如果删除 b
                const tempInsert = this.createLineElement();
                window.insertAfter(mutation.target, tempInsert, this.$refs.editor);
                this.pointNextLine(); // 光标移动到下一行
                continue;
              }
              // 如果是编辑器根节点删除非 标准行标签, 插入标准行标签
              if (mutation.target === this.$refs.editor && Array.prototype.find.call(mutation.removedNodes, _ => _.nodeName.toLowerCase() !== this.lineTagName)) {
                window.insertAfter(mutation.previousSibling, this.createLineElement(), this.$refs.editor);
                this.pointNextLine(); // 光标移动到下一行
                continue;
              }
              // 监听编辑器回车事件
              if (mutation.target === this.$refs.editor && mutation.addedNodes.length) {
                // console.log('触发回车事件的元素为: ', mutation.previousSibling);
                // 判断是否为 添加编辑器事件
                if (new RegExp('```\\s{0}').test(mutation.previousSibling?.innerText)) {
                  this.detailMonaco(mutation); // 添加 monaco-editor 编辑器
                }
              }
            }
          }
        });
        observer.observe(this.$refs.editor, config);
      },
      // 处理 monaco-editor
      detailMonaco(mutation) {
        const id = window.btoa(new Date().getTime());
        const language = mutation.previousSibling.innerText.replace('```', '') || 'javascript';
        const box = document.createElement('div');
        box.setAttribute('id', id);
        box.setAttribute('class', 'code-editor');
        box.setAttribute('contenteditable', 'false');
        box.tabIndex = Object.keys(this.monaco).length; // 使 focus 事件生效
        const selectLanguage = document.createElement('div');
        selectLanguage.setAttribute('class', 'code-editor-language');
        const languages = monaco.languages.getLanguages();
        const selectItem = this.createSelect(languages.map(_ => ({ label: _.id, value: _.id })), language); // 创建 select 选择器
        selectItem.oninput = (target) => {
          monaco.editor.setModelLanguage(this.monaco[id].getModel(), target.value); // 更改语言
        }
        selectLanguage.appendChild(selectItem);
        box.appendChild(selectLanguage);
        // monaco 编辑器
        const monacoBox = document.createElement('div');
        monacoBox.setAttribute('style', 'height: 200px; min-height: 30px;');
        box.appendChild(monacoBox);
        // 拖拽
        const drag = document.createElement('div');
        drag.setAttribute('draggable', 'true');
        drag.setAttribute('class', 'editor-resize');
        drag.ondragstart = (event) => {
          drag.y = event.pageY;
          monacoBox.height = monacoBox.offsetHeight;
        }
        drag.ondrag = (event) => {
          event.preventDefault();
          if (!drag.throttle) {
            drag.throttle = true; // 节流
            window.requestAnimationFrame(() => {
              drag.throttle = null;
              const height = monacoBox.height + event.pageY - drag.y;
              if (height > 0 && monacoBox.offsetHeight !== height) {
                monacoBox.setAttribute('style', `min-height: 30px;height: ${height}px`)
                this.monaco[id].layout();
              }
            })
          }
        }
        box.appendChild(drag);
        // 删除复制
        const operation = document.createElement('div'); // 操作盒子
        operation.setAttribute('class', 'editor-operation');
        const operationDelete = document.createElement('div'); // 删除按钮
        operationDelete.setAttribute('class', 'editor-operation-btn editor-operation-delete');
        const operationCopy = document.createElement('div'); // 复制按钮
        operationCopy.setAttribute('class', 'editor-operation-btn editor-operation-copy');
        operation.appendChild(operationCopy);
        operation.appendChild(operationDelete);
        box.appendChild(operation);
        box.onfocus = function () {
          console.log(1111);
        }
        box.onblur = function () {
          console.log(222)
        }
        this.$refs.editor.insertBefore(box, mutation.previousSibling); // 插入代码编辑器容器
        this.$refs.editor.removeChild(mutation.previousSibling); // 清除原标签
        this.monaco[id] = monaco.editor.create(monacoBox, {
          language: language,
          tabSize: 2,
          theme: 'vs-dark'
        });
      },
      // 创建 select 选择器
      createSelect(options, defaultValue) {
        const selectItem = document.createElement('div');
        selectItem.setAttribute('class', 'editor-select');
        const input = document.createElement('input');
        input.setAttribute('readOnly', 'true');
        input.setAttribute('class', 'editor-select-input');
        defaultValue && input.setAttribute('value', defaultValue); // 设置默认值
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'editor-select-dropdown');
        for (let item of options) {
          const li = document.createElement('li');
          li.setAttribute('class', 'editor-select-dropdown-item')
          li.setAttribute('data-value', item.value);
          li.innerHTML = item.label;
          ul.appendChild(li);
        }
        selectItem.appendChild(input);
        selectItem.appendChild(ul);
        // 设置事件
        input.onclick = function () {
          ul.setAttribute('style', ul.getAttribute('style') ? '' : 'height: auto;display: block;');
        }
        input.onblur = function () {
          setTimeout(function () {
            ul.setAttribute('style', ''); // 失去焦点自动隐藏下拉
          }, 200);
        }
        ul.addEventListener('click', function (event) {
          const target = {
            value: event.target.getAttribute('data-value'),
            label: event.target.innerText
          }
          selectItem.setAttribute('data-value', target.value);
          input.setAttribute('value', target.label);
          input.onclick();
          selectItem.oninput && selectItem.oninput(target); // 触发 input 事件
        }, false)
        return selectItem;
      },
      // 创建行标签
      createLineElement(tagName = this.lineTagName, childrenElement) {
        const element = document.createElement(tagName);
        element.appendChild(childrenElement || document.createElement('br'));
        return element;
      },
      // 光标移动到下一行
      pointNextLine() {
        window.getSelection().modify('move', 'forward', 'line'); // 调整到下一行 todo 做兼容
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
  padding-left: 40px;
  text-align: left;
  height: 300px;
  color: #262626;
  line-height: 1.74;
  outline-style: none;
  word-break: break-word;
  letter-spacing: 0.05em;
  background-color: #ffffff;
  box-sizing: border-box;
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
  /deep/ .code-editor {
    border-radius: 4px;
    position: relative;
    outline: none;
    .code-editor-language {
      border: 1px solid #e8e8e8;
      padding: 4px 12px;
    }
    .editor-select {
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
      padding: 0 12px;
      overflow: visible;
      position: relative;
      display: inline-block;
      min-width: 120px;
      cursor: pointer;
      .editor-select-input {
        border: none;
        outline: none;
        cursor: pointer;
      }
      .editor-select-dropdown {
        display: none;
        height: 0;
        position: absolute;
        top: 35px;
        left: 0;
        margin: 0;
        width: max-content;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        list-style: none;
        padding-inline-start: 0;
        max-height: 200px;
        overflow: auto;
        z-index: 1;
        background-color: #ffffff;
        transition: height .2s;
      }
      .editor-select-dropdown-item {
        height: 30px;
        line-height: 30px;
        padding: 0 12px;
        cursor: pointer;
        &:hover {
          background-color: #76D7C4;
        }
      }
    }
    .editor-resize {
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 10px;
      width: 80px;
      border-radius: 10px;
      background-color: #dddddd;
      margin: auto;
      cursor: row-resize;
    }
    .editor-operation {
      position: absolute;
      top: -45px;
      left: 0;
      padding: 5px;
      display: flex;
      flex-direction: row;
      background-color: #ffffff;
      border: 1px solid #e8e8e8;
      box-shadow: 0 2px 4px 0 rgba(225, 225, 225, 0.5);
    }
    .editor-operation-btn {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: #e8e8e8;
      }
    }
    .editor-operation-delete {
      &::after {
        display: block;
        content: url('data:image/svg+xml;charset=UTF-8, <svg t="1583916737540" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2510" width="16" height="16"><path d="M758.125714 822.564571a53.540571 53.540571 0 0 1-53.467428 53.394286H319.341714a53.540571 53.540571 0 0 1-53.394285-53.394286v-567.588571h492.178285v567.588571zM372.882286 158.939429c0-6.144 4.754286-10.971429 10.971428-10.971429h257.024c6.144 0 10.971429 4.827429 10.971429 10.971429v32.182857H372.882286v-32.182857z m545.645714 32.182857H715.556571v-32.182857c0-41.106286-33.572571-74.678857-74.678857-74.678858H383.780571c-41.106286 0-74.678857 33.645714-74.678857 74.678858v32.182857H105.472a32.182857 32.182857 0 1 0 0 64.512h96.036571v566.857143c0 65.097143 52.736 117.906286 117.833143 117.906285h385.316572c65.097143 0 117.906286-52.736 117.906285-117.833143v-567.588571h95.963429a32.182857 32.182857 0 0 0 32.182857-32.256 31.597714 31.597714 0 0 0-32.182857-31.524571zM512 779.410286a32.182857 32.182857 0 0 0 32.182857-32.182857V404.406857a32.182857 32.182857 0 1 0-64.365714 0v342.747429c0 17.773714 14.336 32.182857 32.182857 32.182857z m-150.089143 0a32.182857 32.182857 0 0 0 32.182857-32.182857V404.406857a32.182857 32.182857 0 1 0-64.365714 0v342.747429c0.585143 17.773714 14.994286 32.182857 32.182857 32.182857z m300.178286 0a32.182857 32.182857 0 0 0 32.256-32.182857V404.406857a32.182857 32.182857 0 1 0-64.438857 0v342.747429c0 17.773714 14.409143 32.182857 32.182857 32.182857z" p-id="2511"></path></svg>');
        width: 16px;
        height: 16px;
      }
    }
    .editor-operation-copy {
      &::after {
        display: block;
        content: url('data:image/svg+xml;charset=UTF-8, <svg t="1583917836258" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3276" width="16" height="16"><path d="M703.2 220.7h-498c-23.1 0-42 18.9-42 42V740h0.8l187.5 187.5v1.1h351.7c23.1 0 42-18.9 42-42v-624c0-23-18.9-41.9-42-41.9zM354 863.2L228.8 738H354v125.2z m345.2 7.6c0 6.5-5.3 11.8-11.8 11.8H400V722.2c0-16.7-13.5-30.2-30.2-30.2H209.2V278.5c0-6.5 5.3-11.8 11.8-11.8h466.3c6.5 0 11.8 5.3 11.8 11.8v592.3z" p-id="3277"></path><path d="M816.2 98.7H315.1c-12.7 0-23 10.3-23 23s10.3 23 23 23h485.2c6.5 0 11.8 5.3 11.8 11.8v619.6c0 12.7 10.3 23 23 23s23-10.3 23-23V140.7c0.1-23.1-18.8-42-41.9-42z" p-id="3278"></path></svg>');
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
