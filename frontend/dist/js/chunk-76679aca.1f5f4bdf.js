(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-76679aca"],{"1b63":function(t,e,n){"use strict";n.r(e);var c=n("7a23");Object(c["O"])("data-v-4858bdc0");var i={class:"background"},s=Object(c["n"])("h1",{class:"manage-title"},"背景图管理",-1),l={style:{"margin-bottom":"20px"}},a={class:"add"},o=Object(c["p"])("确定"),u=Object(c["p"])("添加"),r=Object(c["n"])("div",{class:"tip"},"建议图片地址不设置协议,自动匹配 http 与 https",-1),b={class:"head-box"},d=["src"],j={class:"delete"},O=["src"];function m(t,e,n,m,h,p){var f=Object(c["U"])("el-input"),v=Object(c["U"])("el-button"),k=Object(c["U"])("el-popover"),g=Object(c["U"])("icon"),w=Object(c["U"])("el-dialog");return Object(c["L"])(),Object(c["m"])("div",i,[s,Object(c["n"])("div",l,[Object(c["q"])(k,{placement:"top-start",width:"300",trigger:"click"},{default:Object(c["jb"])((function(){return[Object(c["T"])(t.$slots,"content",{},(function(){return[Object(c["n"])("div",a,[Object(c["q"])(f,{modelValue:h.tempUrl,"onUpdate:modelValue":e[0]||(e[0]=function(t){return h.tempUrl=t}),size:"small",placeholder:"请输入图片地址"},null,8,["modelValue"]),Object(c["q"])(v,{size:"small",plain:"",type:"success",onClick:p.addItem},{default:Object(c["jb"])((function(){return[o]})),_:1},8,["onClick"])])]}),{},!0),Object(c["q"])(v,{slot:"reference",size:"small",plain:""},{default:Object(c["jb"])((function(){return[u]})),_:1})]})),_:3}),Object(c["l"])("",!0)]),r,Object(c["n"])("div",b,[(Object(c["L"])(!0),Object(c["m"])(c["b"],null,Object(c["S"])(h.list,(function(t,e){return Object(c["L"])(),Object(c["m"])("div",{key:t,class:"head-box-item"},[Object(c["n"])("img",{src:t,alt:""},null,8,d),Object(c["n"])("div",j,[Object(c["q"])(g,{use:"iconyanjing",class:"hover-blue",onClick:function(e){return(h.show=!0)&&(h.url=t)}},null,8,["onClick"]),Object(c["q"])(g,{use:"iconicon_trashcan",class:"hover-red",onClick:function(t){return p.deleteItem(e)}},null,8,["onClick"])])])})),128))]),Object(c["q"])(w,{visible:h.show,width:"1200px"},{default:Object(c["jb"])((function(){return[Object(c["n"])("img",{src:h.url,width:"100%",alt:""},null,8,O)]})),_:1},8,["visible"])])}Object(c["M"])();n("a434"),n("4de4");var h={name:"background",data:function(){return{list:[],show:!1,url:"",tempUrl:""}},mounted:function(){this.getData()},methods:{deleteItem:function(t){var e=this;this.$confirm("删除操作不可回退,确认删除吗").then((function(){e.list.splice(t,1),e.save("删除成功")}))},addItem:function(){this.tempUrl?(this.list.push(this.tempUrl),this.tempUrl="",this.save("添加成功!")):this.message.info("图片地址不能为空哦")},getData:function(){var t=this;this.apiGet("/api/common/json",{params:{key:"background"}}).then((function(e){200===e.code&&(t.list=e.data)}))},save:function(t){var e=this;this.apiPost("/api/common/json",{key:"background",value:this.list.filter((function(t){return!!t}))}).then((function(n){200===n.code&&e.$message.success(t||"保存成功!")}))}}};n("735b");h.render=m,h.__scopeId="data-v-4858bdc0";e["default"]=h},"735b":function(t,e,n){"use strict";n("888a")},"888a":function(t,e,n){}}]);