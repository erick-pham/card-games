if(!self.define){let s,e={};const t=(t,n)=>(t=new URL(t+".js",n).href,e[t]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=t,s.onload=e,document.head.appendChild(s)}else s=t,importScripts(t),e()})).then((()=>{let s=e[t];if(!s)throw new Error(`Module ${t} didn’t register its module`);return s})));self.define=(n,a)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let c={};const r=s=>t(s,i),h={module:{uri:i},exports:c,require:r};e[i]=Promise.all(n.map((s=>h[s]||r(s)))).then((s=>(a(...s),c)))}}define(["./workbox-588899ac"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"434af078512000203212119bf342c673"},{url:"/_next/static/chunks/1018-175cdad99c7867b4.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/1141-00cb0f088aa8ccab.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/135-021ed208cc31394f.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/1937-373dfd4dab056d5b.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/2242.701bf3f7ebb8e822.js",revision:"701bf3f7ebb8e822"},{url:"/_next/static/chunks/3069-28eae87d7af36b16.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/3161-ef6099508c963746.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/3968-bea7052661922708.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/4112-e9c31ab3b7058631.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/4373-00e1d9284a6cf545.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/4384-ed4e98499eb12431.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/5214-e629383c33bee0f0.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/5362-6b2d94d5d2df3c1b.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/5510-b732a1ece4e69aa5.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/5699-5ed645951518f848.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/5709-8df2cc40fdb4fc8f.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/5877-2be2b1cf902a184e.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/6101-8cb579981669550d.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/6748-09970292c05aee0f.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/6886-1be9d9ff6856238a.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/689-6f134a9a3e1a8142.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/753-adbe017d195cda96.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/7669-15d4b7d0ca02a77a.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/7918-a32c6254d7581b93.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/8734-b2d4a07a3bfe5aaa.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/9228-62cca799c9a95f2e.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/9759-15e8ad1ade365d09.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/eabe11fc.f5fa488be53cb10e.js",revision:"f5fa488be53cb10e"},{url:"/_next/static/chunks/ee8b1517-d4be44806565ce29.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/main-3b4cdc1f902fd630.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/main-app-b0c10640ea6d987f.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/404-c4773ac0aeea7385.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/ErrorBoundary-ec0369d52a696d8b.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/_app-912872d9d8f552bd.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/_error-7eb2326bfea6ee40.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/access-denied-c36b5fc73c267320.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin-af16a198075a4b5b.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/account-952e2c92dbca5dad.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/account/account-profile-07373dbf5741b5e1.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/account/account-profile-details-4f58d741c5810f12.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/customer/customer-list-toolbar-faab5279a73e3ee0.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/dashboard-layout-84f153a6c579b3a0.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/dashboard-navbar-373fcd5ed90e739b.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/dashboard-sidebar-9334e3ae43ccacbd.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/logo-1b0be100707e70ff.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/nav-item-3531c70d750c74a7.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/product-details/product-details-modal-b19fa5f6a7e12e29.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/product/product-card-492ca5b67a46e7d5.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/product/product-list-toolbar-fcc479a83647b1d0.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/components/product/product-modal-448c31a2058a8969.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/customers-abdec2fdf10238aa.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/icons-24482fe6b90ccf29.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/orders-f9caf8801b5d3067.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/products-6c0e8f3b1bc8c9af.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/admin/products-items-4ac2768dfedec7b6.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/auth/signin-2befdc0469dabf24.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/history-order-1959409ea6b7f03a.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/index-a5c33cf34aab3ad0.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/product-account-game-1051d6833898bb99.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/product-account-game/%5BproductItemId%5D/details-6c1d17e937fee7e0.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/product-card-game-886b7ebd5e074d10.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/pages/profile-b6afc9b526355fe9.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-5f154c157fd44443.js",revision:"hghsDK3bpGTtJxRNThdJC"},{url:"/_next/static/css/40e549305e5a2220.css",revision:"40e549305e5a2220"},{url:"/_next/static/css/d2cef85ee38cf272.css",revision:"d2cef85ee38cf272"},{url:"/_next/static/css/f80178ac7d998fee.css",revision:"f80178ac7d998fee"},{url:"/_next/static/hghsDK3bpGTtJxRNThdJC/_buildManifest.js",revision:"4604274d2ff12a418f109519e7dfb8fb"},{url:"/_next/static/hghsDK3bpGTtJxRNThdJC/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/backgound1.2.ebe5cc17.jpg",revision:"ebe5cc17"},{url:"/favicon.ico",revision:"f3ceac4234265a6bc5e0eca392d540d7"},{url:"/icons/icon-128x128.png",revision:"1f700d4b6c7d29d777b4fba4ae4f82c6"},{url:"/icons/icon-144x144.png",revision:"66442e8d6ba93c267706fdcead694e13"},{url:"/manifest.json",revision:"43f13d9489e7f3b3a28f63e19a77dcfd"},{url:"/static/images/banner1.1.jpg",revision:"05f13d82d501a6511ee150a5d50582e9"},{url:"/static/images/card-img1.1.jpg",revision:"58680e3cb4004618013fd26d184c3057"},{url:"/static/images/card-img1.2.jpg",revision:"fc81e6e20e2155e57292e9eff7307692"},{url:"/static/images/login-page-bg.jpg",revision:"a354e8b0bdba8833726caab64f7b42f1"},{url:"/static/images/logo.png",revision:"1dc4d9531cb02ea02f0a87840db75707"},{url:"/static/images/payment/qr-code-momo.jpg",revision:"63a8b4b719edf183ecbf95e63756b8cd"},{url:"/static/images/payment/qr-code-vietcombank.jpg",revision:"be7775f543605ea3e4338c5b89a03089"},{url:"/static/images/undraw_page_not_found_su7k.svg",revision:"6695af9986412e75985538255ca87866"},{url:"/static/logo.svg",revision:"27654955f82044d361ddcbe8d168cdaf"},{url:"/static/thumbnail.png",revision:"ecc4acc3919eae77d450c0f78afad457"},{url:"/vercel.svg",revision:"26bf2d0adaf1028a4d4c6ee77005e819"}],{ignoreURLParametersMatching:[]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:s,response:e,event:t,state:n})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;const e=s.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;return!s.pathname.startsWith("/api/")}),new s.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>!(self.origin===s.origin)),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
