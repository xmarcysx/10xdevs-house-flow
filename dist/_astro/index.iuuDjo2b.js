import{b as g}from"./index.nqgp0DH2.js";typeof MessageChannel>"u"&&(globalThis.MessageChannel=function(){return{port1:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}},port2:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}}}});var a={exports:{}},c={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f;function w(){if(f)return c;f=1;var u=g();function d(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var l=typeof Object.is=="function"?Object.is:d,p=u.useState,v=u.useEffect,h=u.useLayoutEffect,E=u.useDebugValue;function m(e,t){var r=t(),i=p({inst:{value:r,getSnapshot:t}}),n=i[0].inst,s=i[1];return h(function(){n.value=r,n.getSnapshot=t,o(n)&&s({inst:n})},[e,r,t]),v(function(){return o(n)&&s({inst:n}),e(function(){o(n)&&s({inst:n})})},[e]),E(r),r}function o(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!l(e,r)}catch{return!0}}function y(e,t){return t()}var x=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?y:m;return c.useSyncExternalStore=u.useSyncExternalStore!==void 0?u.useSyncExternalStore:x,c}var S;function b(){return S||(S=1,a.exports=w()),a.exports}export{b as r};
