// offline: network first, fall back to the last cached copy
const C='todo-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  const key=u.origin+u.pathname;
  e.respondWith(fetch(r.url,{cache:'no-store'}).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key,cp))}
    return res;
  }).catch(()=>caches.match(key).then(m=>m||caches.match(u.origin+u.pathname.replace(/[^/]*$/,'')))))
});
