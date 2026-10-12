const V='wlp-v2';
const FILES=['./','index.html','manifest.webmanifest','pdf.min.js','pdf.worker.min.js','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 const page=e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/');
 if(page){
  // Netzwerk zuerst (immer neueste Version), Cache nur offline
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put('index.html',cp))}return r}).catch(()=>caches.match('index.html').then(h=>h||caches.match('./'))));
  return;
 }
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok&&u.origin===location.origin){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r})));
});
