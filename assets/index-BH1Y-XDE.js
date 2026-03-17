(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(e){if(e.ep)return;e.ep=!0;const i=s(e);fetch(e.href,i)}})();const nt="focusflow",at=1;let E=null;function v(){return new Promise((t,n)=>{if(E)return t(E);const s=indexedDB.open(nt,at);s.onupgradeneeded=a=>{const e=a.target.result;if(e.objectStoreNames.contains("tasks")||e.createObjectStore("tasks",{keyPath:"id"}).createIndex("category","category",{unique:!1}),!e.objectStoreNames.contains("subtasks")){const i=e.createObjectStore("subtasks",{keyPath:"id"});i.createIndex("taskId","taskId",{unique:!1}),i.createIndex("status","status",{unique:!1})}e.objectStoreNames.contains("appState")||e.createObjectStore("appState",{keyPath:"key"})},s.onsuccess=a=>{E=a.target.result,t(E)},s.onerror=a=>n(a.target.error)})}function h(t,n="readonly"){return E.transaction(t,n).objectStore(t)}function g(t){return new Promise((n,s)=>{t.onsuccess=()=>n(t.result),t.onerror=()=>s(t.error)})}async function R(t){return await v(),g(h("tasks","readwrite").put(t))}async function it(t){return await v(),g(h("tasks").get(t))}async function D(){return await v(),g(h("tasks").getAll())}async function W(t){await v();const n=await k(t),s=h("subtasks","readwrite");for(const a of n)s.delete(a.id);return g(h("tasks","readwrite").delete(t))}async function q(t){return R(t)}async function S(t){return await v(),g(h("subtasks","readwrite").put(t))}async function ot(t){return await v(),g(h("subtasks").get(t))}async function k(t){await v();const n=h("subtasks").index("taskId");return g(n.getAll(t))}async function rt(t){return S(t)}async function B(t){return await v(),g(h("subtasks","readwrite").delete(t))}async function I(t){await v();const n=await g(h("appState").get(t));return n?n.value:null}async function x(t,n){return await v(),g(h("appState","readwrite").put({key:t,value:n}))}const _=Object.freeze(Object.defineProperty({__proto__:null,addSubtask:S,addTask:R,deleteSubtask:B,deleteTask:W,getAllTasks:D,getState:I,getSubtask:ot,getSubtasksByTask:k,getTask:it,openDB:v,setState:x,updateSubtask:rt,updateTask:q},Symbol.toStringTag,{value:"Module"})),ct="modulepreload",dt=function(t){return"/focusflow/"+t},G={},V=function(n,s,a){let e=Promise.resolve();if(s&&s.length>0){let o=function(d){return Promise.all(d.map(l=>Promise.resolve(l).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));e=o(s.map(d=>{if(d=dt(d),d in G)return;G[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":ct,l||(u.as="script"),u.crossOrigin="",u.href=d,c&&u.setAttribute("nonce",c),document.head.appendChild(u),l)return new Promise((m,T)=>{u.addEventListener("load",m),u.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return e.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return n().catch(i)})};let lt=0;function J(){return Date.now().toString(36)+"-"+(++lt).toString(36)+"-"+Math.random().toString(36).slice(2,7)}function ut(t,n,s=null){return{id:J(),title:t.trim(),category:n,intervalDays:s,createdAt:Date.now(),completedDates:[],lastScheduledDate:null,active:!0}}function Q(t,n,s,a,e=0){return{id:J(),taskId:t,title:n.trim(),estimatedMinutes:s,priority:a,order:e,status:"pending",completedAt:null,addedTimeMinutes:0}}const K={daily:t=>[{t:`Set up & prepare to start: ${t}`,min:5,p:3},{t:`Focus on the main work: ${t}`,min:20,p:5},{t:`Wrap up & quick review of: ${t}`,min:5,p:4}],periodic:t=>[{t:`Recall where you left off & review progress on: ${t}`,min:5,p:3},{t:`Do the core work session: ${t}`,min:20,p:5},{t:`Document progress & set reminders for next time: ${t}`,min:5,p:4}],oneoff:t=>[{t:`Research & figure out the approach for: ${t}`,min:10,p:3},{t:`Execute the main action: ${t}`,min:20,p:5},{t:`Verify completion & do any follow-ups for: ${t}`,min:10,p:4}],new:t=>[{t:`Understand requirements & ask clarifying questions about: ${t}`,min:10,p:3},{t:`Create first draft / initial attempt: ${t}`,min:20,p:5},{t:`Review your work & refine: ${t}`,min:10,p:4}]};function z(t){return console.warn("Using fallback breakdown for:",t.title),(K[t.category]||K.daily)(t.title).map((a,e)=>Q(t.id,a.t,a.min,a.p,e))}async function M(t){const n=await I("geminiApiKey");if(!n)return z(t);const s=`
You are a productivity expert who breaks down tasks into highly specific, bite-sized, actionable steps to prevent procrastination.
I need to do this task: "${t.title}".
The task is categorized as a "${t.category}" task.

Break this task down into a complete chronological checklist from start to finish.
Rules:
1. Generate as many steps as needed to fully complete the task (usually 3 to 10 steps).
2. Each step MUST start with an action verb and be extremely specific.
3. Assign a reasonable estimated time in minutes (min) for each step (between 2 and 45 mins).
4. Assign a priority from 1 to 5 for each step (5 is highest/core focus, 1 is low/cleanup).
5. Output ONLY a valid JSON array of objects. No markdown formatting, no backticks, no text outside the array.

Example JSON output format:
[
  { "t": "Actionable step description here", "min": 10, "p": 3 },
  { "t": "Next actionable step", "min": 25, "p": 5 }
]
  `.trim();try{const a=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:s}]}],generationConfig:{temperature:.2,responseMimeType:"application/json"}})});if(!a.ok)throw new Error(`API Error: ${a.status}`);const i=(await a.json()).candidates[0].content.parts[0].text;let o=JSON.parse(i);if(!Array.isArray(o)||o.length===0)throw new Error("Invalid format from API");return o.map((r,c)=>{const d=r.t||r.title||r.task||`Step ${c+1} for ${t.title}`,l=parseInt(r.min||r.minutes||r.time)||15,p=parseInt(r.p||r.priority)||3;return Q(t.id,d,l,p,c)})}catch(a){return console.error("Gemini API Breakdown failed:",a),z(t)}}function pt(t){const n=Date.now(),s=new Date().getHours(),a=t.map(e=>{let i=0;if(i+=({new:5,oneoff:4,daily:3,periodic:2}[e.category]||2)*6,e.category==="periodic"&&e.intervalDays){const d=e.completedDates.length>0?new Date(e.completedDates[e.completedDates.length-1]).getTime():e.createdAt,p=(n-d)/(1e3*60*60*24)/e.intervalDays;i+=Math.min(p*12.5,25)}else if(e.category==="daily"){const d=new Date().toISOString().slice(0,10);e.completedDates.includes(d)||(i+=20)}else if(e.category==="new"){const d=(n-e.createdAt)/36e5;i+=Math.min(d*2,25)}s>=6&&s<=14&&(i+=10);const c=(n-e.createdAt)/(1e3*60*60*24);return i+=Math.max(10-c*2,0),{task:e,score:i}});return a.sort((e,i)=>i.score-e.score),a.map(e=>e.task)}function mt(t){return t.filter(s=>s.status!=="done").sort((s,a)=>s.order-a.order).slice(0,3)}function X(){return new Date().toISOString().slice(0,10)}async function vt(){const t=await I("lastActiveDate"),n=X();return t===n?!1:(await ft(n),await x("lastActiveDate",n),!0)}async function ft(t){const n=await D();for(const s of n)if(s.active)switch(s.category){case"daily":{const a=await k(s.id);for(const i of a)i.status==="done"?await B(i.id):await B(i.id);const e=M(s);for(const i of e)await S(i);break}case"periodic":{const a=s.completedDates.length>0?s.completedDates[s.completedDates.length-1]:null;let e=!1;if(!a)e=!0;else{const i=new Date(a);e=Math.floor((new Date(t)-i)/(1e3*60*60*24))>=(s.intervalDays||1)}if(e&&s.lastScheduledDate!==t){const i=await k(s.id);for(const r of i)await B(r.id);const o=M(s);for(const r of o)await S(r);s.lastScheduledDate=t,await q(s)}break}case"oneoff":{s.completedDates.includes(t)&&(s.active=!1,await q(s));break}case"new":{if((await k(s.id)).length===0){const e=M(s);for(const i of e)await S(i)}break}}}async function H(){const n=(await D()).filter(r=>r.active);if(n.length===0)return{subtasks:[],task:null};const s=pt(n);let a=await I("currentFocusTaskIndex")||0;a>=s.length&&(a=0,await x("currentFocusTaskIndex",0));const e=s[a],i=await k(e.id),o=mt(i);return o.length===0&&s.length>1?await Z():{subtasks:o,task:e}}async function Z(){const n=(await D()).filter(a=>a.active);if(n.length<=1)return await H();let s=await I("currentFocusTaskIndex")||0;return s=(s+1)%n.length,await x("currentFocusTaskIndex",s),await H()}async function F(t){const{getSubtask:n,updateSubtask:s}=await V(async()=>{const{getSubtask:o,updateSubtask:r}=await Promise.resolve().then(()=>_);return{getSubtask:o,updateSubtask:r}},void 0),a=await n(t);if(!a)return;a.status="done",a.completedAt=Date.now(),await s(a);const i=(await k(a.taskId)).every(o=>o.status==="done");if(i){const{getTask:o,updateTask:r}=await V(async()=>{const{getTask:d,updateTask:l}=await Promise.resolve().then(()=>_);return{getTask:d,updateTask:l}},void 0),c=await o(a.taskId);c&&(c.completedDates.push(X()),c.category==="oneoff"&&(c.active=!1),await r(c))}return i}const tt={};let L=null;function A(t,n){tt[t]=n}function yt(t){window.location.hash=t}function ht(t="#dashboard"){const n=()=>{const s=window.location.hash||t,a=tt[s];a&&(L&&L.cleanup&&L.cleanup(),L=a())};window.addEventListener("hashchange",n),window.location.hash?n():window.location.hash=t}let C=!1;async function gt(){return"Notification"in window?Notification.permission==="granted"?(C=!0,!0):Notification.permission!=="denied"?(C=await Notification.requestPermission()==="granted",C):!1:!1}function bt(t,n){C&&document.hidden&&new Notification(t,{body:n,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",vibrate:[200,100,200]}),y(t,n)}function y(t,n,s=4e3){const a=document.getElementById("toast-container");if(!a)return;const e=document.createElement("div");e.className="toast",e.innerHTML=`
    <div class="toast-title">${t}</div>
    ${n?`<div class="toast-body">${n}</div>`:""}
  `,a.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast-show")),setTimeout(()=>{e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>e.remove(),400)},s)}let b=null,w=0,O=0;function kt(t,n,s,a){w=n*60,O=n*60;const e=document.createElement("div");e.className="timer-overlay",e.id="timer-overlay",e.innerHTML=`
    <div class="timer-container">
      <div class="timer-header">
        <div class="timer-task-title">${s}</div>
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
          ${U(w)}
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
  `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("timer-overlay-show"));let i=!1;const o=document.getElementById("timer-display"),r=document.getElementById("timer-progress-ring"),c=2*Math.PI*88,d=document.getElementById("btn-pause");function l(){o&&(o.textContent=U(w));const f=1-w/O,$=c*f;r&&(r.style.strokeDashoffset=$)}function p(){i||(w--,l(),w<=0&&(clearInterval(b),b=null,u()))}function u(){bt("⏰ Time's Up!",`Timer for "${s}" has ended.`),"vibrate"in navigator&&navigator.vibrate([200,100,200,100,200]),document.querySelector(".timer-controls").style.display="none",document.getElementById("timeup-panel").style.display="block"}function m(f){w+=f*60,O+=f*60,document.getElementById("timeup-panel").style.display="none",document.querySelector(".timer-controls").style.display="flex",l(),b||(b=setInterval(p,1e3)),y("⏱️ Time Added",`+${f} minutes added`)}function T(f){b&&(clearInterval(b),b=null),e.classList.remove("timer-overlay-show"),e.classList.add("timer-overlay-hide"),setTimeout(()=>{e.remove(),a&&a()},400)}b=setInterval(p,1e3),d.addEventListener("click",()=>{i=!i,d.innerHTML=i?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause',d.classList.toggle("btn-resume",i)}),document.getElementById("btn-finish-early").addEventListener("click",async()=>{await F(t),y("✅ Done!","Great focus session!"),T()}),document.getElementById("btn-done-final").addEventListener("click",async()=>{await F(t),y("🎉 Complete!","You crushed it!"),T()}),e.querySelectorAll(".btn-add-time[data-minutes]").forEach(f=>{f.addEventListener("click",()=>{m(parseInt(f.dataset.minutes))})});const N=document.getElementById("random-slider"),st=document.getElementById("random-value");N.addEventListener("input",()=>{st.textContent=`${N.value} min`}),document.getElementById("btn-random-add").addEventListener("click",()=>{const f=parseInt(N.value),$=Math.max(1,Math.floor(Math.random()*f)+1);m($),y("🎲 Random Time",`Added ${$} random minutes!`)})}function U(t){const n=Math.floor(t/60),s=t%60;return`${n.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}let j=null;function wt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,Y(),P(),document.getElementById("btn-refresh").addEventListener("click",async()=>{const n=document.getElementById("btn-refresh");n.disabled=!0;const s=n.querySelector("svg");s.style.animation="spin 1s linear infinite",await Z(),await P(),n.disabled=!1,s.style.animation=""}),j=setInterval(Y,6e4),{cleanup:()=>{j&&clearInterval(j)}}}function Y(){const t=document.getElementById("greeting");if(!t)return;const n=new Date().getHours();let s="Good evening";n>=5&&n<12?s="Good morning":n>=12&&n<17&&(s="Good afternoon");const a=["🔥","💪","⚡","🚀","✨","🎯","💫"],e=a[Math.floor(Math.random()*a.length)];t.textContent=`${s} ${e}`}async function P(){const t=document.getElementById("focus-cards");if(!t)return;const{subtasks:n,task:s}=await H();if(!s||n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;return}const a={daily:"🔄 Daily",periodic:"📅 Periodic",oneoff:"🎯 One-off",new:"⭐ New Task"},e={daily:"cat-daily",periodic:"cat-periodic",oneoff:"cat-oneoff",new:"cat-new"},i=a[s.category];let r=`
    <div class="focused-task-header card-enter">
      <div class="focused-task-meta">
        <span class="category-badge ${e[s.category]}">${i}</span>
        <span class="focus-label">Current Focus</span>
      </div>
      <h3 class="focused-task-title">${s.title}</h3>
    </div>
    <div class="subtasks-container">
  `;r+=n.map((c,d)=>{const l=c.priority>=4?"High":c.priority>=3?"Medium":"Low",p=c.priority>=4?"priority-high":c.priority>=3?"priority-med":"priority-low";return`
      <div class="focus-card card-enter" style="animation-delay: ${d*.1}s" data-subtask-id="${c.id}">
        <div class="focus-card-header">
          <span class="step-badge">Step ${c.order+1}</span>
          <span class="priority-badge ${p}">${l}</span>
        </div>
        <div class="focus-card-title" style="font-size: 14px; margin-bottom: 10px;">${c.title}</div>
        <div class="focus-card-footer">
          <div class="time-estimate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${c.estimatedMinutes} min
          </div>
          <div class="focus-card-actions">
            <button class="btn btn-sm btn-start" data-id="${c.id}" data-minutes="${c.estimatedMinutes}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start
            </button>
            <button class="btn btn-sm btn-done" data-id="${c.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </button>
          </div>
        </div>
      </div>
    `}).join(""),r+="</div>",t.innerHTML=r,t.querySelectorAll(".btn-start").forEach(c=>{c.addEventListener("click",d=>{const l=d.currentTarget.dataset.id,p=parseInt(d.currentTarget.dataset.minutes),u=n.find(m=>m.id===l);Tt(l,p,u?u.title:"Task")})}),t.querySelectorAll(".btn-done").forEach(c=>{c.addEventListener("click",async d=>{const l=d.currentTarget.dataset.id;d.currentTarget.closest(".focus-card").classList.add("card-complete"),setTimeout(async()=>{await F(l)?y("🎉 Task Complete!","All subtasks for this task are done!"):y("✅ Subtask Done!","Great work! Keep going!"),P()},500)})})}function Tt(t,n,s){kt(t,n,s,()=>{P()})}function St(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;let n="daily";const s=document.getElementById("add-task-form"),a=document.getElementById("interval-group"),e=document.getElementById("interval-days");return document.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".category-btn").forEach(o=>o.classList.remove("active")),i.classList.add("active"),n=i.dataset.cat,a.style.display=n==="periodic"?"block":"none"})}),document.getElementById("interval-dec").addEventListener("click",()=>{e.value=Math.max(2,parseInt(e.value)-1)}),document.getElementById("interval-inc").addEventListener("click",()=>{e.value=Math.min(365,parseInt(e.value)+1)}),s.addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("task-title").value.trim();if(!o)return;const r=n==="periodic"?parseInt(e.value):null,c=ut(o,n,r);await R(c);const d=M(c);for(const u of d)await S(u);s.style.display="none";const l=document.getElementById("breakdown-preview");l.style.display="block";const p=document.getElementById("subtask-list");p.innerHTML=d.map((u,m)=>`
      <div class="subtask-preview-card card-enter" style="animation-delay: ${m*.15}s">
        <div class="subtask-preview-num">${m+1}</div>
        <div class="subtask-preview-content">
          <div class="subtask-preview-title">${u.title}</div>
          <div class="subtask-preview-meta">
            <span class="time-estimate">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${u.estimatedMinutes} min
            </span>
            <span class="priority-badge ${u.priority>=4?"priority-high":u.priority>=3?"priority-med":"priority-low"}">
              ${u.priority>=4?"High":u.priority>=3?"Medium":"Low"}
            </span>
          </div>
        </div>
      </div>
    `).join(""),y("✅ Task Added!",`"${o}" has been broken into ${d.length} subtasks`),document.getElementById("btn-go-dashboard").addEventListener("click",()=>{yt("#dashboard")})}),{cleanup:()=>{}}}function xt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,et(),{cleanup:()=>{}}}async function et(){const t=document.getElementById("task-list-content");if(!t)return;const n=await D(),s=n.filter(o=>o.active);if(s.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;return}const a=[{key:"daily",label:"🔄 Daily Tasks",cls:"cat-daily"},{key:"periodic",label:"📅 Periodic Tasks",cls:"cat-periodic"},{key:"oneoff",label:"🎯 One-off Tasks",cls:"cat-oneoff"},{key:"new",label:"⭐ New Tasks",cls:"cat-new"}];let e="";for(const o of a){const r=s.filter(c=>c.category===o.key);if(r.length!==0){e+=`
      <div class="task-category-section">
        <div class="category-header ${o.cls}">
          <span>${o.label}</span>
          <span class="task-count">${r.length}</span>
        </div>
        <div class="task-items">
    `;for(const c of r){const d=await k(c.id),l=d.filter(T=>T.status==="done").length,p=d.length,u=p>0?Math.round(l/p*100):0;let m="";c.category==="periodic"&&c.intervalDays?m=`Every ${c.intervalDays} days`:c.completedDates.length>0&&(m=`Done ${c.completedDates.length} time${c.completedDates.length>1?"s":""}`),e+=`
        <div class="task-item card-enter" data-task-id="${c.id}">
          <div class="task-item-content">
            <div class="task-item-title">${c.title}</div>
            ${m?`<div class="task-item-meta">${m}</div>`:""}
            <div class="task-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${u}%"></div>
              </div>
              <span class="progress-text">${l}/${p} subtasks</span>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${c.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `}e+="</div></div>"}}const i=n.filter(o=>!o.active);i.length>0&&(e+=`
      <div class="task-category-section">
        <div class="category-header cat-done">
          <span>✅ Completed</span>
          <span class="task-count">${i.length}</span>
        </div>
        <div class="task-items">
          ${i.map(o=>`
            <div class="task-item task-item-completed">
              <div class="task-item-content">
                <div class="task-item-title">${o.title}</div>
                <div class="task-item-meta">Completed</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `),t.innerHTML=e,t.querySelectorAll(".btn-delete").forEach(o=>{o.addEventListener("click",async r=>{const c=r.currentTarget.dataset.taskId,d=r.currentTarget.closest(".task-item");confirm("Delete this task and all its subtasks?")&&(d.classList.add("card-exit"),setTimeout(async()=>{await W(c),y("🗑️ Deleted","Task removed"),et()},300))})})}function It(){const t=document.getElementById("app-content");t.innerHTML=`
    <div class="settings-view">
      <div class="view-header">
        <h2>Settings</h2>
        <p class="view-subtitle">Configure your intelligent assistant</p>
      </div>

      <div class="settings-card card-enter">
        <div class="settings-icon">🤖</div>
        <h3>Gemini AI Setup</h3>
        <p class="settings-desc">FocusFlow uses Google's free Gemini API to intelligently break down your tasks into actionable, specific steps.</p>
        
        <form id="api-key-form">
          <div class="form-group">
            <label for="api-key">Gemini API Key</label>
            <input 
              type="password" 
              id="api-key" 
              class="form-input" 
              placeholder="Paste your API key here..."
              autocomplete="off"
            />
            <p class="help-text">
              Don't have one? Get it for free at <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>.
              Your key is stored <b>only on this device</b> and never sent anywhere else.
            </p>
          </div>
          
          <button type="submit" class="btn btn-primary btn-lg btn-submit">
            Save Key
          </button>
        </form>
      </div>
      
      <div class="settings-card card-enter" style="animation-delay: 0.1s; margin-top: 20px;">
        <h3>About FocusFlow</h3>
        <p class="settings-desc">Designed to beat procrastination by turning overwhelming tasks into tiny, focused steps.</p>
        <p class="settings-desc" style="margin-top: 10px; font-size: 12px; opacity: 0.7;">Version 1.1.0 • Built with Vite & PWA</p>
      </div>
    </div>
  `;const n=document.getElementById("api-key-form"),s=document.getElementById("api-key");return I("geminiApiKey").then(a=>{a&&(s.value=a)}),n.addEventListener("submit",async a=>{a.preventDefault();const e=s.value.trim();if(!e){await x("geminiApiKey",null),y("⚠️ Cleared","API Key removed");return}await x("geminiApiKey",e),y("✅ Saved!","Your API Key is securely stored.")}),{cleanup:()=>{}}}async function Et(){const t=document.getElementById("app");t.innerHTML=`
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
        <button class="nav-btn" data-route="#settings" id="nav-settings">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>Settings</span>
        </button>
      </nav>
    </div>
    <div id="toast-container" class="toast-container"></div>
  `,await v(),await vt(),gt(),A("#dashboard",wt),A("#add",St),A("#tasks",xt),A("#settings",It);const n=document.querySelectorAll(".nav-btn");function s(){const a=window.location.hash||"#dashboard";n.forEach(e=>{e.classList.toggle("active",e.dataset.route===a)})}n.forEach(a=>{a.addEventListener("click",()=>{window.location.hash=a.dataset.route})}),window.addEventListener("hashchange",s),ht("#dashboard"),s()}Et().catch(console.error);
