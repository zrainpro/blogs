(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-37d48c1c"],{"02dc":function(e,t,n){},"0faf":function(e,t,n){"use strict";n("5b28")},"31b7":function(e,t,n){"use strict";n.r(t);n("b0c0");var a=n("7a23");Object(a["O"])("data-v-1dadeb6e");var c={class:"menu"},u=Object(a["n"])("h1",{class:"manage-title"},"菜单管理",-1),l=Object(a["p"])("追加"),d=Object(a["p"])("保存"),i={class:"menu-box"},o={class:"menu-item"},s=Object(a["p"])("添加子节点"),r={key:0,class:"menu-children"};function b(e,t,n,b,m,j){var f=Object(a["U"])("el-button"),O=Object(a["U"])("el-input"),p=Object(a["U"])("Label"),h=Object(a["U"])("el-switch");return Object(a["L"])(),Object(a["m"])("div",c,[u,Object(a["n"])("div",null,[Object(a["q"])(f,{type:"primary",plain:"",size:"small",onClick:t[0]||(t[0]=function(e){return j.addMenu()})},{default:Object(a["jb"])((function(){return[l]})),_:1}),Object(a["q"])(f,{type:"success",plain:"",size:"small",onClick:t[1]||(t[1]=function(e){return j.save()})},{default:Object(a["jb"])((function(){return[d]})),_:1})]),Object(a["n"])("div",i,[(Object(a["L"])(!0),Object(a["m"])(a["b"],null,Object(a["S"])(m.menu,(function(e,t){return Object(a["L"])(),Object(a["m"])("div",{key:t},[Object(a["n"])("div",o,[Object(a["q"])(p,{name:"菜单名"},{default:Object(a["jb"])((function(){return[Object(a["q"])(O,{modelValue:e.name,"onUpdate:modelValue":function(t){return e.name=t},size:"small"},null,8,["modelValue","onUpdate:modelValue"])]})),_:2},1024),Object(a["q"])(p,{name:"地址"},{default:Object(a["jb"])((function(){return[Object(a["q"])(O,{modelValue:e.address,"onUpdate:modelValue":function(t){return e.address=t},size:"small"},null,8,["modelValue","onUpdate:modelValue"])]})),_:2},1024),Object(a["q"])(f,{type:"text",onClick:function(t){return j.addMenu(e)}},{default:Object(a["jb"])((function(){return[s]})),_:2},1032,["onClick"]),e._id?(Object(a["L"])(),Object(a["k"])(h,{key:0,modelValue:e.disabled,"onUpdate:modelValue":function(t){return e.disabled=t},"active-value":0,"inactive-value":1,"active-text":"启用","inactive-text":"禁用",onChange:function(t){return j.changeStatus(t,e)}},null,8,["modelValue","onUpdate:modelValue","onChange"])):Object(a["l"])("",!0)]),e.children?(Object(a["L"])(),Object(a["m"])("div",r,[(Object(a["L"])(!0),Object(a["m"])(a["b"],null,Object(a["S"])(e.children,(function(e,t){return Object(a["L"])(),Object(a["m"])("div",{key:t,class:"menu-item"},[Object(a["q"])(p,{name:"菜单名"},{default:Object(a["jb"])((function(){return[Object(a["q"])(O,{modelValue:e.name,"onUpdate:modelValue":function(t){return e.name=t},size:"small"},null,8,["modelValue","onUpdate:modelValue"])]})),_:2},1024),Object(a["q"])(p,{name:"地址"},{default:Object(a["jb"])((function(){return[Object(a["q"])(O,{modelValue:e.address,"onUpdate:modelValue":function(t){return e.address=t},size:"small"},null,8,["modelValue","onUpdate:modelValue"])]})),_:2},1024),e._id?(Object(a["L"])(),Object(a["k"])(h,{key:0,modelValue:e.disabled,"onUpdate:modelValue":function(t){return e.disabled=t},"active-value":0,"inactive-value":1,"active-text":"启用","inactive-text":"禁用",onChange:function(t){return j.changeStatus(t,e)}},null,8,["modelValue","onUpdate:modelValue","onChange"])):Object(a["l"])("",!0)])})),128))])):Object(a["l"])("",!0)])})),128))])])}Object(a["M"])();n("7db0");Object(a["O"])("data-v-4c9a1e1e");var m={class:"label"};function j(e,t,n,c,u,l){return Object(a["L"])(),Object(a["m"])("div",m,[Object(a["n"])("div",{class:Object(a["A"])("label-name ".concat(n.required?"label-required":""))},Object(a["Y"])(n.name),3),Object(a["T"])(e.$slots,"default",{},void 0,!0)])}Object(a["M"])();n("d3b7"),n("25f0");var f={name:"label-self",props:{name:{type:String,default:""},required:{type:Boolean,default:!0},msg:{type:String,default:""}},methods:{blur:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(){console.log(blur)}))}};n("0faf");f.render=j,f.__scopeId="data-v-4c9a1e1e";var O=f,p={name:"manageMenu",components:{Label:O},data:function(){return{menu:[]}},mounted:function(){this.getMenuData()},methods:{getMenuData:function(){var e=this;this.apiGet("/api/category/list/all").then((function(t){200===t.code&&(e.menu=t.data)}))},addMenu:function(e){e?(!e.children&&(e.children=[]),e.children.push({name:"",address:"",disabled:0}),this.menu=JSON.parse(JSON.stringify(this.menu))):this.menu.push({name:"",address:"",disabled:0})},save:function(){var e=this,t=!1;this.menu.find((function(e){return e.name&&e.address?(e.children&&e.children.find((function(e){if(!e.name||!e.address)return t=!0,!0})),t):(t=!0,!0)})),t?this.$message.error("请填写完整在保存"):this.apiPost("/api/category/patch",{category:this.menu}).then((function(t){200===t.code&&(e.$message.success("保存成功"),e.getMenuData())}))},changeStatus:function(e,t){var n=this;this.apiPost("/api/category/".concat(t._id,"/status"),{disabled:e}).then((function(t){200===t.code&&n.$message.success("".concat(e?"禁用":"启用","成功"))}))}}};n("deb7");p.render=b,p.__scopeId="data-v-1dadeb6e";t["default"]=p},"5b28":function(e,t,n){},deb7:function(e,t,n){"use strict";n("02dc")}}]);