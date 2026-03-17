(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(e){if(e.ep)return;e.ep=!0;const i=s(e);fetch(e.href,i)}})();const st="focusflow",nt=1;let D=null;function y(){return new Promise((t,n)=>{if(D)return t(D);const s=indexedDB.open(st,nt);s.onupgradeneeded=a=>{const e=a.target.result;if(e.objectStoreNames.contains("tasks")||e.createObjectStore("tasks",{keyPath:"id"}).createIndex("category","category",{unique:!1}),!e.objectStoreNames.contains("subtasks")){const i=e.createObjectStore("subtasks",{keyPath:"id"});i.createIndex("taskId","taskId",{unique:!1}),i.createIndex("status","status",{unique:!1})}e.objectStoreNames.contains("appState")||e.createObjectStore("appState",{keyPath:"key"})},s.onsuccess=a=>{D=a.target.result,t(D)},s.onerror=a=>n(a.target.error)})}function g(t,n="readonly"){return D.transaction(t,n).objectStore(t)}function b(t){return new Promise((n,s)=>{t.onsuccess=()=>n(t.result),t.onerror=()=>s(t.error)})}async function R(t){return await y(),b(g("tasks","readwrite").put(t))}async function at(t){return await y(),b(g("tasks").get(t))}async function $(){return await y(),b(g("tasks").getAll())}async function _(t){await y();const n=await w(t),s=g("subtasks","readwrite");for(const a of n)s.delete(a.id);return b(g("tasks","readwrite").delete(t))}async function H(t){return R(t)}async function x(t){return await y(),b(g("subtasks","readwrite").put(t))}async function it(t){return await y(),b(g("subtasks").get(t))}async function w(t){await y();const n=g("subtasks").index("taskId");return b(n.getAll(t))}async function ot(t){return x(t)}async function M(t){return await y(),b(g("subtasks","readwrite").delete(t))}async function E(t){await y();const n=await b(g("appState").get(t));return n?n.value:null}async function I(t,n){return await y(),b(g("appState","readwrite").put({key:t,value:n}))}const G=Object.freeze(Object.defineProperty({__proto__:null,addSubtask:x,addTask:R,deleteSubtask:M,deleteTask:_,getAllTasks:$,getState:E,getSubtask:it,getSubtasksByTask:w,getTask:at,openDB:y,setState:I,updateSubtask:ot,updateTask:H},Symbol.toStringTag,{value:"Module"})),rt="modulepreload",ct=function(t){return"/focusflow/"+t},V={},K=function(n,s,a){let e=Promise.resolve();if(s&&s.length>0){let r=function(c){return Promise.all(c.map(l=>Promise.resolve(l).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),o=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));e=r(s.map(c=>{if(c=ct(c),c in V)return;V[c]=!0;const l=c.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":rt,l||(p.as="script"),p.crossOrigin="",p.href=c,o&&p.setAttribute("nonce",o),document.head.appendChild(p),l)return new Promise((v,m)=>{p.addEventListener("load",v),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(r){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=r,window.dispatchEvent(d),!d.defaultPrevented)throw r}return e.then(r=>{for(const d of r||[])d.status==="rejected"&&i(d.reason);return n().catch(i)})};let dt=0;function W(){return Date.now().toString(36)+"-"+(++dt).toString(36)+"-"+Math.random().toString(36).slice(2,7)}function lt(t,n,s=null){return{id:W(),title:t.trim(),category:n,intervalDays:s,createdAt:Date.now(),completedDates:[],lastScheduledDate:null,active:!0}}function J(t,n,s,a,e=0){return{id:W(),taskId:t,title:n.trim(),estimatedMinutes:s,priority:a,order:e,status:"pending",completedAt:null,addedTimeMinutes:0}}const z={daily:t=>[{t:`Set up & prepare to start: ${t}`,min:5,p:3},{t:`Focus on the main work: ${t}`,min:20,p:5},{t:`Wrap up & quick review of: ${t}`,min:5,p:4}],periodic:t=>[{t:`Recall where you left off & review progress on: ${t}`,min:5,p:3},{t:`Do the core work session: ${t}`,min:20,p:5},{t:`Document progress & set reminders for next time: ${t}`,min:5,p:4}],oneoff:t=>[{t:`Research & figure out the approach for: ${t}`,min:10,p:3},{t:`Execute the main action: ${t}`,min:20,p:5},{t:`Verify completion & do any follow-ups for: ${t}`,min:10,p:4}],new:t=>[{t:`Understand requirements & ask clarifying questions about: ${t}`,min:10,p:3},{t:`Create first draft / initial attempt: ${t}`,min:20,p:5},{t:`Review your work & refine: ${t}`,min:10,p:4}]};function ut(t){return console.warn("Using fallback breakdown for:",t.title),(z[t.category]||z.daily)(t.title).map((a,e)=>J(t.id,a.t,a.min,a.p,e))}async function P(t){var a;const n=await E("geminiApiKey");if(!n)return ut(t);const s=`
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
  `.trim();try{const e=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:s}]}],generationConfig:{temperature:.1}})});if(!e.ok){let o;try{o=await e.json()}catch{o={error:{message:`HTTP ${e.status}: ${e.statusText}`}}}const c=((a=o.error)==null?void 0:a.message)||`API Error: ${e.status}`;throw new Error(c)}let r=(await e.json()).candidates[0].content.parts[0].text;r=r.replace(/```json|```/g,"").trim();let d=JSON.parse(r);if(!Array.isArray(d)||d.length===0)throw new Error("Invalid format from API");return d.map((o,c)=>{const l=o.t||o.title||o.task||`Step ${c+1} for ${t.title}`,u=parseInt(o.min||o.minutes||o.time)||15,p=parseInt(o.p||o.priority)||3;return J(t.id,l,u,p,c)})}catch(e){throw console.error("Gemini API Breakdown failed:",e),e}}function pt(t){const n=Date.now(),s=new Date().getHours(),a=t.map(e=>{let i=0;if(i+=({new:5,oneoff:4,daily:3,periodic:2}[e.category]||2)*6,e.category==="periodic"&&e.intervalDays){const c=e.completedDates.length>0?new Date(e.completedDates[e.completedDates.length-1]).getTime():e.createdAt,u=(n-c)/(1e3*60*60*24)/e.intervalDays;i+=Math.min(u*12.5,25)}else if(e.category==="daily"){const c=new Date().toISOString().slice(0,10);e.completedDates.includes(c)||(i+=20)}else if(e.category==="new"){const c=(n-e.createdAt)/36e5;i+=Math.min(c*2,25)}s>=6&&s<=14&&(i+=10);const o=(n-e.createdAt)/(1e3*60*60*24);return i+=Math.max(10-o*2,0),{task:e,score:i}});return a.sort((e,i)=>i.score-e.score),a.map(e=>e.task)}function mt(t){return t.filter(s=>s.status!=="done").sort((s,a)=>s.order-a.order).slice(0,3)}function Q(){return new Date().toISOString().slice(0,10)}async function vt(){const t=await E("lastActiveDate"),n=Q();return t===n?!1:(await ft(n),await I("lastActiveDate",n),!0)}async function ft(t){const n=await $();for(const s of n)if(s.active)switch(s.category){case"daily":{const a=await w(s.id);for(const i of a)i.status==="done"?await M(i.id):await M(i.id);const e=P(s);for(const i of e)await x(i);break}case"periodic":{const a=s.completedDates.length>0?s.completedDates[s.completedDates.length-1]:null;let e=!1;if(!a)e=!0;else{const i=new Date(a);e=Math.floor((new Date(t)-i)/(1e3*60*60*24))>=(s.intervalDays||1)}if(e&&s.lastScheduledDate!==t){const i=await w(s.id);for(const d of i)await M(d.id);const r=P(s);for(const d of r)await x(d);s.lastScheduledDate=t,await H(s)}break}case"oneoff":{s.completedDates.includes(t)&&(s.active=!1,await H(s));break}case"new":{if((await w(s.id)).length===0){const e=P(s);for(const i of e)await x(i)}break}}}async function F(){const n=(await $()).filter(d=>d.active);if(n.length===0)return{subtasks:[],task:null};const s=pt(n);let a=await E("currentFocusTaskIndex")||0;a>=s.length&&(a=0,await I("currentFocusTaskIndex",0));const e=s[a],i=await w(e.id),r=mt(i);return r.length===0&&s.length>1?await X():{subtasks:r,task:e}}async function X(){const n=(await $()).filter(a=>a.active);if(n.length<=1)return await F();let s=await E("currentFocusTaskIndex")||0;return s=(s+1)%n.length,await I("currentFocusTaskIndex",s),await F()}async function q(t){const{getSubtask:n,updateSubtask:s}=await K(async()=>{const{getSubtask:r,updateSubtask:d}=await Promise.resolve().then(()=>G);return{getSubtask:r,updateSubtask:d}},void 0),a=await n(t);if(!a)return;a.status="done",a.completedAt=Date.now(),await s(a);const i=(await w(a.taskId)).every(r=>r.status==="done");if(i){const{getTask:r,updateTask:d}=await K(async()=>{const{getTask:c,updateTask:l}=await Promise.resolve().then(()=>G);return{getTask:c,updateTask:l}},void 0),o=await r(a.taskId);o&&(o.completedDates.push(Q()),o.category==="oneoff"&&(o.active=!1),await d(o))}return i}const Z={};let B=null;function A(t,n){Z[t]=n}function yt(t){window.location.hash=t}function ht(t="#dashboard"){const n=()=>{const s=window.location.hash||t,a=Z[s];a&&(B&&B.cleanup&&B.cleanup(),B=a())};window.addEventListener("hashchange",n),window.location.hash?n():window.location.hash=t}let C=!1;async function gt(){return"Notification"in window?Notification.permission==="granted"?(C=!0,!0):Notification.permission!=="denied"?(C=await Notification.requestPermission()==="granted",C):!1:!1}function bt(t,n){C&&document.hidden&&new Notification(t,{body:n,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",vibrate:[200,100,200]}),f(t,n)}function f(t,n,s=4e3){const a=document.getElementById("toast-container");if(!a)return;const e=document.createElement("div");e.className="toast",e.innerHTML=`
    <div class="toast-title">${t}</div>
    ${n?`<div class="toast-body">${n}</div>`:""}
  `,a.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast-show")),setTimeout(()=>{e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>e.remove(),400)},s)}let k=null,T=0,O=0;function kt(t,n,s,a){T=n*60,O=n*60;const e=document.createElement("div");e.className="timer-overlay",e.id="timer-overlay",e.innerHTML=`
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
  `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("timer-overlay-show"));let i=!1;const r=document.getElementById("timer-display"),d=document.getElementById("timer-progress-ring"),o=2*Math.PI*88,c=document.getElementById("btn-pause");function l(){r&&(r.textContent=U(T));const h=1-T/O,L=o*h;d&&(d.style.strokeDashoffset=L)}function u(){i||(T--,l(),T<=0&&(clearInterval(k),k=null,p()))}function p(){bt("⏰ Time's Up!",`Timer for "${s}" has ended.`),"vibrate"in navigator&&navigator.vibrate([200,100,200,100,200]),document.querySelector(".timer-controls").style.display="none",document.getElementById("timeup-panel").style.display="block"}function v(h){T+=h*60,O+=h*60,document.getElementById("timeup-panel").style.display="none",document.querySelector(".timer-controls").style.display="flex",l(),k||(k=setInterval(u,1e3)),f("⏱️ Time Added",`+${h} minutes added`)}function m(h){k&&(clearInterval(k),k=null),e.classList.remove("timer-overlay-show"),e.classList.add("timer-overlay-hide"),setTimeout(()=>{e.remove(),a&&a()},400)}k=setInterval(u,1e3),c.addEventListener("click",()=>{i=!i,c.innerHTML=i?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause',c.classList.toggle("btn-resume",i)}),document.getElementById("btn-finish-early").addEventListener("click",async()=>{await q(t),f("✅ Done!","Great focus session!"),m()}),document.getElementById("btn-done-final").addEventListener("click",async()=>{await q(t),f("🎉 Complete!","You crushed it!"),m()}),e.querySelectorAll(".btn-add-time[data-minutes]").forEach(h=>{h.addEventListener("click",()=>{v(parseInt(h.dataset.minutes))})});const S=document.getElementById("random-slider"),et=document.getElementById("random-value");S.addEventListener("input",()=>{et.textContent=`${S.value} min`}),document.getElementById("btn-random-add").addEventListener("click",()=>{const h=parseInt(S.value),L=Math.max(1,Math.floor(Math.random()*h)+1);v(L),f("🎲 Random Time",`Added ${L} random minutes!`)})}function U(t){const n=Math.floor(t/60),s=t%60;return`${n.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}let j=null;function wt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,Y(),N(),document.getElementById("btn-refresh").addEventListener("click",async()=>{const n=document.getElementById("btn-refresh");n.disabled=!0;const s=n.querySelector("svg");s.style.animation="spin 1s linear infinite",await X(),await N(),n.disabled=!1,s.style.animation=""}),j=setInterval(Y,6e4),{cleanup:()=>{j&&clearInterval(j)}}}function Y(){const t=document.getElementById("greeting");if(!t)return;const n=new Date().getHours();let s="Good evening";n>=5&&n<12?s="Good morning":n>=12&&n<17&&(s="Good afternoon");const a=["🔥","💪","⚡","🚀","✨","🎯","💫"],e=a[Math.floor(Math.random()*a.length)];t.textContent=`${s} ${e}`}async function N(){const t=document.getElementById("focus-cards");if(!t)return;const{subtasks:n,task:s}=await F();if(!s||n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;return}const a={daily:"🔄 Daily",periodic:"📅 Periodic",oneoff:"🎯 One-off",new:"⭐ New Task"},e={daily:"cat-daily",periodic:"cat-periodic",oneoff:"cat-oneoff",new:"cat-new"},i=a[s.category];let d=`
    <div class="focused-task-header card-enter">
      <div class="focused-task-meta">
        <span class="category-badge ${e[s.category]}">${i}</span>
        <span class="focus-label">Current Focus</span>
      </div>
      <h3 class="focused-task-title">${s.title}</h3>
    </div>
    <div class="subtasks-container">
  `;d+=n.map((o,c)=>{const l=o.priority>=4?"High":o.priority>=3?"Medium":"Low",u=o.priority>=4?"priority-high":o.priority>=3?"priority-med":"priority-low";return`
      <div class="focus-card card-enter" style="animation-delay: ${c*.1}s" data-subtask-id="${o.id}">
        <div class="focus-card-header">
          <span class="step-badge">Step ${o.order+1}</span>
          <span class="priority-badge ${u}">${l}</span>
        </div>
        <div class="focus-card-title" style="font-size: 14px; margin-bottom: 10px;">${o.title}</div>
        <div class="focus-card-footer">
          <div class="time-estimate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${o.estimatedMinutes} min
          </div>
          <div class="focus-card-actions">
            <button class="btn btn-sm btn-start" data-id="${o.id}" data-minutes="${o.estimatedMinutes}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start
            </button>
            <button class="btn btn-sm btn-done" data-id="${o.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </button>
          </div>
        </div>
      </div>
    `}).join(""),d+="</div>",t.innerHTML=d,t.querySelectorAll(".btn-start").forEach(o=>{o.addEventListener("click",c=>{const l=c.currentTarget.dataset.id,u=parseInt(c.currentTarget.dataset.minutes),p=n.find(v=>v.id===l);Tt(l,u,p?p.title:"Task")})}),t.querySelectorAll(".btn-done").forEach(o=>{o.addEventListener("click",async c=>{const l=c.currentTarget.dataset.id;c.currentTarget.closest(".focus-card").classList.add("card-complete"),setTimeout(async()=>{await q(l)?f("🎉 Task Complete!","All subtasks for this task are done!"):f("✅ Subtask Done!","Great work! Keep going!"),N()},500)})})}function Tt(t,n,s){kt(t,n,s,()=>{N()})}function St(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;let n="daily";const s=document.getElementById("add-task-form"),a=document.getElementById("interval-group"),e=document.getElementById("interval-days");return document.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".category-btn").forEach(r=>r.classList.remove("active")),i.classList.add("active"),n=i.dataset.cat,a.style.display=n==="periodic"?"block":"none"})}),document.getElementById("interval-dec").addEventListener("click",()=>{e.value=Math.max(2,parseInt(e.value)-1)}),document.getElementById("interval-inc").addEventListener("click",()=>{e.value=Math.min(365,parseInt(e.value)+1)}),s.addEventListener("submit",async i=>{i.preventDefault();const r=document.getElementById("task-title").value.trim();if(!r)return;const d=n==="periodic"?parseInt(e.value):null,o=lt(r,n,d);await R(o);const c=document.getElementById("btn-submit"),l=c.innerHTML;c.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Breaking it down...',c.disabled=!0,c.classList.add("loading");try{const u=await P(o);for(const m of u)await x(m);s.style.display="none";const p=document.getElementById("breakdown-preview");p.style.display="block";const v=document.getElementById("subtask-list");v.innerHTML=u.map((m,S)=>`
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
      `).join(""),f("✅ Task Added!",`"${r}" has been broken into ${u.length} subtasks`)}catch(u){console.error("Failed to break down:",u);try{await _(o.id)}catch(p){console.error("Failed to cleanup empty task:",p)}c.innerHTML=l,c.disabled=!1,c.classList.remove("loading"),f("❌ Error Breakdown",u.message||"Failed to break down task. Please check API Key or try again.")}document.getElementById("btn-go-dashboard").addEventListener("click",()=>{yt("#dashboard")})}),{cleanup:()=>{}}}function xt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,tt(),{cleanup:()=>{}}}async function tt(){const t=document.getElementById("task-list-content");if(!t)return;const n=await $(),s=n.filter(r=>r.active);if(s.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;return}const a=[{key:"daily",label:"🔄 Daily Tasks",cls:"cat-daily"},{key:"periodic",label:"📅 Periodic Tasks",cls:"cat-periodic"},{key:"oneoff",label:"🎯 One-off Tasks",cls:"cat-oneoff"},{key:"new",label:"⭐ New Tasks",cls:"cat-new"}];let e="";for(const r of a){const d=s.filter(o=>o.category===r.key);if(d.length!==0){e+=`
      <div class="task-category-section">
        <div class="category-header ${r.cls}">
          <span>${r.label}</span>
          <span class="task-count">${d.length}</span>
        </div>
        <div class="task-items">
    `;for(const o of d){const c=await w(o.id),l=c.filter(m=>m.status==="done").length,u=c.length,p=u>0?Math.round(l/u*100):0;let v="";o.category==="periodic"&&o.intervalDays?v=`Every ${o.intervalDays} days`:o.completedDates.length>0&&(v=`Done ${o.completedDates.length} time${o.completedDates.length>1?"s":""}`),e+=`
        <div class="task-item card-enter" data-task-id="${o.id}">
          <div class="task-item-content">
            <div class="task-item-title">${o.title}</div>
            ${v?`<div class="task-item-meta">${v}</div>`:""}
            <div class="task-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${p}%"></div>
              </div>
              <span class="progress-text">${l}/${u} subtasks</span>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${o.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `}e+="</div></div>"}}const i=n.filter(r=>!r.active);i.length>0&&(e+=`
      <div class="task-category-section">
        <div class="category-header cat-done">
          <span>✅ Completed</span>
          <span class="task-count">${i.length}</span>
        </div>
        <div class="task-items">
          ${i.map(r=>`
            <div class="task-item task-item-completed">
              <div class="task-item-content">
                <div class="task-item-title">${r.title}</div>
                <div class="task-item-meta">Completed</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `),t.innerHTML=e,t.querySelectorAll(".btn-delete").forEach(r=>{r.addEventListener("click",async d=>{const o=d.currentTarget.dataset.taskId,c=d.currentTarget.closest(".task-item");confirm("Delete this task and all its subtasks?")&&(c.classList.add("card-exit"),setTimeout(async()=>{await _(o),f("🗑️ Deleted","Task removed"),tt()},300))})})}function It(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;const n=document.getElementById("api-key-form"),s=document.getElementById("api-key");return E("geminiApiKey").then(a=>{a&&(s.value=a)}),n.addEventListener("submit",async a=>{a.preventDefault();const e=s.value.trim();if(!e){await I("geminiApiKey",null),f("⚠️ Cleared","API Key removed");return}await I("geminiApiKey",e),f("✅ Saved!","Your API Key is securely stored.")}),{cleanup:()=>{}}}async function Et(){const t=document.getElementById("app");t.innerHTML=`
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
  `,await y(),await vt(),gt(),A("#dashboard",wt),A("#add",St),A("#tasks",xt),A("#settings",It);const n=document.querySelectorAll(".nav-btn");function s(){const a=window.location.hash||"#dashboard";n.forEach(e=>{e.classList.toggle("active",e.dataset.route===a)})}n.forEach(a=>{a.addEventListener("click",()=>{window.location.hash=a.dataset.route})}),window.addEventListener("hashchange",s),ht("#dashboard"),s()}Et().catch(console.error);
