import{r as s}from"./index.nqgp0DH2.js";typeof MessageChannel>"u"&&(globalThis.MessageChannel=function(){return{port1:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}},port2:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}}}});/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),C=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,o)=>o?o.toUpperCase():r.toLowerCase()),c=t=>{const e=C(t);return e.charAt(0).toUpperCase()+e.slice(1)},u=(...t)=>t.filter((e,r,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===r).join(" ").trim(),g=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=s.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:a="",children:n,iconNode:l,...i},f)=>s.createElement("svg",{ref:f,...h,width:e,height:e,stroke:t,strokeWidth:o?Number(r)*24/Number(e):r,className:u("lucide",a),...!n&&!g(i)&&{"aria-hidden":"true"},...i},[...l.map(([p,d])=>s.createElement(p,d)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=(t,e)=>{const r=s.forwardRef(({className:o,...a},n)=>s.createElement(w,{ref:n,iconNode:e,className:u(`lucide-${m(c(t))}`,`lucide-${t}`,o),...a}));return r.displayName=c(t),r};export{L as c};
