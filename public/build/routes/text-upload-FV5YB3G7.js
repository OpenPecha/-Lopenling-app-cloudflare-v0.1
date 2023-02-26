import{a as b}from"/build/_shared/chunk-TB73CX4F.js";import{a as p}from"/build/_shared/chunk-ES2EUGPA.js";import"/build/_shared/chunk-D77PT7XN.js";import{c as s,k as l,l as u,m as c}from"/build/_shared/chunk-PRLHKOL5.js";import{C as m,a as f}from"/build/_shared/chunk-I6B64LB6.js";import{e as a}from"/build/_shared/chunk-ADMCF34Z.js";var x=a(f()),y=a(p());var e=a(m());function g(){var i;let t=(0,x.useRef)(),o=l(),r=u();r.state!=="idle"&&t.current.reset();let[n]=b();return(0,e.jsxs)("div",{className:"mx-10 my-4",children:[(0,e.jsxs)(s,{method:"post",ref:t,children:[(0,e.jsxs)("div",{className:"mb-6",children:[(0,e.jsx)("label",{htmlFor:"text-name",className:"mb-2 block text-sm font-medium text-gray-900 dark:text-white",children:"Text name"}),(0,e.jsx)("input",{type:"text",id:"text-name",name:"text-name",className:"block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",placeholder:"title",required:!0})]}),(0,e.jsxs)("div",{className:"mb-6",children:[(0,e.jsx)("label",{htmlFor:"text-content",className:"mb-2 block text-sm font-medium text-gray-900 dark:text-white",children:"Text Content"}),(0,e.jsx)("textarea",{id:"text-content",name:"text-content",rows:4,className:"block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",placeholder:"Content"})]}),(0,e.jsx)("button",{type:"submit",className:"rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",children:r.state!=="idle"&&((i=r.submission)==null?void 0:i.method)==="POST"?" Text uploading":"Upload"})]}),(0,e.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:10,marginTop:10},ref:n,children:o.textList.map(d=>(0,e.jsx)(h,{text:d},d.id))})]})}function h({text:t}){let o=c();function r(n){confirm("do you wish to delete the text")&&o.submit({textId:n},{method:"delete"})}return(0,e.jsxs)("div",{style:{background:"#eee",borderRadius:20,padding:4,paddingInline:10,position:"relative",display:o.submission?"none":"block"},children:[t.name,(0,e.jsx)("button",{type:"submit",onClick:()=>r(t.id),className:"absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900",children:"x"})]})}export{g as default};