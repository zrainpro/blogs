(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-32084b3a"],{"1b63":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"background"},[s("h1",{staticClass:"manage-title"},[t._v("背景图管理")]),s("div",{staticStyle:{"margin-bottom":"20px"}},[s("el-popover",{attrs:{placement:"top-start",width:"300",trigger:"click"}},[t._t("content",(function(){return[s("div",{staticClass:"add"},[s("el-input",{attrs:{size:"small",placeholder:"请输入图片地址"},model:{value:t.tempUrl,callback:function(e){t.tempUrl=e},expression:"tempUrl"}}),s("el-button",{attrs:{size:"small",plain:"",type:"success"},on:{click:t.addItem}},[t._v("确定")])],1)]})),s("el-button",{attrs:{slot:"reference",size:"small",plain:""},slot:"reference"},[t._v("添加")])],2),t._e()],1),s("div",{staticClass:"tip"},[t._v("建议图片地址不设置协议,自动匹配 http 与 https")]),s("div",{staticClass:"head-box"},t._l(t.list,(function(e,i){return s("div",{key:e,staticClass:"head-box-item"},[s("img",{attrs:{src:e,alt:""}}),s("div",{staticClass:"delete"},[s("icon",{staticClass:"hover-blue",attrs:{use:"iconyanjing"},nativeOn:{click:function(s){(t.show=!0)&&(t.url=e)}}}),s("icon",{staticClass:"hover-red",attrs:{use:"iconicon_trashcan"},nativeOn:{click:function(e){return t.deleteItem(i)}}})],1)])})),0),s("el-dialog",{attrs:{visible:t.show,width:"1200px"},on:{"update:visible":function(e){t.show=e}}},[s("img",{attrs:{src:t.url,width:"100%",alt:""}})])],1)},n=[],a=(s("a434"),s("4de4"),{name:"background",data:function(){return{list:[],show:!1,url:"",tempUrl:""}},mounted:function(){this.getData()},methods:{deleteItem:function(t){var e=this;this.$confirm("删除操作不可回退,确认删除吗").then((function(){e.list.splice(t,1),e.save("删除成功")}))},addItem:function(){this.tempUrl?(this.list.push(this.tempUrl),this.tempUrl="",this.save("添加成功!")):this.message.info("图片地址不能为空哦")},getData:function(){var t=this;this.apiGet("/api/common/json",{params:{key:"background"}}).then((function(e){200===e.code&&(t.list=e.data)}))},save:function(t){var e=this;this.apiPost("/api/common/json",{key:"background",value:this.list.filter((function(t){return!!t}))}).then((function(s){200===s.code&&e.$message.success(t||"保存成功!")}))}}}),c=a,l=(s("7ebc"),s("2877")),o=Object(l["a"])(c,i,n,!1,null,"4858bdc0",null);e["default"]=o.exports},"42a1":function(t,e,s){},"7ebc":function(t,e,s){"use strict";s("42a1")}}]);