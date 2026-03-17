(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();const tt="focusflow",et=1;let D=null;function v(){return new Promise((t,s)=>{if(D)return t(D);const n=indexedDB.open(tt,et);n.onupgradeneeded=i=>{const e=i.target.result;if(e.objectStoreNames.contains("tasks")||e.createObjectStore("tasks",{keyPath:"id"}).createIndex("category","category",{unique:!1}),!e.objectStoreNames.contains("subtasks")){const o=e.createObjectStore("subtasks",{keyPath:"id"});o.createIndex("taskId","taskId",{unique:!1}),o.createIndex("status","status",{unique:!1})}e.objectStoreNames.contains("appState")||e.createObjectStore("appState",{keyPath:"key"})},n.onsuccess=i=>{D=i.target.result,t(D)},n.onerror=i=>s(i.target.error)})}function y(t,s="readonly"){return D.transaction(t,s).objectStore(t)}function h(t){return new Promise((s,n)=>{t.onsuccess=()=>s(t.result),t.onerror=()=>n(t.error)})}async function R(t){return await v(),h(y("tasks","readwrite").put(t))}async function st(t){return await v(),h(y("tasks").get(t))}async function C(){return await v(),h(y("tasks").getAll())}async function U(t){await v();const s=await $(t),n=y("subtasks","readwrite");for(const i of s)n.delete(i.id);return h(y("tasks","readwrite").delete(t))}async function q(t){return R(t)}async function E(t){return await v(),h(y("subtasks","readwrite").put(t))}async function nt(t){return await v(),h(y("subtasks").get(t))}async function W(){return await v(),h(y("subtasks").getAll())}async function $(t){await v();const s=y("subtasks").index("taskId");return h(s.getAll(t))}async function at(t){return E(t)}async function L(t){return await v(),h(y("subtasks","readwrite").delete(t))}async function K(t){await v();const s=await h(y("appState").get(t));return s?s.value:null}async function Y(t,s){return await v(),h(y("appState","readwrite").put({key:t,value:s}))}const _=Object.freeze(Object.defineProperty({__proto__:null,addSubtask:E,addTask:R,deleteSubtask:L,deleteTask:U,getAllSubtasks:W,getAllTasks:C,getState:K,getSubtask:nt,getSubtasksByTask:$,getTask:st,openDB:v,setState:Y,updateSubtask:at,updateTask:q},Symbol.toStringTag,{value:"Module"})),it="modulepreload",ot=function(t){return"/focusflow/"+t},H={},G=function(s,n,i){let e=Promise.resolve();if(n&&n.length>0){let a=function(p){return Promise.all(p.map(c=>Promise.resolve(c).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));e=a(n.map(p=>{if(p=ot(p),p in H)return;H[p]=!0;const c=p.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${u}`))return;const l=document.createElement("link");if(l.rel=c?"stylesheet":it,c||(l.as="script"),l.crossOrigin="",l.href=p,d&&l.setAttribute("nonce",d),document.head.appendChild(l),c)return new Promise((m,b)=>{l.addEventListener("load",m),l.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${p}`)))})}))}function o(a){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=a,window.dispatchEvent(r),!r.defaultPrevented)throw a}return e.then(a=>{for(const r of a||[])r.status==="rejected"&&o(r.reason);return s().catch(o)})};let rt=0;function J(){return Date.now().toString(36)+"-"+(++rt).toString(36)+"-"+Math.random().toString(36).slice(2,7)}function ct(t,s,n=null){return{id:J(),title:t.trim(),category:s,intervalDays:n,createdAt:Date.now(),completedDates:[],lastScheduledDate:null,active:!0}}function dt(t,s,n,i,e=0){return{id:J(),taskId:t,title:s.trim(),estimatedMinutes:n,priority:i,order:e,status:"pending",completedAt:null,addedTimeMinutes:0}}const lt={study:{keywords:["study","learn","read","research","review","revise","memorize","understand","course","lecture","chapter","textbook","exam","test","quiz"],subtasks:t=>[{t:`Gather & open all materials for: ${t}`,min:5},{t:`Focus session — actively study/read the core content of: ${t}`,min:25},{t:`Summarize key takeaways & note 3 things you learned about: ${t}`,min:10}]},write:{keywords:["write","blog","essay","report","article","draft","document","compose","email","proposal","letter","content","post","assignment"],subtasks:t=>[{t:`Create outline with 3-5 key points for: ${t}`,min:10},{t:`Write the first draft (don't edit, just write) for: ${t}`,min:20},{t:`Review, edit, and finalize: ${t}`,min:15}]},exercise:{keywords:["exercise","workout","gym","run","jog","walk","stretch","yoga","pushup","plank","sport","swim","bike","cycle","fitness","train"],subtasks:t=>[{t:`Warm up (5 min light movement) before: ${t}`,min:5},{t:`Main session — do the core workout: ${t}`,min:20},{t:`Cool down & stretch after: ${t}`,min:5}]},clean:{keywords:["clean","tidy","organize","declutter","sweep","mop","vacuum","wash","laundry","dishes","dust","scrub","room","desk"],subtasks:t=>[{t:`Clear and sort items (remove trash/clutter) for: ${t}`,min:10},{t:`Deep clean the main area: ${t}`,min:15},{t:`Put everything back in place & quick final check: ${t}`,min:5}]},code:{keywords:["code","program","develop","build","implement","debug","fix","deploy","feature","api","frontend","backend","app","software","website","script","automate"],subtasks:t=>[{t:`Plan approach & identify the specific files/components for: ${t}`,min:10},{t:`Implement the core logic/changes for: ${t}`,min:25},{t:`Test, review & commit changes for: ${t}`,min:10}]},cook:{keywords:["cook","meal","recipe","food","dinner","lunch","breakfast","bake","prepare","kitchen","grocery","ingredients"],subtasks:t=>[{t:`Gather & prep all ingredients for: ${t}`,min:10},{t:`Cook the main dish: ${t}`,min:20},{t:`Plate & clean up the kitchen after: ${t}`,min:10}]},meeting:{keywords:["meeting","presentation","present","pitch","call","standup","sync","discuss","agenda","slide","demo"],subtasks:t=>[{t:`Prepare agenda/notes/slides for: ${t}`,min:15},{t:`Rehearse key points (practice out loud) for: ${t}`,min:10},{t:`Final review & set up environment for: ${t}`,min:5}]},shop:{keywords:["buy","shop","purchase","order","get","pick up","shopping","store","market"],subtasks:t=>[{t:`Make a specific list of what to buy for: ${t}`,min:5},{t:`Go and purchase items: ${t}`,min:20},{t:`Sort, organize, and put away what you bought: ${t}`,min:10}]},plan:{keywords:["plan","schedule","arrange","budget","goal","strategy","roadmap","brainstorm","decide","think about"],subtasks:t=>[{t:`Brainstorm all options/ideas for: ${t}`,min:10},{t:`Evaluate and narrow down to top 3 choices: ${t}`,min:10},{t:`Make final decision & write down action steps for: ${t}`,min:10}]}},F={daily:t=>[{t:`Set up & prepare to start: ${t}`,min:5},{t:`Focus on the main work: ${t}`,min:20},{t:`Wrap up & quick review of: ${t}`,min:5}],periodic:t=>[{t:`Recall where you left off & review progress on: ${t}`,min:5},{t:`Do the core work session: ${t}`,min:20},{t:`Document progress & set reminders for next time: ${t}`,min:5}],oneoff:t=>[{t:`Research & figure out the approach for: ${t}`,min:10},{t:`Execute the main action: ${t}`,min:20},{t:`Verify completion & do any follow-ups for: ${t}`,min:10}],new:t=>[{t:`Understand requirements & ask clarifying questions about: ${t}`,min:10},{t:`Create first draft / initial attempt: ${t}`,min:20},{t:`Review your work & refine: ${t}`,min:10}]};function M(t){const s=t.title.toLowerCase();let n=null,i=0;for(const[,a]of Object.entries(lt)){const r=a.keywords.reduce((d,p)=>d+(s.includes(p)?1:0),0);r>i&&(i=r,n=a)}let e;n&&i>0?e=n.subtasks(t.title):e=(F[t.category]||F.daily)(t.title);const o=[3,5,4];return e.map((a,r)=>dt(t.id,a.t,a.min,o[r],r))}function ut(t,s){const n=t.filter(c=>c.status==="pending"||c.status==="active");if(n.length<=3)return n;const i={};for(const c of s)i[c.id]=c;const e=Date.now(),o=new Date().getHours(),a=n.map(c=>{const u=i[c.taskId];if(!u)return{sub:c,score:0};let l=0;if(l+=({new:5,oneoff:4,daily:3,periodic:2}[u.category]||2)*6,u.category==="periodic"&&u.intervalDays){const w=u.completedDates.length>0?new Date(u.completedDates[u.completedDates.length-1]).getTime():u.createdAt,T=(e-w)/(1e3*60*60*24)/u.intervalDays;l+=Math.min(T*12.5,25)}else if(u.category==="daily"){const w=new Date().toISOString().slice(0,10);u.completedDates.includes(w)||(l+=20)}else if(u.category==="new"){const w=(e-u.createdAt)/36e5;l+=Math.min(w*2,25)}c.estimatedMinutes>=20?o>=6&&o<=14?l+=15:o>=15&&o<=18?l+=8:l+=3:l+=10;const x=(e-u.createdAt)/(1e3*60*60*24);return l+=Math.max(15-x*2,0),c.order===0?l+=2:c.order===1?l+=5:l+=1,l+=c.priority*2,{sub:c,score:l,category:u.category}});a.sort((c,u)=>u.score-c.score);const r=[],d=new Set,p=new Set;for(const c of a){if(r.length>=3)break;d.has(c.sub.taskId)||(r.push(c.sub),d.add(c.sub.taskId),p.add(c.category))}if(r.length<3)for(const c of a){if(r.length>=3)break;r.includes(c.sub)||r.push(c.sub)}return r}function pt(t){if(t.length<=1)return t;const s=[...t];for(let n=s.length-1;n>0;n--)if(Math.random()<.4){const i=Math.floor(Math.random()*(n+1));[s[n],s[i]]=[s[i],s[n]]}return s}function Q(){return new Date().toISOString().slice(0,10)}async function mt(){const t=await K("lastActiveDate"),s=Q();return t===s?!1:(await ft(s),await Y("lastActiveDate",s),!0)}async function ft(t){const s=await C();for(const n of s)if(n.active)switch(n.category){case"daily":{const i=await $(n.id);for(const o of i)o.status==="done"?await L(o.id):await L(o.id);const e=M(n);for(const o of e)await E(o);break}case"periodic":{const i=n.completedDates.length>0?n.completedDates[n.completedDates.length-1]:null;let e=!1;if(!i)e=!0;else{const o=new Date(i);e=Math.floor((new Date(t)-o)/(1e3*60*60*24))>=(n.intervalDays||1)}if(e&&n.lastScheduledDate!==t){const o=await $(n.id);for(const r of o)await L(r.id);const a=M(n);for(const r of a)await E(r);n.lastScheduledDate=t,await q(n)}break}case"oneoff":{n.completedDates.includes(t)&&(n.active=!1,await q(n));break}case"new":{if((await $(n.id)).length===0){const e=M(n);for(const o of e)await E(o)}break}}}async function vt(){const s=(await C()).filter(o=>o.active),i=(await W()).filter(o=>o.status!=="done");let e=ut(i,s);return e=pt(e),{subtasks:e,tasks:s}}async function O(t){const{getSubtask:s,updateSubtask:n}=await G(async()=>{const{getSubtask:a,updateSubtask:r}=await Promise.resolve().then(()=>_);return{getSubtask:a,updateSubtask:r}},void 0),i=await s(t);if(!i)return;i.status="done",i.completedAt=Date.now(),await n(i);const o=(await $(i.taskId)).every(a=>a.status==="done");if(o){const{getTask:a,updateTask:r}=await G(async()=>{const{getTask:p,updateTask:c}=await Promise.resolve().then(()=>_);return{getTask:p,updateTask:c}},void 0),d=await a(i.taskId);d&&(d.completedDates.push(Q()),d.category==="oneoff"&&(d.active=!1),await r(d))}return o}const X={};let I=null;function P(t,s){X[t]=s}function yt(t){window.location.hash=t}function ht(t="#dashboard"){const s=()=>{const n=window.location.hash||t,i=X[n];i&&(I&&I.cleanup&&I.cleanup(),I=i())};window.addEventListener("hashchange",s),window.location.hash?s():window.location.hash=t}let B=!1;async function gt(){return"Notification"in window?Notification.permission==="granted"?(B=!0,!0):Notification.permission!=="denied"?(B=await Notification.requestPermission()==="granted",B):!1:!1}function kt(t,s){B&&document.hidden&&new Notification(t,{body:s,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",vibrate:[200,100,200]}),g(t,s)}function g(t,s,n=4e3){const i=document.getElementById("toast-container");if(!i)return;const e=document.createElement("div");e.className="toast",e.innerHTML=`
    <div class="toast-title">${t}</div>
    ${s?`<div class="toast-body">${s}</div>`:""}
  `,i.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast-show")),setTimeout(()=>{e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>e.remove(),400)},n)}let k=null,S=0,j=0;function bt(t,s,n,i){S=s*60,j=s*60;const e=document.createElement("div");e.className="timer-overlay",e.id="timer-overlay",e.innerHTML=`
    <div class="timer-container">
      <div class="timer-header">
        <div class="timer-task-title">${n}</div>
      </div>

      <div class="timer-ring-wrap">
        <svg class="timer-ring" viewBox="0 0 200 200">
          <circle class="timer-ring-bg" cx="100" cy="100" r="88" />
          <circle class="timer-ring-progress" cx="100" cy="100" r="88" 
            stroke-dasharray="${2*Math.PI*88}" 
            stroke-dashoffset="0" 
            id="timer-progress-ring" />
        </svg>
        <div class="timer-display" id="timer-display">
          ${z(S)}
        </div>
      </div>

      <div class="timer-controls">
        <button class="btn btn-timer btn-pause" id="btn-pause">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          Pause
        </button>
        <button class="btn btn-timer btn-finish-early" id="btn-finish-early">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          I'm Done!
        </button>
      </div>

      <!-- Time's up panel (hidden initially) -->
      <div class="timeup-panel" id="timeup-panel" style="display:none;">
        <div class="timeup-icon">⏰</div>
        <h3>Time's Up!</h3>
        <p>Are you finished, or need more time?</p>
        
        <button class="btn btn-primary btn-lg btn-done-final" id="btn-done-final">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          I'm Done! ✓
        </button>

        <div class="add-time-section">
          <p class="add-time-label">Need more time?</p>
          <div class="add-time-buttons">
            <button class="btn btn-add-time" data-minutes="3">+3 min</button>
            <button class="btn btn-add-time" data-minutes="5">+5 min</button>
            <button class="btn btn-add-time" data-minutes="10">+10 min</button>
          </div>
          <div class="random-time-section">
            <label class="add-time-label">Or pick random minutes:</label>
            <div class="random-time-controls">
              <input type="range" id="random-slider" class="random-slider" min="1" max="30" value="7" />
              <span class="random-value" id="random-value">7 min</span>
            </div>
            <button class="btn btn-add-time btn-random-add" id="btn-random-add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              Add Random Time
            </button>
          </div>
        </div>
      </div>
    </div>
  `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("timer-overlay-show"));let o=!1;const a=document.getElementById("timer-display"),r=document.getElementById("timer-progress-ring"),d=2*Math.PI*88,p=document.getElementById("btn-pause");function c(){a&&(a.textContent=z(S));const f=1-S/j,T=d*f;r&&(r.style.strokeDashoffset=T)}function u(){o||(S--,c(),S<=0&&(clearInterval(k),k=null,l()))}function l(){kt("⏰ Time's Up!",`Timer for "${n}" has ended.`),"vibrate"in navigator&&navigator.vibrate([200,100,200,100,200]),document.querySelector(".timer-controls").style.display="none",document.getElementById("timeup-panel").style.display="block"}function m(f){S+=f*60,j+=f*60,document.getElementById("timeup-panel").style.display="none",document.querySelector(".timer-controls").style.display="flex",c(),k||(k=setInterval(u,1e3)),g("⏱️ Time Added",`+${f} minutes added`)}function b(f){k&&(clearInterval(k),k=null),e.classList.remove("timer-overlay-show"),e.classList.add("timer-overlay-hide"),setTimeout(()=>{e.remove(),i&&i()},400)}k=setInterval(u,1e3),p.addEventListener("click",()=>{o=!o,p.innerHTML=o?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause',p.classList.toggle("btn-resume",o)}),document.getElementById("btn-finish-early").addEventListener("click",async()=>{await O(t),g("✅ Done!","Great focus session!"),b()}),document.getElementById("btn-done-final").addEventListener("click",async()=>{await O(t),g("🎉 Complete!","You crushed it!"),b()}),e.querySelectorAll(".btn-add-time[data-minutes]").forEach(f=>{f.addEventListener("click",()=>{m(parseInt(f.dataset.minutes))})});const x=document.getElementById("random-slider"),w=document.getElementById("random-value");x.addEventListener("input",()=>{w.textContent=`${x.value} min`}),document.getElementById("btn-random-add").addEventListener("click",()=>{const f=parseInt(x.value),T=Math.max(1,Math.floor(Math.random()*f)+1);m(T),g("🎲 Random Time",`Added ${T} random minutes!`)})}function z(t){const s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}let N=null;function wt(){const t=document.getElementById("app-content");return t.innerHTML=`
    <div class="dashboard">
      <div class="dashboard-header">
        <div class="greeting" id="greeting"></div>
        <p class="dashboard-subtitle">Here's what to focus on right now</p>
      </div>
      <div class="focus-cards" id="focus-cards">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Preparing your tasks...</p>
        </div>
      </div>
      <div class="dashboard-footer">
        <button class="btn btn-outline btn-refresh" id="btn-refresh">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
          Shuffle Tasks
        </button>
      </div>
    </div>
  `,V(),A(),document.getElementById("btn-refresh").addEventListener("click",A),N=setInterval(V,6e4),{cleanup:()=>{N&&clearInterval(N)}}}function V(){const t=document.getElementById("greeting");if(!t)return;const s=new Date().getHours();let n="Good evening";s>=5&&s<12?n="Good morning":s>=12&&s<17&&(n="Good afternoon");const i=["🔥","💪","⚡","🚀","✨","🎯","💫"],e=i[Math.floor(Math.random()*i.length)];t.textContent=`${n} ${e}`}async function A(){const t=document.getElementById("focus-cards");if(!t)return;const{subtasks:s,tasks:n}=await vt(),i={};for(const a of n)i[a.id]=a;if(s.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;return}const e={daily:"🔄 Daily",periodic:"📅 Periodic",oneoff:"🎯 One-off",new:"⭐ New Task"},o={daily:"cat-daily",periodic:"cat-periodic",oneoff:"cat-oneoff",new:"cat-new"};t.innerHTML=s.map((a,r)=>{const d=i[a.taskId],p=d?e[d.category]:"",c=d?o[d.category]:"",u=a.priority>=4?"High":a.priority>=3?"Medium":"Low",l=a.priority>=4?"priority-high":a.priority>=3?"priority-med":"priority-low";return`
      <div class="focus-card card-enter" style="animation-delay: ${r*.1}s" data-subtask-id="${a.id}">
        <div class="focus-card-header">
          <span class="category-badge ${c}">${p}</span>
          <span class="priority-badge ${l}">${u}</span>
        </div>
        <div class="focus-card-parent">${d?d.title:""}</div>
        <div class="focus-card-title">${a.title}</div>
        <div class="focus-card-footer">
          <div class="time-estimate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${a.estimatedMinutes} min
          </div>
          <div class="focus-card-actions">
            <button class="btn btn-sm btn-start" data-id="${a.id}" data-minutes="${a.estimatedMinutes}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start
            </button>
            <button class="btn btn-sm btn-done" data-id="${a.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </button>
          </div>
        </div>
      </div>
    `}).join(""),t.querySelectorAll(".btn-start").forEach(a=>{a.addEventListener("click",r=>{const d=r.currentTarget.dataset.id,p=parseInt(r.currentTarget.dataset.minutes),c=s.find(u=>u.id===d);St(d,p,c?c.title:"Task")})}),t.querySelectorAll(".btn-done").forEach(a=>{a.addEventListener("click",async r=>{const d=r.currentTarget.dataset.id;r.currentTarget.closest(".focus-card").classList.add("card-complete"),setTimeout(async()=>{await O(d)?g("🎉 Task Complete!","All subtasks for this task are done!"):g("✅ Subtask Done!","Great work! Keep going!"),A()},500)})})}function St(t,s,n){bt(t,s,n,()=>{A()})}function $t(){const t=document.getElementById("app-content");t.innerHTML=`
    <div class="add-task-view">
      <div class="view-header">
        <h2>Add New Task</h2>
        <p class="view-subtitle">Tell me what you need to do — I'll break it down for you</p>
      </div>

      <form id="add-task-form" class="task-form">
        <div class="form-group">
          <label for="task-title">What do you want to accomplish?</label>
          <input 
            type="text" 
            id="task-title" 
            class="form-input" 
            placeholder="e.g., Study for chemistry exam, Clean the kitchen, Write project report..."
            autocomplete="off"
            required 
          />
        </div>

        <div class="form-group">
          <label>Category</label>
          <div class="category-selector" id="category-selector">
            <button type="button" class="category-btn active" data-cat="daily">
              <span class="cat-icon">🔄</span>
              <span class="cat-label">Daily</span>
              <span class="cat-desc">Every day</span>
            </button>
            <button type="button" class="category-btn" data-cat="periodic">
              <span class="cat-icon">📅</span>
              <span class="cat-label">Periodic</span>
              <span class="cat-desc">Every few days</span>
            </button>
            <button type="button" class="category-btn" data-cat="oneoff">
              <span class="cat-icon">🎯</span>
              <span class="cat-label">One-off</span>
              <span class="cat-desc">Just once</span>
            </button>
            <button type="button" class="category-btn" data-cat="new">
              <span class="cat-icon">⭐</span>
              <span class="cat-label">New Task</span>
              <span class="cat-desc">Work / special</span>
            </button>
          </div>
        </div>

        <div class="form-group interval-group" id="interval-group" style="display:none;">
          <label for="interval-days">Repeat every how many days?</label>
          <div class="interval-input-wrap">
            <button type="button" class="interval-btn" id="interval-dec">−</button>
            <input type="number" id="interval-days" class="form-input interval-input" value="3" min="2" max="365" />
            <button type="button" class="interval-btn" id="interval-inc">+</button>
            <span class="interval-label">days</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg btn-submit" id="btn-submit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Break It Down & Add
        </button>
      </form>

      <div class="breakdown-preview" id="breakdown-preview" style="display:none;">
        <h3>📋 Generated Subtasks</h3>
        <div id="subtask-list"></div>
        <button class="btn btn-primary btn-lg" id="btn-go-dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Let's Go!
        </button>
      </div>
    </div>
  `;let s="daily";const n=document.getElementById("add-task-form"),i=document.getElementById("interval-group"),e=document.getElementById("interval-days");return document.querySelectorAll(".category-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".category-btn").forEach(a=>a.classList.remove("active")),o.classList.add("active"),s=o.dataset.cat,i.style.display=s==="periodic"?"block":"none"})}),document.getElementById("interval-dec").addEventListener("click",()=>{e.value=Math.max(2,parseInt(e.value)-1)}),document.getElementById("interval-inc").addEventListener("click",()=>{e.value=Math.min(365,parseInt(e.value)+1)}),n.addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("task-title").value.trim();if(!a)return;const r=s==="periodic"?parseInt(e.value):null,d=ct(a,s,r);await R(d);const p=M(d);for(const l of p)await E(l);n.style.display="none";const c=document.getElementById("breakdown-preview");c.style.display="block";const u=document.getElementById("subtask-list");u.innerHTML=p.map((l,m)=>`
      <div class="subtask-preview-card card-enter" style="animation-delay: ${m*.15}s">
        <div class="subtask-preview-num">${m+1}</div>
        <div class="subtask-preview-content">
          <div class="subtask-preview-title">${l.title}</div>
          <div class="subtask-preview-meta">
            <span class="time-estimate">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${l.estimatedMinutes} min
            </span>
            <span class="priority-badge ${l.priority>=4?"priority-high":l.priority>=3?"priority-med":"priority-low"}">
              ${l.priority>=4?"High":l.priority>=3?"Medium":"Low"}
            </span>
          </div>
        </div>
      </div>
    `).join(""),g("✅ Task Added!",`"${a}" has been broken into ${p.length} subtasks`),document.getElementById("btn-go-dashboard").addEventListener("click",()=>{yt("#dashboard")})}),{cleanup:()=>{}}}function Tt(){const t=document.getElementById("app-content");return t.innerHTML=`
    <div class="task-list-view">
      <div class="view-header">
        <h2>My Tasks</h2>
        <p class="view-subtitle">All your tasks organized by category</p>
      </div>
      <div id="task-list-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `,Z(),{cleanup:()=>{}}}async function Z(){const t=document.getElementById("task-list-content");if(!t)return;const s=await C(),n=s.filter(a=>a.active);if(n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;return}const i=[{key:"daily",label:"🔄 Daily Tasks",cls:"cat-daily"},{key:"periodic",label:"📅 Periodic Tasks",cls:"cat-periodic"},{key:"oneoff",label:"🎯 One-off Tasks",cls:"cat-oneoff"},{key:"new",label:"⭐ New Tasks",cls:"cat-new"}];let e="";for(const a of i){const r=n.filter(d=>d.category===a.key);if(r.length!==0){e+=`
      <div class="task-category-section">
        <div class="category-header ${a.cls}">
          <span>${a.label}</span>
          <span class="task-count">${r.length}</span>
        </div>
        <div class="task-items">
    `;for(const d of r){const p=await $(d.id),c=p.filter(b=>b.status==="done").length,u=p.length,l=u>0?Math.round(c/u*100):0;let m="";d.category==="periodic"&&d.intervalDays?m=`Every ${d.intervalDays} days`:d.completedDates.length>0&&(m=`Done ${d.completedDates.length} time${d.completedDates.length>1?"s":""}`),e+=`
        <div class="task-item card-enter" data-task-id="${d.id}">
          <div class="task-item-content">
            <div class="task-item-title">${d.title}</div>
            ${m?`<div class="task-item-meta">${m}</div>`:""}
            <div class="task-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${l}%"></div>
              </div>
              <span class="progress-text">${c}/${u} subtasks</span>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${d.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `}e+="</div></div>"}}const o=s.filter(a=>!a.active);o.length>0&&(e+=`
      <div class="task-category-section">
        <div class="category-header cat-done">
          <span>✅ Completed</span>
          <span class="task-count">${o.length}</span>
        </div>
        <div class="task-items">
          ${o.map(a=>`
            <div class="task-item task-item-completed">
              <div class="task-item-content">
                <div class="task-item-title">${a.title}</div>
                <div class="task-item-meta">Completed</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `),t.innerHTML=e,t.querySelectorAll(".btn-delete").forEach(a=>{a.addEventListener("click",async r=>{const d=r.currentTarget.dataset.taskId,p=r.currentTarget.closest(".task-item");confirm("Delete this task and all its subtasks?")&&(p.classList.add("card-exit"),setTimeout(async()=>{await U(d),g("🗑️ Deleted","Task removed"),Z()},300))})})}async function Et(){const t=document.getElementById("app");t.innerHTML=`
    <div class="app-shell">
      <div id="app-content" class="app-content"></div>
      <nav class="bottom-nav" id="bottom-nav">
        <button class="nav-btn" data-route="#dashboard" id="nav-dashboard">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Focus</span>
        </button>
        <button class="nav-btn" data-route="#add" id="nav-add">
          <div class="nav-add-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <span>Add</span>
        </button>
        <button class="nav-btn" data-route="#tasks" id="nav-tasks">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span>Tasks</span>
        </button>
      </nav>
    </div>
    <div id="toast-container" class="toast-container"></div>
  `,await v(),await mt(),gt(),P("#dashboard",wt),P("#add",$t),P("#tasks",Tt);const s=document.querySelectorAll(".nav-btn");function n(){const i=window.location.hash||"#dashboard";s.forEach(e=>{e.classList.toggle("active",e.dataset.route===i)})}s.forEach(i=>{i.addEventListener("click",()=>{window.location.hash=i.dataset.route})}),window.addEventListener("hashchange",n),ht("#dashboard"),n()}Et().catch(console.error);
