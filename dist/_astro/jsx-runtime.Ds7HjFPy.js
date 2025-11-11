typeof MessageChannel>"u"&&(globalThis.MessageChannel=function(){return{port1:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}},port2:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}}}});var o={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u;function d(){if(u)return n;u=1;var f=Symbol.for("react.transitional.element"),v=Symbol.for("react.fragment");function i(x,e,t){var r=null;if(t!==void 0&&(r=""+t),e.key!==void 0&&(r=""+e.key),"key"in e){t={};for(var s in e)s!=="key"&&(t[s]=e[s])}else t=e;return e=t.ref,{$$typeof:f,type:x,key:r,ref:e!==void 0?e:null,props:t}}return n.Fragment=v,n.jsx=i,n.jsxs=i,n}var a;function l(){return a||(a=1,o.exports=d()),o.exports}var c=l();export{c as j};
