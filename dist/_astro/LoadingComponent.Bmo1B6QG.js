import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as i}from"./index.DUwX4xZl.js";const c=({message:l="Ładowanie danych...",size:t="md",className:r=""})=>{const n={sm:"h-8 w-8",md:"h-16 w-16",lg:"h-20 w-20"},s={sm:"text-lg",md:"text-2xl",lg:"text-3xl"};return i.useEffect(()=>{if(!document.getElementById("loading-animations")){const a=document.createElement("style");a.id="loading-animations",a.textContent=`
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
      `,document.head.appendChild(a)}return()=>{}},[]),e.jsx("div",{className:`col-span-full flex items-center justify-center py-20 ${r}`,children:e.jsxs("div",{className:"flex flex-col items-center justify-center",children:[e.jsxs("div",{className:"relative mb-8",children:[e.jsx("div",{className:`animate-spin rounded-full ${n[t]} border-4 border-blue-200 dark:border-blue-800`}),e.jsx("div",{className:`animate-spin rounded-full ${n[t]} border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0`})]}),e.jsx("h3",{className:`font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 ${s[t]}`,children:l}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400 text-lg",children:"Przygotowujemy Twoje dane finansowe"}),e.jsxs("div",{className:"flex justify-center gap-2 mt-6",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce"}),e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"}),e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"})]})]})})};export{c as L};
