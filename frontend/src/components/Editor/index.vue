<template>
  <div ref="editor" class="editor" />
</template>

<script>
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

  export default {
    name: 'editor',
    props: {
      readonly: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      }
    },
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
          { text: '>\\s', ecode: '&gt;', tagName: 'blockquote', createTag: true, desc: 'H6' }
        ],
        monaco: {}, // 保存 monaco editor 实例
        throttle: false, // window 的 resize 节流用到
        lineTagName: 'p' // 行元素的标签名
      }
    },
    mounted () {
      // 设置是否只读
      if (!this.readonly) {
        this.$refs.editor.setAttribute('contenteditable', 'true')
      } else {
        this.$refs.editor.setAttribute('style', 'padding-left: 0'); // 只读状态取消padding
      }
      // 初始化编辑器
      this.initEditor();
      // 为编辑器设置 resize 监听
      this.onresize = () => {
        if (!this.throttle) {
          this.throttle = true;
          window.requestAnimationFrame(() => {
            this.throttle = false;
            Object.keys(this.monaco).forEach(it => {
              this.monaco[it].layout();
            })
          })
        }
      }
      window.addEventListener('resize', this.onresize)
    },
    destroyed () {
      window.removeEventListener('resize', this.onresize);
    },
    watch: {
      value() {
        if (this.readonly) {
          this.setValue(this.value); // 只在只读状态采用 value 的值
        }
      }
    },
    methods: {
      // 获取编辑器的代码
      getValue() {
        const clone = this.$refs.editor.cloneNode(true);
        for (const item of clone.childNodes) {
          if (item.getAttribute('class')?.includes('code-editor')) {
            const pre = document.createElement('pre');
            const id = item.getAttribute('id');
            pre.innerHTML = this.monaco[id]?.getValue();
            // 给标签设置语言标记
            pre.setAttribute('language', this.monaco[id]?.getModel()?.getLanguageIdentifier()?.language);
            clone.insertBefore(pre, item); // 插入 pre 标签
            clone.removeChild(item); // 删除编辑器标签
          }
        }
        return clone.innerHTML;
      },
      setValue(value) {
        // 先清空当前内容
        Object.keys(this.monaco).forEach(it => {
          this.monaco[it].destroy();
        })
        this.monaco = {};
        this.$refs.editor.innerHTML = value;
        // 处理新的节点内容
        for (const item of this.$refs.editor.childNodes) {
          // 对代码特殊处理
          if (item.tagName === 'PRE') {
            this.createMonaco(item, item.getAttribute('language'), item.innerHTML);
          }
        }
      },
      // 初始化编辑器
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
          console.log(mutationList);
          this.domchanged = mutationList; // 记录当前按键更改的 dom
          // observer.takeRecords();
          // 控制里面字符不能为空
          if (!this.$refs.editor.innerHTML || this.$refs.editor.innerHTML.replace(' ', '') === '<br>') {
            this.$refs.editor.appendChild(this.createLineElement()); // 插入初始代码
            return;
          }
          // console.log(mutationList);
          for (const mutation of mutationList) {
            // 文本节点改动
            if (mutation.type === 'characterData') {
              // 超出最长快捷键长度退出
              //  && mutation.target.parentElement?.tagName === this.lineTagName.toUpperCase()
              // todo 既能随时监测关键字又能不浪费性能 mutation.target.textContent.length > 15 ||  文字
              if (!mutation.target) { continue; }
              // 便利快捷键,找出符合的快捷键
              const codes = this.hotKeys.find(_ => new RegExp(`^${_.text}`).test(mutation.target.textContent));
              if (!codes) { continue; }
              // 如果触发的元素被删除提前退出
              if (!Array.prototype.find.call(this.$refs.editor.childNodes, _ => _ === mutation.target.parentElement)) { continue; }
              // 写入标签
              const insertDom = this.createLineElement(codes.tagName, codes.createTag ? this.createLineElement() : false);
              const oldText = mutation.target.parentElement.innerText.replace(new RegExp(codes.text), '');
              oldText && (insertDom.innerHTML = oldText);
              window.insertAfter(mutation.target.parentElement, insertDom, this.$refs.editor); // 在目标标签之后插入
              this.$refs.editor.removeChild(mutation.target.parentElement); // 移除原标签
            } else if (mutation.type === 'childList') {
              // 判断变更节点是引用的节点,删除的时候退出 blockquote 标签并插入一行新的
              if (this.keyCode === 8 && mutation.target.nodeName === 'BLOCKQUOTE' && Array.prototype.find.call(mutation.removedNodes, _ => _.nodeName.toLowerCase() === this.lineTagName)) {
                // 如果删除 b
                const tempInsert = this.createLineElement();
                window.insertAfter(mutation.target, tempInsert, this.$refs.editor);
                this.pointNextLine(); // 光标移动到下一行
                continue;
              }
              // 如果是编辑器根节点删除非 标准行标签, 插入标准行标签
              if (this.keyCode === 8 && mutation.target === this.$refs.editor && Array.prototype.find.call(mutation.removedNodes, _ => _.nodeName.toLowerCase() !== this.lineTagName)) {
                window.insertAfter(mutation.previousSibling, this.createLineElement(), this.$refs.editor);
                this.pointNextLine(); // 光标移动到下一行
                continue;
              }
              // 监听编辑器回车事件
              if (this.keyCode === 13 && mutation.target === this.$refs.editor) {
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
        // 记录当前按键的值,方便判断行为
        this.$refs.editor.addEventListener('keydown', (event) => {
          // TODO 通过拦截删除行为解决浏览器怪异的删除行为(无法获取到具体的 dom 元素)
          // console.log(event);
          if (event.keyCode === 8) {
            // event.preventDefault();
          }
          this.keyCode = event.keyCode;
          this.domchanged = false; // 重新标记 dom 为未改变状态
        });
        // todo 空标签按删除的时候会删除前面的标签, 想办法解决掉这个问题
        this.$refs.editor.addEventListener('keyup', (event) => {
          if (event.keyCode === 8) {
            event.preventDefault();
          }
          if (!this.domchanged && event.keyCode === 8) {
            const first = this.$refs.editor.firstElementChild;
            if (first.nodeName.toLowerCase() === this.lineTagName && !first.innerText) return; // 如果首行元素不为空且为标准元素不应该删除
            // console.log('按下删除键但是没有删除元素')
            // 兼容后面有元素删除不了第一行的特殊标签
            const newElement = this.createLineElement();
            newElement.innerHTML = first.innerHTML.replace(new RegExp(`<[/]*${this.lineTagName}[^>]*>`, 'g'), '');
            console.log(newElement.innerHTML, '809')
            window.insertAfter(first, newElement, this.$refs.editor); // 添加一个标准行元素
            this.$refs.editor.removeChild(first); // 删除第一行本来的元素
            this.$nextTick(() => this.pointNextLine('backward')); // 光标移动到上一行
          }
        });
      },
      // 处理 monaco-editor
      detailMonaco(mutation) {
        const language = mutation.previousSibling.innerText.replace('```', '');
        this.createMonaco(mutation.previousSibling, language)
      },
      // 创建 monaco-editor
      createMonaco(target, language = 'javascript', value) {
        language = language || 'javascript';
        const id = window.btoa(new Date().getTime());
        const box = document.createElement('div');
        box.setAttribute('id', id);
        box.setAttribute('class', 'code-editor');
        box.setAttribute('contenteditable', 'false');
        box.tabIndex = Object.keys(this.monaco).length; // 使 focus 事件生效
        // 操作按钮的数据
        const operationJSON = {
          copy: {
            class: 'editor-operation-btn editor-operation-copy',
            eventName: 'mousedown',
            title: '复制',
            listener: () => {
              window.copyText(this.monaco[id].getValue()); // 复制
              // todo 向外提供复制成功的api;
              this.$message.success('复制成功'); // 暂时直接弹出提示
            }
          },
          delete: {
            class: 'editor-operation-btn editor-operation-delete',
            eventName: 'mousedown',
            title: '删除',
            listener: () => {
              delete this.monaco[id]; // 删除编辑器的数据
              this.$refs.editor.removeChild(box); // 移除编辑器
            }
          },
          fullscreen: {
            class: 'editor-operation-btn editor-operation-fullscreen',
            eventName: 'mousedown',
            title: '全屏',
            listener: (e, { box, monacoBox, monaco, operation, target }) => {
              if (target.fullscreen) {
                target.fullscreen = false;
                box.removeAttribute('style');
                monacoBox.setAttribute('style', target.oldMonacoBox);
                monaco.layout();
                operation.setAttribute('class', 'editor-operation');
                target.setAttribute('class', 'editor-operation-btn editor-operation-fullscreen');
              } else {
                // 记录之前的 style
                target.oldMonacoBox = monacoBox.getAttribute('style');
                target.fullscreen = true;
                box.setAttribute('style', 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: #fff; z-index: 2000');
                monacoBox.setAttribute('style', 'height: 100vh; width: 100vw');
                monaco.layout();
                operation.setAttribute('class', 'editor-operation editor-operation-item-fullscreen');
                target.setAttribute('class', 'editor-operation-btn editor-operation-exit-fullscreen');
              }
            }
          }
        }
        // 只读状态取消某些功能
        if (!this.readonly) {
          // 语言选择修改框
          const selectLanguage = document.createElement('div');
          selectLanguage.setAttribute('class', 'code-editor-language');
          const languages = monaco.languages.getLanguages();
          const selectItem = this.createSelect(languages.map(_ => ({ label: _.id, value: _.id })), language); // 创建 select 选择器
          selectItem.oninput = (it) => {
            monaco.editor.setModelLanguage(this.monaco[id].getModel(), it.value); // 更改语言
          }
          selectLanguage.appendChild(selectItem);
          box.appendChild(selectLanguage);
        } else {
          // 只读状态取消删除按钮
          delete operationJSON.delete;
        }
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
        Object.entries(operationJSON).forEach(([key, item]) => {
          const temp = document.createElement('div'); // 按钮容器
          temp.setAttribute('class', item.class); // 设置样式
          temp.setAttribute('title', item.title); // 设置 title
          temp.addEventListener(item.eventName, (e) => {
            item.listener.call(this, e, { operation, box, monacoBox, target: temp, monaco: this.monaco[id] });
          }); // 设置事件
          operation.appendChild(temp); // 放到容器里面
        })
        box.appendChild(operation);
        this.$refs.editor.insertBefore(box, target); // 插入代码编辑器容器
        this.$refs.editor.insertBefore(this.createLineElement(), box); // 在编辑器前面插入一行空行
        this.$refs.editor.removeChild(target); // 清除原标签
        this.monaco[id] = monaco.editor.create(monacoBox, {
          language: language,
          tabSize: 2,
          value,
          theme: 'vs-dark',
          readOnly: this.readonly
        });
        this.monaco[id].onDidFocusEditorText(function () {
          operation.setAttribute('style', 'display: flex');
        }); // focus 时显示操作按钮
        this.monaco[id].onDidBlurEditorText(() => {
          operation.setAttribute('style', 'display: none');
        }); // blur 时隐藏操作按钮
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
        for (const item of options) {
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
        element.setAttribute('class', '');
        // element.setAttribute('data-id', '123456');
        return element;
      },
      // 光标移动到下一行
      pointNextLine(direction = 'forward', particle = 'line') {
        // modify  backward  forward left right
        window.getSelection().modify('move', direction, particle); // 调整到下一行 todo 做兼容
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
  min-height: 300px;
  color: #262626;
  line-height: 1.74;
  outline-style: none;
  word-break: break-word;
  letter-spacing: 0.05em;
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
      display: none;
      position: absolute;
      top: -45px;
      left: 0;
      padding: 5px;
      flex-direction: row;
      background-color: #ffffff;
      border: 1px solid #e8e8e8;
      box-shadow: 0 2px 4px 0 rgba(225, 225, 225, 0.5);
    }
    .editor-operation-item-fullscreen {
      display: flex !important;
      top: 12px;
      left: auto;
      right: 20px;
    }
    .editor-operation-btn {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
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
    .editor-operation-fullscreen {
      &::after {
        display: block;
        content: url('data:image/svg+xml;charset=UTF-8, <svg t="1599200379068" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2399" width="16" height="16"><path d="M641.750109 384.100028l205.227128-204.519-0.704035 115.89966c-0.282433 9.611915 7.489578 18.09103 17.101493 17.808598l12.297071 0c9.611915-0.283456 17.667382-5.936199 17.808598-15.689331l0.565888-172.57752c0-0.14224 0.282433-9.187243 0.282433-9.187243 0.14224-4.804423-0.99056-9.187243-4.100388-12.297071-3.109828-3.109828-7.347339-5.086855-12.297071-4.946662l-8.763594 0.14224c-0.141216 0-0.278339 0-0.420579 0.14224L697.581696 98.166787c-9.611915 0.283456-17.667382 8.200776-17.808598 17.950837l0 12.297071c1.416256 11.44875 10.458189 18.092054 20.070104 17.808598l112.789832 0.283456-204.66124 203.814965c-9.329483 9.329483-9.329483 24.449855 0 33.778314 9.329483 9.470699 24.452925 9.470699 33.782408 0L641.750109 384.100028zM383.095141 576.889893 177.726797 780.705881l0.707105-115.338888c0.283456-9.607822-7.492648-18.086937-17.104563-17.808598l-13.001105 0c-9.611915 0.283456-17.667382 5.937223-17.808598 15.690354l-0.565888 172.718737c0 0.14224-0.282433 9.187243-0.282433 9.187243-0.14224 4.808516 0.99056 9.187243 4.096295 12.297071 3.109828 3.109828 7.351432 5.086855 12.297071 4.946662l8.762571-0.14224c0.14224 0 0.283456 0 0.425695-0.14224l171.873486 0.708128c9.607822-0.283456 17.667382-8.196683 17.808598-17.950837L344.93503 832.575226c-1.415232-11.44875-10.461259-18.092054-20.074198-17.808598L212.069977 814.483172 416.59 610.671277c9.329483-9.329483 9.329483-24.453948 0-33.782408C407.40685 567.41817 392.424624 567.41817 383.095141 576.889893L383.095141 576.889893zM894.047276 835.967486l-0.424672-172.718737c-0.283456-9.612938-8.200776-15.406898-17.809621-15.690354l-12.296047 0c-9.612938-0.278339-17.243733 8.200776-17.105586 17.808598l0.708128 115.903753L641.750109 576.889893c-9.329483-9.329483-24.452925-9.329483-33.782408 0-9.325389 9.328459-9.325389 24.452925 0 33.782408L812.490795 814.483172l-112.789832 0.283456c-9.611915-0.283456-18.515702 6.502088-20.073174 17.808598l0 12.297071c0.282433 9.611915 8.200776 17.667382 17.808598 17.950837l171.166381-0.708128c0.141216 0 0.282433 0.14224 0.424672 0.14224l8.763594 0.14224c4.803399 0.141216 9.187243-1.694595 12.296047-4.946662 3.109828-3.109828 4.238534-7.488555 4.097318-12.297071 0 0-0.14224-9.046027-0.14224-9.187243L894.047276 835.968509zM212.216309 146.506748l112.789832-0.283456c9.607822 0.283456 18.512632-6.502088 20.070104-17.808598L345.076246 116.116601c-0.283456-9.611915-8.196683-17.667382-17.808598-17.950837l-172.011632 0.708128c-0.14224 0-0.283456-0.14224-0.425695-0.14224l-8.761548-0.14224c-4.808516-0.141216-9.187243 1.694595-12.297071 4.946662-3.109828 3.109828-4.242627 7.488555-4.096295 12.297071 0 0 0.282433 9.046027 0.282433 9.187243l0.420579 172.718737c0.14224 9.608845 8.200776 15.406898 17.808598 15.686261l13.005198 0c9.611915 0.282433 17.242709-8.196683 17.10047-17.808598l-0.564865-115.334795 205.231221 203.958228c9.324366 9.329483 24.448832 9.329483 33.777291 0 9.329483-9.329483 9.329483-24.452925 0-33.782408L212.216309 146.506748 212.216309 146.506748zM212.216309 146.506748" p-id="2400"></path></svg>');
        width: 16px;
        height: 16px;
      }
    }
    .editor-operation-exit-fullscreen {
      &::after {
        display: block;
        content: url('data:image/svg+xml;charset=UTF-8, <svg t="1599201738133" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2798" width="16" height="16"><path d="M749.248 704H864a32 32 0 1 0 0-64H672a32 32 0 0 0-32 32v192a32 32 0 1 0 64 0v-114.752l137.36 137.36a32 32 0 1 0 45.232-45.264L749.248 704zM320 749.248V864a32 32 0 1 0 64 0V672a32 32 0 0 0-32-32H160a32 32 0 1 0 0 64h114.752l-137.36 137.36a32 32 0 1 0 45.264 45.232L320 749.248zM749.248 320H864a32 32 0 1 1 0 64H672a32 32 0 0 1-32-32V160a32 32 0 1 1 64 0v114.752l137.36-137.36a32 32 0 1 1 45.232 45.264L749.248 320zM320 274.752V160a32 32 0 1 1 64 0v192a32 32 0 0 1-32 32H160a32 32 0 1 1 0-64h114.752l-137.36-137.36a32 32 0 1 1 45.264-45.232L320 274.752z" p-id="2799"></path></svg>');
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
