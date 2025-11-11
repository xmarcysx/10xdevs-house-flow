import{j as e}from"./jsx-runtime.Ds7HjFPy.js";import{r as o}from"./index.nqgp0DH2.js";typeof MessageChannel>"u"&&(globalThis.MessageChannel=function(){return{port1:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}},port2:{postMessage:function(){},addEventListener:function(){},removeEventListener:function(){},close:function(){}}}});const m=({message:s="Ładowanie danych...",size:t="md",className:i=""})=>{const a={sm:"h-8 w-8",md:"h-16 w-16",lg:"h-20 w-20"},l={sm:"text-lg",md:"text-2xl",lg:"text-3xl"};return o.useEffect(()=>{if(!document.getElementById("loading-animations")){const n=document.createElement("style");n.id="loading-animations",n.textContent=`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        .text-transparent {
          -webkit-text-fill-color: transparent;
        }
      `,document.head.appendChild(n)}return()=>{}},[]),e.jsx("div",{className:`col-span-full flex items-center justify-center py-20 ${i}`,children:e.jsxs("div",{className:"flex flex-col items-center justify-center",children:[e.jsxs("div",{className:"relative mb-8",children:[e.jsx("div",{className:`animate-spin rounded-full ${a[t]} border-4 border-blue-200 dark:border-blue-800`}),e.jsx("div",{className:`animate-spin rounded-full ${a[t]} border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0`})]}),e.jsx("h3",{className:`font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 ${l[t]}`,children:s}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400 text-lg",children:"Przygotowujemy Twoje dane finansowe"}),e.jsxs("div",{className:"flex justify-center gap-2 mt-6",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce"}),e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"}),e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"})]})]})})};export{m as L};
