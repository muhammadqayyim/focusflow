(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(e){if(e.ep)return;e.ep=!0;const i=n(e);fetch(e.href,i)}})();const st="focusflow",at=1;let D=null;function y(){return new Promise((t,s)=>{if(D)return t(D);const n=indexedDB.open(st,at);n.onupgradeneeded=a=>{const e=a.target.result;if(e.objectStoreNames.contains("tasks")||e.createObjectStore("tasks",{keyPath:"id"}).createIndex("category","category",{unique:!1}),!e.objectStoreNames.contains("subtasks")){const i=e.createObjectStore("subtasks",{keyPath:"id"});i.createIndex("taskId","taskId",{unique:!1}),i.createIndex("status","status",{unique:!1})}e.objectStoreNames.contains("appState")||e.createObjectStore("appState",{keyPath:"key"})},n.onsuccess=a=>{D=a.target.result,t(D)},n.onerror=a=>s(a.target.error)})}function g(t,s="readonly"){return D.transaction(t,s).objectStore(t)}function b(t){return new Promise((s,n)=>{t.onsuccess=()=>s(t.result),t.onerror=()=>n(t.error)})}async function R(t){return await y(),b(g("tasks","readwrite").put(t))}async function it(t){return await y(),b(g("tasks").get(t))}async function L(){return await y(),b(g("tasks").getAll())}async function W(t){await y();const s=await w(t),n=g("subtasks","readwrite");for(const a of s)n.delete(a.id);return b(g("tasks","readwrite").delete(t))}async function H(t){return R(t)}async function x(t){return await y(),b(g("subtasks","readwrite").put(t))}async function ot(t){return await y(),b(g("subtasks").get(t))}async function w(t){await y();const s=g("subtasks").index("taskId");return b(s.getAll(t))}async function rt(t){return x(t)}async function M(t){return await y(),b(g("subtasks","readwrite").delete(t))}async function I(t){await y();const s=await b(g("appState").get(t));return s?s.value:null}async function E(t,s){return await y(),b(g("appState","readwrite").put({key:t,value:s}))}const _=Object.freeze(Object.defineProperty({__proto__:null,addSubtask:x,addTask:R,deleteSubtask:M,deleteTask:W,getAllTasks:L,getState:I,getSubtask:ot,getSubtasksByTask:w,getTask:it,openDB:y,setState:E,updateSubtask:rt,updateTask:H},Symbol.toStringTag,{value:"Module"})),ct="modulepreload",dt=function(t){return"/focusflow/"+t},G={},V=function(s,n,a){let e=Promise.resolve();if(n&&n.length>0){let o=function(d){return Promise.all(d.map(l=>Promise.resolve(l).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));e=o(n.map(d=>{if(d=dt(d),d in G)return;G[d]=!0;const l=d.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":ct,l||(p.as="script"),p.crossOrigin="",p.href=d,c&&p.setAttribute("nonce",c),document.head.appendChild(p),l)return new Promise((v,m)=>{p.addEventListener("load",v),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return e.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return s().catch(i)})};let lt=0;function J(){return Date.now().toString(36)+"-"+(++lt).toString(36)+"-"+Math.random().toString(36).slice(2,7)}function ut(t,s,n=null){return{id:J(),title:t.trim(),category:s,intervalDays:n,createdAt:Date.now(),completedDates:[],lastScheduledDate:null,active:!0}}function Q(t,s,n,a,e=0){return{id:J(),taskId:t,title:s.trim(),estimatedMinutes:n,priority:a,order:e,status:"pending",completedAt:null,addedTimeMinutes:0}}const K={daily:t=>[{t:`Set up & prepare to start: ${t}`,min:5,p:3},{t:`Focus on the main work: ${t}`,min:20,p:5},{t:`Wrap up & quick review of: ${t}`,min:5,p:4}],periodic:t=>[{t:`Recall where you left off & review progress on: ${t}`,min:5,p:3},{t:`Do the core work session: ${t}`,min:20,p:5},{t:`Document progress & set reminders for next time: ${t}`,min:5,p:4}],oneoff:t=>[{t:`Research & figure out the approach for: ${t}`,min:10,p:3},{t:`Execute the main action: ${t}`,min:20,p:5},{t:`Verify completion & do any follow-ups for: ${t}`,min:10,p:4}],new:t=>[{t:`Understand requirements & ask clarifying questions about: ${t}`,min:10,p:3},{t:`Create first draft / initial attempt: ${t}`,min:20,p:5},{t:`Review your work & refine: ${t}`,min:10,p:4}]};function z(t){return console.warn("Using fallback breakdown for:",t.title),(K[t.category]||K.daily)(t.title).map((a,e)=>Q(t.id,a.t,a.min,a.p,e))}async function C(t){const s=await I("geminiApiKey");if(!s)return z(t);const n=`
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
  `.trim();try{const a=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:n}]}],generationConfig:{temperature:.2,responseMimeType:"application/json"}})});if(!a.ok)throw new Error(`API Error: ${a.status}`);const i=(await a.json()).candidates[0].content.parts[0].text;let o=JSON.parse(i);if(!Array.isArray(o)||o.length===0)throw new Error("Invalid format from API");return o.map((r,c)=>{const d=r.t||r.title||r.task||`Step ${c+1} for ${t.title}`,l=parseInt(r.min||r.minutes||r.time)||15,u=parseInt(r.p||r.priority)||3;return Q(t.id,d,l,u,c)})}catch(a){return console.error("Gemini API Breakdown failed:",a),z(t)}}function pt(t){const s=Date.now(),n=new Date().getHours(),a=t.map(e=>{let i=0;if(i+=({new:5,oneoff:4,daily:3,periodic:2}[e.category]||2)*6,e.category==="periodic"&&e.intervalDays){const d=e.completedDates.length>0?new Date(e.completedDates[e.completedDates.length-1]).getTime():e.createdAt,u=(s-d)/(1e3*60*60*24)/e.intervalDays;i+=Math.min(u*12.5,25)}else if(e.category==="daily"){const d=new Date().toISOString().slice(0,10);e.completedDates.includes(d)||(i+=20)}else if(e.category==="new"){const d=(s-e.createdAt)/36e5;i+=Math.min(d*2,25)}n>=6&&n<=14&&(i+=10);const c=(s-e.createdAt)/(1e3*60*60*24);return i+=Math.max(10-c*2,0),{task:e,score:i}});return a.sort((e,i)=>i.score-e.score),a.map(e=>e.task)}function mt(t){return t.filter(n=>n.status!=="done").sort((n,a)=>n.order-a.order).slice(0,3)}function X(){return new Date().toISOString().slice(0,10)}async function vt(){const t=await I("lastActiveDate"),s=X();return t===s?!1:(await ft(s),await E("lastActiveDate",s),!0)}async function ft(t){const s=await L();for(const n of s)if(n.active)switch(n.category){case"daily":{const a=await w(n.id);for(const i of a)i.status==="done"?await M(i.id):await M(i.id);const e=C(n);for(const i of e)await x(i);break}case"periodic":{const a=n.completedDates.length>0?n.completedDates[n.completedDates.length-1]:null;let e=!1;if(!a)e=!0;else{const i=new Date(a);e=Math.floor((new Date(t)-i)/(1e3*60*60*24))>=(n.intervalDays||1)}if(e&&n.lastScheduledDate!==t){const i=await w(n.id);for(const r of i)await M(r.id);const o=C(n);for(const r of o)await x(r);n.lastScheduledDate=t,await H(n)}break}case"oneoff":{n.completedDates.includes(t)&&(n.active=!1,await H(n));break}case"new":{if((await w(n.id)).length===0){const e=C(n);for(const i of e)await x(i)}break}}}async function F(){const s=(await L()).filter(r=>r.active);if(s.length===0)return{subtasks:[],task:null};const n=pt(s);let a=await I("currentFocusTaskIndex")||0;a>=n.length&&(a=0,await E("currentFocusTaskIndex",0));const e=n[a],i=await w(e.id),o=mt(i);return o.length===0&&n.length>1?await Z():{subtasks:o,task:e}}async function Z(){const s=(await L()).filter(a=>a.active);if(s.length<=1)return await F();let n=await I("currentFocusTaskIndex")||0;return n=(n+1)%s.length,await E("currentFocusTaskIndex",n),await F()}async function q(t){const{getSubtask:s,updateSubtask:n}=await V(async()=>{const{getSubtask:o,updateSubtask:r}=await Promise.resolve().then(()=>_);return{getSubtask:o,updateSubtask:r}},void 0),a=await s(t);if(!a)return;a.status="done",a.completedAt=Date.now(),await n(a);const i=(await w(a.taskId)).every(o=>o.status==="done");if(i){const{getTask:o,updateTask:r}=await V(async()=>{const{getTask:d,updateTask:l}=await Promise.resolve().then(()=>_);return{getTask:d,updateTask:l}},void 0),c=await o(a.taskId);c&&(c.completedDates.push(X()),c.category==="oneoff"&&(c.active=!1),await r(c))}return i}const tt={};let B=null;function A(t,s){tt[t]=s}function yt(t){window.location.hash=t}function ht(t="#dashboard"){const s=()=>{const n=window.location.hash||t,a=tt[n];a&&(B&&B.cleanup&&B.cleanup(),B=a())};window.addEventListener("hashchange",s),window.location.hash?s():window.location.hash=t}let P=!1;async function gt(){return"Notification"in window?Notification.permission==="granted"?(P=!0,!0):Notification.permission!=="denied"?(P=await Notification.requestPermission()==="granted",P):!1:!1}function bt(t,s){P&&document.hidden&&new Notification(t,{body:s,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",vibrate:[200,100,200]}),f(t,s)}function f(t,s,n=4e3){const a=document.getElementById("toast-container");if(!a)return;const e=document.createElement("div");e.className="toast",e.innerHTML=`
    <div class="toast-title">${t}</div>
    ${s?`<div class="toast-body">${s}</div>`:""}
  `,a.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast-show")),setTimeout(()=>{e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>e.remove(),400)},n)}let k=null,T=0,O=0;function kt(t,s,n,a){T=s*60,O=s*60;const e=document.createElement("div");e.className="timer-overlay",e.id="timer-overlay",e.innerHTML=`
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
          ${U(T)}
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
  `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("timer-overlay-show"));let i=!1;const o=document.getElementById("timer-display"),r=document.getElementById("timer-progress-ring"),c=2*Math.PI*88,d=document.getElementById("btn-pause");function l(){o&&(o.textContent=U(T));const h=1-T/O,$=c*h;r&&(r.style.strokeDashoffset=$)}function u(){i||(T--,l(),T<=0&&(clearInterval(k),k=null,p()))}function p(){bt("⏰ Time's Up!",`Timer for "${n}" has ended.`),"vibrate"in navigator&&navigator.vibrate([200,100,200,100,200]),document.querySelector(".timer-controls").style.display="none",document.getElementById("timeup-panel").style.display="block"}function v(h){T+=h*60,O+=h*60,document.getElementById("timeup-panel").style.display="none",document.querySelector(".timer-controls").style.display="flex",l(),k||(k=setInterval(u,1e3)),f("⏱️ Time Added",`+${h} minutes added`)}function m(h){k&&(clearInterval(k),k=null),e.classList.remove("timer-overlay-show"),e.classList.add("timer-overlay-hide"),setTimeout(()=>{e.remove(),a&&a()},400)}k=setInterval(u,1e3),d.addEventListener("click",()=>{i=!i,d.innerHTML=i?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause',d.classList.toggle("btn-resume",i)}),document.getElementById("btn-finish-early").addEventListener("click",async()=>{await q(t),f("✅ Done!","Great focus session!"),m()}),document.getElementById("btn-done-final").addEventListener("click",async()=>{await q(t),f("🎉 Complete!","You crushed it!"),m()}),e.querySelectorAll(".btn-add-time[data-minutes]").forEach(h=>{h.addEventListener("click",()=>{v(parseInt(h.dataset.minutes))})});const S=document.getElementById("random-slider"),nt=document.getElementById("random-value");S.addEventListener("input",()=>{nt.textContent=`${S.value} min`}),document.getElementById("btn-random-add").addEventListener("click",()=>{const h=parseInt(S.value),$=Math.max(1,Math.floor(Math.random()*h)+1);v($),f("🎲 Random Time",`Added ${$} random minutes!`)})}function U(t){const s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}let j=null;function wt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,Y(),N(),document.getElementById("btn-refresh").addEventListener("click",async()=>{const s=document.getElementById("btn-refresh");s.disabled=!0;const n=s.querySelector("svg");n.style.animation="spin 1s linear infinite",await Z(),await N(),s.disabled=!1,n.style.animation=""}),j=setInterval(Y,6e4),{cleanup:()=>{j&&clearInterval(j)}}}function Y(){const t=document.getElementById("greeting");if(!t)return;const s=new Date().getHours();let n="Good evening";s>=5&&s<12?n="Good morning":s>=12&&s<17&&(n="Good afternoon");const a=["🔥","💪","⚡","🚀","✨","🎯","💫"],e=a[Math.floor(Math.random()*a.length)];t.textContent=`${n} ${e}`}async function N(){const t=document.getElementById("focus-cards");if(!t)return;const{subtasks:s,task:n}=await F();if(!n||s.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;return}const a={daily:"🔄 Daily",periodic:"📅 Periodic",oneoff:"🎯 One-off",new:"⭐ New Task"},e={daily:"cat-daily",periodic:"cat-periodic",oneoff:"cat-oneoff",new:"cat-new"},i=a[n.category];let r=`
    <div class="focused-task-header card-enter">
      <div class="focused-task-meta">
        <span class="category-badge ${e[n.category]}">${i}</span>
        <span class="focus-label">Current Focus</span>
      </div>
      <h3 class="focused-task-title">${n.title}</h3>
    </div>
    <div class="subtasks-container">
  `;r+=s.map((c,d)=>{const l=c.priority>=4?"High":c.priority>=3?"Medium":"Low",u=c.priority>=4?"priority-high":c.priority>=3?"priority-med":"priority-low";return`
      <div class="focus-card card-enter" style="animation-delay: ${d*.1}s" data-subtask-id="${c.id}">
        <div class="focus-card-header">
          <span class="step-badge">Step ${c.order+1}</span>
          <span class="priority-badge ${u}">${l}</span>
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
    `}).join(""),r+="</div>",t.innerHTML=r,t.querySelectorAll(".btn-start").forEach(c=>{c.addEventListener("click",d=>{const l=d.currentTarget.dataset.id,u=parseInt(d.currentTarget.dataset.minutes),p=s.find(v=>v.id===l);Tt(l,u,p?p.title:"Task")})}),t.querySelectorAll(".btn-done").forEach(c=>{c.addEventListener("click",async d=>{const l=d.currentTarget.dataset.id;d.currentTarget.closest(".focus-card").classList.add("card-complete"),setTimeout(async()=>{await q(l)?f("🎉 Task Complete!","All subtasks for this task are done!"):f("✅ Subtask Done!","Great work! Keep going!"),N()},500)})})}function Tt(t,s,n){kt(t,s,n,()=>{N()})}function St(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;let s="daily";const n=document.getElementById("add-task-form"),a=document.getElementById("interval-group"),e=document.getElementById("interval-days");return document.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".category-btn").forEach(o=>o.classList.remove("active")),i.classList.add("active"),s=i.dataset.cat,a.style.display=s==="periodic"?"block":"none"})}),document.getElementById("interval-dec").addEventListener("click",()=>{e.value=Math.max(2,parseInt(e.value)-1)}),document.getElementById("interval-inc").addEventListener("click",()=>{e.value=Math.min(365,parseInt(e.value)+1)}),n.addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("task-title").value.trim();if(!o)return;const r=s==="periodic"?parseInt(e.value):null,c=ut(o,s,r);await R(c);const d=document.getElementById("btn-submit"),l=d.innerHTML;d.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Breaking it down...',d.disabled=!0,d.classList.add("loading");try{const u=await C(c);for(const m of u)await x(m);n.style.display="none";const p=document.getElementById("breakdown-preview");p.style.display="block";const v=document.getElementById("subtask-list");v.innerHTML=u.map((m,S)=>`
        <div class="subtask-preview-card card-enter" style="animation-delay: ${S*.15}s">
          <div class="subtask-preview-num">${S+1}</div>
          <div class="subtask-preview-content">
            <div class="subtask-preview-title">${m.title}</div>
            <div class="subtask-preview-meta">
              <span class="time-estimate">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${m.estimatedMinutes} min
              </span>
              <span class="priority-badge ${m.priority>=4?"priority-high":m.priority>=3?"priority-med":"priority-low"}">
                ${m.priority>=4?"High":m.priority>=3?"Medium":"Low"}
              </span>
            </div>
          </div>
        </div>
      `).join(""),f("✅ Task Added!",`"${o}" has been broken into ${u.length} subtasks`)}catch(u){console.error("Failed to break down:",u),d.innerHTML=l,d.disabled=!1,d.classList.remove("loading"),f("❌ Error Error","Failed to break down task. Please check API Key or try again.")}document.getElementById("btn-go-dashboard").addEventListener("click",()=>{yt("#dashboard")})}),{cleanup:()=>{}}}function xt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,et(),{cleanup:()=>{}}}async function et(){const t=document.getElementById("task-list-content");if(!t)return;const s=await L(),n=s.filter(o=>o.active);if(n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;return}const a=[{key:"daily",label:"🔄 Daily Tasks",cls:"cat-daily"},{key:"periodic",label:"📅 Periodic Tasks",cls:"cat-periodic"},{key:"oneoff",label:"🎯 One-off Tasks",cls:"cat-oneoff"},{key:"new",label:"⭐ New Tasks",cls:"cat-new"}];let e="";for(const o of a){const r=n.filter(c=>c.category===o.key);if(r.length!==0){e+=`
      <div class="task-category-section">
        <div class="category-header ${o.cls}">
          <span>${o.label}</span>
          <span class="task-count">${r.length}</span>
        </div>
        <div class="task-items">
    `;for(const c of r){const d=await w(c.id),l=d.filter(m=>m.status==="done").length,u=d.length,p=u>0?Math.round(l/u*100):0;let v="";c.category==="periodic"&&c.intervalDays?v=`Every ${c.intervalDays} days`:c.completedDates.length>0&&(v=`Done ${c.completedDates.length} time${c.completedDates.length>1?"s":""}`),e+=`
        <div class="task-item card-enter" data-task-id="${c.id}">
          <div class="task-item-content">
            <div class="task-item-title">${c.title}</div>
            ${v?`<div class="task-item-meta">${v}</div>`:""}
            <div class="task-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${p}%"></div>
              </div>
              <span class="progress-text">${l}/${u} subtasks</span>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${c.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `}e+="</div></div>"}}const i=s.filter(o=>!o.active);i.length>0&&(e+=`
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
    `),t.innerHTML=e,t.querySelectorAll(".btn-delete").forEach(o=>{o.addEventListener("click",async r=>{const c=r.currentTarget.dataset.taskId,d=r.currentTarget.closest(".task-item");confirm("Delete this task and all its subtasks?")&&(d.classList.add("card-exit"),setTimeout(async()=>{await W(c),f("🗑️ Deleted","Task removed"),et()},300))})})}function Et(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;const s=document.getElementById("api-key-form"),n=document.getElementById("api-key");return I("geminiApiKey").then(a=>{a&&(n.value=a)}),s.addEventListener("submit",async a=>{a.preventDefault();const e=n.value.trim();if(!e){await E("geminiApiKey",null),f("⚠️ Cleared","API Key removed");return}await E("geminiApiKey",e),f("✅ Saved!","Your API Key is securely stored.")}),{cleanup:()=>{}}}async function It(){const t=document.getElementById("app");t.innerHTML=`
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
  `,await y(),await vt(),gt(),A("#dashboard",wt),A("#add",St),A("#tasks",xt),A("#settings",Et);const s=document.querySelectorAll(".nav-btn");function n(){const a=window.location.hash||"#dashboard";s.forEach(e=>{e.classList.toggle("active",e.dataset.route===a)})}s.forEach(a=>{a.addEventListener("click",()=>{window.location.hash=a.dataset.route})}),window.addEventListener("hashchange",n),ht("#dashboard"),n()}It().catch(console.error);
