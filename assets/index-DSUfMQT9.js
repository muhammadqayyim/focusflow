(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(e){if(e.ep)return;e.ep=!0;const i=n(e);fetch(e.href,i)}})();const nt="focusflow",at=1;let L=null;function g(){return new Promise((t,s)=>{if(L)return t(L);const n=indexedDB.open(nt,at);n.onupgradeneeded=a=>{const e=a.target.result;if(e.objectStoreNames.contains("tasks")||e.createObjectStore("tasks",{keyPath:"id"}).createIndex("category","category",{unique:!1}),!e.objectStoreNames.contains("subtasks")){const i=e.createObjectStore("subtasks",{keyPath:"id"});i.createIndex("taskId","taskId",{unique:!1}),i.createIndex("status","status",{unique:!1})}e.objectStoreNames.contains("appState")||e.createObjectStore("appState",{keyPath:"key"})},n.onsuccess=a=>{L=a.target.result,t(L)},n.onerror=a=>s(a.target.error)})}function b(t,s="readonly"){return L.transaction(t,s).objectStore(t)}function k(t){return new Promise((s,n)=>{t.onsuccess=()=>s(t.result),t.onerror=()=>n(t.error)})}async function R(t){return await g(),k(b("tasks","readwrite").put(t))}async function it(t){return await g(),k(b("tasks").get(t))}async function D(){return await g(),k(b("tasks").getAll())}async function V(t){await g();const s=await S(t),n=b("subtasks","readwrite");for(const a of s)n.delete(a.id);return k(b("tasks","readwrite").delete(t))}async function O(t){return R(t)}async function $(t){return await g(),k(b("subtasks","readwrite").put(t))}async function ot(t){return await g(),k(b("subtasks").get(t))}async function S(t){await g();const s=b("subtasks").index("taskId");return k(s.getAll(t))}async function rt(t){return $(t)}async function C(t){return await g(),k(b("subtasks","readwrite").delete(t))}async function I(t){await g();const s=await k(b("appState").get(t));return s?s.value:null}async function E(t,s){return await g(),k(b("appState","readwrite").put({key:t,value:s}))}const j=Object.freeze(Object.defineProperty({__proto__:null,addSubtask:$,addTask:R,deleteSubtask:C,deleteTask:V,getAllTasks:D,getState:I,getSubtask:ot,getSubtasksByTask:S,getTask:it,openDB:g,setState:E,updateSubtask:rt,updateTask:O},Symbol.toStringTag,{value:"Module"})),ct="modulepreload",lt=function(t){return"/focusflow/"+t},z={},_=function(s,n,a){let e=Promise.resolve();if(n&&n.length>0){let r=function(l){return Promise.all(l.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),o=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));e=r(n.map(l=>{if(l=lt(l),l in z)return;z[l]=!0;const d=l.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":ct,d||(p.as="script"),p.crossOrigin="",p.href=l,o&&p.setAttribute("nonce",o),document.head.appendChild(p),d)return new Promise((f,m)=>{p.addEventListener("load",f),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return e.then(r=>{for(const c of r||[])c.status==="rejected"&&i(c.reason);return s().catch(i)})};let dt=0;function J(){return Date.now().toString(36)+"-"+(++dt).toString(36)+"-"+Math.random().toString(36).slice(2,7)}function ut(t,s,n=null){return{id:J(),title:t.trim(),category:s,intervalDays:n,createdAt:Date.now(),completedDates:[],lastScheduledDate:null,active:!0}}function Q(t,s,n,a,e=0){return{id:J(),taskId:t,title:s.trim(),estimatedMinutes:n,priority:a,order:e,status:"pending",completedAt:null,addedTimeMinutes:0}}const U={daily:t=>[{t:`Set up & prepare to start: ${t}`,min:5,p:3},{t:`Focus on the main work: ${t}`,min:20,p:5},{t:`Wrap up & quick review of: ${t}`,min:5,p:4}],periodic:t=>[{t:`Recall where you left off & review progress on: ${t}`,min:5,p:3},{t:`Do the core work session: ${t}`,min:20,p:5},{t:`Document progress & set reminders for next time: ${t}`,min:5,p:4}],oneoff:t=>[{t:`Research & figure out the approach for: ${t}`,min:10,p:3},{t:`Execute the main action: ${t}`,min:20,p:5},{t:`Verify completion & do any follow-ups for: ${t}`,min:10,p:4}],new:t=>[{t:`Understand requirements & ask clarifying questions about: ${t}`,min:10,p:3},{t:`Create first draft / initial attempt: ${t}`,min:20,p:5},{t:`Review your work & refine: ${t}`,min:10,p:4}]};function pt(t){return console.warn("Using fallback breakdown for:",t.title),(U[t.category]||U.daily)(t.title).map((a,e)=>Q(t.id,a.t,a.min,a.p,e))}async function P(t){var a;const s=await I("geminiApiKey");if(!s)return pt(t);const n=`
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
  `.trim();try{const e=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:n}]}],generationConfig:{temperature:.1}})});if(!e.ok){let o;try{o=await e.json()}catch{o={error:{message:`HTTP ${e.status}: ${e.statusText}`}}}const l=((a=o.error)==null?void 0:a.message)||`API Error: ${e.status}`;throw new Error(l)}let r=(await e.json()).candidates[0].content.parts[0].text;r=r.replace(/```json|```/g,"").trim();let c=JSON.parse(r);if(!Array.isArray(c)||c.length===0)throw new Error("Invalid format from API");return c.map((o,l)=>{const d=o.t||o.title||o.task||`Step ${l+1} for ${t.title}`,u=parseInt(o.min||o.minutes||o.time)||15,p=parseInt(o.p||o.priority)||3;return Q(t.id,d,u,p,l)})}catch(e){throw console.error("Gemini API Breakdown failed:",e),e}}function X(t){const s=Date.now(),n=new Date().getHours(),a=t.map(e=>{let i=0;if(i+=({new:5,oneoff:4,daily:3,periodic:2}[e.category]||2)*6,e.category==="periodic"&&e.intervalDays){const l=e.completedDates.length>0?new Date(e.completedDates[e.completedDates.length-1]).getTime():e.createdAt,u=(s-l)/(1e3*60*60*24)/e.intervalDays;i+=Math.min(u*12.5,25)}else if(e.category==="daily"){const l=new Date().toISOString().slice(0,10);e.completedDates.includes(l)||(i+=20)}else if(e.category==="new"){const l=(s-e.createdAt)/36e5;i+=Math.min(l*2,25)}n>=6&&n<=14&&(i+=10);const o=(s-e.createdAt)/(1e3*60*60*24);return i+=Math.max(10-o*2,0),{task:e,score:i}});return a.sort((e,i)=>i.score-e.score),a.map(e=>e.task)}function mt(t){return t.filter(n=>n.status!=="done").sort((n,a)=>n.order-a.order).slice(0,3)}function Z(){return new Date().toISOString().slice(0,10)}async function vt(){const t=await I("lastActiveDate"),s=Z();return t===s?!1:(await ft(s),await E("lastActiveDate",s),!0)}async function ft(t){const s=await D();for(const n of s)if(n.active)switch(n.category){case"daily":{const a=await S(n.id);for(const i of a)i.status==="done"?await C(i.id):await C(i.id);const e=P(n);for(const i of e)await $(i);break}case"periodic":{const a=n.completedDates.length>0?n.completedDates[n.completedDates.length-1]:null;let e=!1;if(!a)e=!0;else{const i=new Date(a);e=Math.floor((new Date(t)-i)/(1e3*60*60*24))>=(n.intervalDays||1)}if(e&&n.lastScheduledDate!==t){const i=await S(n.id);for(const c of i)await C(c.id);const r=P(n);for(const c of r)await $(c);n.lastScheduledDate=t,await O(n)}break}case"oneoff":{n.completedDates.includes(t)&&(n.active=!1,await O(n));break}case"new":{if((await S(n.id)).length===0){const e=P(n);for(const i of e)await $(i)}break}}}async function q(){const s=(await D()).filter(o=>o.active);if(s.length===0)return{subtasks:[],task:null};const n=X(s);let a=await I("currentFocusTaskIndex")||0;a>=n.length&&(a=0,await E("currentFocusTaskIndex",0));const e=n[a],i=await S(e.id);let r=await I(`focusBatch_${e.id}`),c=[];if(r&&Array.isArray(r)){const o=i.filter(d=>r.includes(d.id));!(o.length>0&&o.every(d=>d.status==="done"))&&o.length>0&&(c=o.sort((d,u)=>d.order-u.order))}if(c.length===0){const o=mt(i);if(o.length===0&&n.length>1)return await tt();o.length>0&&(c=o,await E(`focusBatch_${e.id}`,c.map(l=>l.id)))}return{subtasks:c,task:e}}async function tt(){const s=(await D()).filter(e=>e.active);if(s.length<=1)return await q();const n=X(s);let a=await I("currentFocusTaskIndex")||0;return a=(a+1)%n.length,await E("currentFocusTaskIndex",a),await q()}async function G(t){const{getSubtask:s,updateSubtask:n}=await _(async()=>{const{getSubtask:r,updateSubtask:c}=await Promise.resolve().then(()=>j);return{getSubtask:r,updateSubtask:c}},void 0),a=await s(t);if(!a)return;a.status="done",a.completedAt=Date.now(),await n(a);const i=(await S(a.taskId)).every(r=>r.status==="done");if(i){const{getTask:r,updateTask:c}=await _(async()=>{const{getTask:l,updateTask:d}=await Promise.resolve().then(()=>j);return{getTask:l,updateTask:d}},void 0),o=await r(a.taskId);o&&(o.completedDates.push(Z()),o.category==="oneoff"&&(o.active=!1),await c(o))}return i}const et={};let A=null;function M(t,s){et[t]=s}function ht(t){window.location.hash=t}function yt(t="#dashboard"){const s=()=>{const n=window.location.hash||t,a=et[n];a&&(A&&A.cleanup&&A.cleanup(),A=a())};window.addEventListener("hashchange",s),window.location.hash?s():window.location.hash=t}let H=!1;async function gt(){return"Notification"in window?Notification.permission==="granted"?(H=!0,!0):Notification.permission!=="denied"?(H=await Notification.requestPermission()==="granted",H):!1:!1}function bt(t,s){H&&document.hidden&&new Notification(t,{body:s,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",vibrate:[200,100,200]}),h(t,s)}function h(t,s,n=4e3){const a=document.getElementById("toast-container");if(!a)return;const e=document.createElement("div");e.className="toast",e.innerHTML=`
    <div class="toast-title">${t}</div>
    ${s?`<div class="toast-body">${s}</div>`:""}
  `,a.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast-show")),setTimeout(()=>{e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>e.remove(),400)},n)}let T=null,x=0,N=0;function kt(t,s,n,a){x=s*60,N=s*60;const e=document.createElement("div");e.className="timer-overlay",e.id="timer-overlay",e.innerHTML=`
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
          ${Y(x)}
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
  `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("timer-overlay-show"));let i=!1;const r=document.getElementById("timer-display"),c=document.getElementById("timer-progress-ring"),o=2*Math.PI*88,l=document.getElementById("btn-pause");function d(){r&&(r.textContent=Y(x));const y=1-x/N,v=o*y;c&&(c.style.strokeDashoffset=v)}function u(){i||(x--,d(),x<=0&&(clearInterval(T),T=null,p()))}function p(){bt("⏰ Time's Up!",`Timer for "${n}" has ended.`),"vibrate"in navigator&&navigator.vibrate([200,100,200,100,200]),document.querySelector(".timer-controls").style.display="none",document.getElementById("timeup-panel").style.display="block"}function f(y){x+=y*60,N+=y*60,document.getElementById("timeup-panel").style.display="none",document.querySelector(".timer-controls").style.display="flex",d(),T||(T=setInterval(u,1e3)),h("⏱️ Time Added",`+${y} minutes added`)}function m(y){T&&(clearInterval(T),T=null),e.classList.remove("timer-overlay-show"),e.classList.add("timer-overlay-hide"),setTimeout(()=>{e.remove(),a&&a()},400)}T=setInterval(u,1e3),l.addEventListener("click",()=>{i=!i,l.innerHTML=i?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause',l.classList.toggle("btn-resume",i)}),document.getElementById("btn-finish-early").addEventListener("click",async()=>{await G(t),h("✅ Done!","Great focus session!"),m()}),document.getElementById("btn-done-final").addEventListener("click",async()=>{await G(t),h("🎉 Complete!","You crushed it!"),m()}),e.querySelectorAll(".btn-add-time[data-minutes]").forEach(y=>{y.addEventListener("click",()=>{f(parseInt(y.dataset.minutes))})});const w=document.getElementById("random-slider"),K=document.getElementById("random-value");w.addEventListener("input",()=>{K.textContent=`${w.value} min`}),document.getElementById("btn-random-add").addEventListener("click",()=>{const y=parseInt(w.value),v=Math.max(1,Math.floor(Math.random()*y)+1);f(v),h("🎲 Random Time",`Added ${v} random minutes!`)})}function Y(t){const s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}let F=null;function wt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,W(),B(),document.getElementById("btn-refresh").addEventListener("click",async()=>{const s=document.getElementById("btn-refresh");s.disabled=!0;const n=s.querySelector("svg");n.style.animation="spin 1s linear infinite",await tt(),await B(),s.disabled=!1,n.style.animation=""}),F=setInterval(W,6e4),{cleanup:()=>{F&&clearInterval(F)}}}function W(){const t=document.getElementById("greeting");if(!t)return;const s=new Date().getHours();let n="Good evening";s>=5&&s<12?n="Good morning":s>=12&&s<17&&(n="Good afternoon");const a=["🔥","💪","⚡","🚀","✨","🎯","💫"],e=a[Math.floor(Math.random()*a.length)];t.textContent=`${n} ${e}`}async function B(){const t=document.getElementById("focus-cards");if(!t)return;const{subtasks:s,task:n}=await q();if(!n||s.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;return}const a={daily:"🔄 Daily",periodic:"📅 Periodic",oneoff:"🎯 One-off",new:"⭐ New Task"},e={daily:"cat-daily",periodic:"cat-periodic",oneoff:"cat-oneoff",new:"cat-new"},i=a[n.category];let c=`
    <div class="focused-task-header card-enter">
      <div class="focused-task-meta">
        <span class="category-badge ${e[n.category]}">${i}</span>
        <span class="focus-label">Current Focus</span>
      </div>
      <h3 class="focused-task-title">${n.title}</h3>
    </div>
    <div class="subtasks-container">
  `;c+=s.map((o,l)=>{const d=o.status==="done",u=o.priority>=4?"High":o.priority>=3?"Medium":"Low",p=o.priority>=4?"priority-high":o.priority>=3?"priority-med":"priority-low";return`
      <div class="focus-card card-enter ${d?"focus-card-done":""}" style="animation-delay: ${l*.1}s" data-subtask-id="${o.id}">
        <div class="focus-card-header">
          <span class="step-badge">Step ${o.order+1}</span>
          ${d?'<span class="done-badge">✅ Completed</span>':`<span class="priority-badge ${p}">${u}</span>`}
        </div>
        <div class="focus-card-title ${d?"title-strike":""}" style="font-size: 14px; margin-bottom: 10px;">${o.title}</div>
        <div class="focus-card-footer">
          <div class="time-estimate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${o.estimatedMinutes} min
          </div>
          ${d?"":`
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
          `}
        </div>
      </div>
    `}).join(""),c+="</div>",t.innerHTML=c,t.querySelectorAll(".btn-start").forEach(o=>{o.addEventListener("click",l=>{const d=l.currentTarget.dataset.id,u=parseInt(l.currentTarget.dataset.minutes),p=s.find(f=>f.id===d);St(d,u,p?p.title:"Task")})}),t.querySelectorAll(".btn-done").forEach(o=>{o.addEventListener("click",async l=>{const d=l.currentTarget.dataset.id,u=l.currentTarget.closest(".focus-card");u.classList.add("subtask-done-animation");const p=u.querySelector(".btn-done");p&&(p.disabled=!0);const f=await G(d),m=s.map(v=>v.id),{getSubtask:w}=await _(async()=>{const{getSubtask:v}=await Promise.resolve().then(()=>j);return{getSubtask:v}},void 0);if((await Promise.all(m.map(v=>w(v)))).every(v=>v&&v.status==="done"))setTimeout(()=>{Tt()},600);else if(f)h("🎉 Task Complete!","All subtasks for this task are done!"),B();else{u.classList.add("focus-card-done");const v=u.querySelector(".focus-card-actions");v&&(v.style.display="none"),h("✅ Step Complete!","Great work! Finish the set!")}})})}function Tt(){const t=document.createElement("div");t.className="batch-completion-overlay",t.innerHTML=`
    <div class="batch-completion-content">
      <div class="thumbs-up">👍</div>
      <h3>Batch Complete!</h3>
      <p>You're crushing it. Loading the next set...</p>
    </div>
  `,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove(),B()},400)},2500)}function St(t,s,n){kt(t,s,n,()=>{B()})}function xt(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;let s="daily";const n=document.getElementById("add-task-form"),a=document.getElementById("interval-group"),e=document.getElementById("interval-days");return document.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".category-btn").forEach(r=>r.classList.remove("active")),i.classList.add("active"),s=i.dataset.cat,a.style.display=s==="periodic"?"block":"none"})}),document.getElementById("interval-dec").addEventListener("click",()=>{e.value=Math.max(2,parseInt(e.value)-1)}),document.getElementById("interval-inc").addEventListener("click",()=>{e.value=Math.min(365,parseInt(e.value)+1)}),n.addEventListener("submit",async i=>{i.preventDefault();const r=document.getElementById("task-title").value.trim();if(!r)return;const c=s==="periodic"?parseInt(e.value):null,o=ut(r,s,c);await R(o);const l=document.getElementById("btn-submit"),d=l.innerHTML;l.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Breaking it down...',l.disabled=!0,l.classList.add("loading");try{const u=await P(o);for(const m of u)await $(m);n.style.display="none";const p=document.getElementById("breakdown-preview");p.style.display="block";const f=document.getElementById("subtask-list");f.innerHTML=u.map((m,w)=>`
        <div class="subtask-preview-card card-enter" style="animation-delay: ${w*.15}s">
          <div class="subtask-preview-num">${w+1}</div>
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
      `).join(""),h("✅ Task Added!",`"${r}" has been broken into ${u.length} subtasks`)}catch(u){console.error("Failed to break down:",u);try{await V(o.id)}catch(p){console.error("Failed to cleanup empty task:",p)}l.innerHTML=d,l.disabled=!1,l.classList.remove("loading"),h("❌ Error Breakdown",u.message||"Failed to break down task. Please check API Key or try again.")}document.getElementById("btn-go-dashboard").addEventListener("click",()=>{ht("#dashboard")})}),{cleanup:()=>{}}}function It(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,st(),{cleanup:()=>{}}}async function st(){const t=document.getElementById("task-list-content");if(!t)return;const s=await D(),n=s.filter(r=>r.active);if(n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;return}const a=[{key:"daily",label:"🔄 Daily Tasks",cls:"cat-daily"},{key:"periodic",label:"📅 Periodic Tasks",cls:"cat-periodic"},{key:"oneoff",label:"🎯 One-off Tasks",cls:"cat-oneoff"},{key:"new",label:"⭐ New Tasks",cls:"cat-new"}];let e="";for(const r of a){const c=n.filter(o=>o.category===r.key);if(c.length!==0){e+=`
      <div class="task-category-section">
        <div class="category-header ${r.cls}">
          <span>${r.label}</span>
          <span class="task-count">${c.length}</span>
        </div>
        <div class="task-items">
    `;for(const o of c){const l=await S(o.id),d=l.filter(m=>m.status==="done").length,u=l.length,p=u>0?Math.round(d/u*100):0;let f="";o.category==="periodic"&&o.intervalDays?f=`Every ${o.intervalDays} days`:o.completedDates.length>0&&(f=`Done ${o.completedDates.length} time${o.completedDates.length>1?"s":""}`),e+=`
        <div class="task-item card-enter" data-task-id="${o.id}">
          <div class="task-item-content">
            <div class="task-item-title">${o.title}</div>
            ${f?`<div class="task-item-meta">${f}</div>`:""}
            <div class="task-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${p}%"></div>
              </div>
              <span class="progress-text">${d}/${u} subtasks</span>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${o.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `}e+="</div></div>"}}const i=s.filter(r=>!r.active);i.length>0&&(e+=`
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
    `),t.innerHTML=e,t.querySelectorAll(".btn-delete").forEach(r=>{r.addEventListener("click",async c=>{const o=c.currentTarget.dataset.taskId,l=c.currentTarget.closest(".task-item");confirm("Delete this task and all its subtasks?")&&(l.classList.add("card-exit"),setTimeout(async()=>{await V(o),h("🗑️ Deleted","Task removed"),st()},300))})})}function Et(){const t=document.getElementById("app-content");t.innerHTML=`
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
          
          <div class="settings-actions">
            <button type="submit" class="btn btn-primary btn-lg btn-submit">
              Save Key
            </button>
            <button type="button" id="btn-test-api" class="btn btn-outline btn-lg">
              Test Connection
            </button>
          </div>
          <div id="api-test-results" class="test-results" style="display:none;"></div>
        </form>
      </div>
      
      <div class="settings-card card-enter" style="animation-delay: 0.1s; margin-top: 20px;">
        <h3>About FocusFlow</h3>
        <p class="settings-desc">Designed to beat procrastination by turning overwhelming tasks into tiny, focused steps.</p>
        <p class="settings-desc" style="margin-top: 10px; font-size: 12px; opacity: 0.7;">Version 1.1.0 • Built with Vite & PWA</p>
      </div>
    </div>
  `;const s=document.getElementById("api-key-form"),n=document.getElementById("api-key");I("geminiApiKey").then(i=>{i&&(n.value=i)}),s.addEventListener("submit",async i=>{i.preventDefault();const r=n.value.trim();if(!r){await E("geminiApiKey",null),h("⚠️ Cleared","API Key removed");return}await E("geminiApiKey",r),h("✅ Saved!","Your API Key is securely stored.")});const a=document.getElementById("btn-test-api"),e=document.getElementById("api-test-results");return a.addEventListener("click",async()=>{var r;const i=n.value.trim();if(!i)return h("⚠️ Error","Please enter an API Key first.");a.disabled=!0,a.innerHTML="Testing...",e.style.display="block",e.innerHTML='<p class="loading-text">Fetching authorized models...</p>';try{const c=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${i}`);if(!c.ok){const u=await c.json();throw new Error(((r=u.error)==null?void 0:r.message)||`HTTP ${c.status}`)}const l=(await c.json()).models||[];if(l.length===0){e.innerHTML='<p class="error-text">No models found for this key.</p>';return}const d=l.filter(u=>u.name.includes("gemini"));e.innerHTML=`
        <p class="success-text">✅ Connection Successful!</p>
        <p class="results-hint">Found these Gemini models on your key:</p>
        <ul class="model-list">
          ${d.map(u=>`<li><code>${u.name.replace("models/","")}</code></li>`).join("")}
        </ul>
        <p class="results-hint">If "gemini-1.5-flash" isn't listed, please enable it in Google AI Studio.</p>
      `,h("✅ Connected",`Found ${d.length} Gemini models!`)}catch(c){console.error(c),e.innerHTML=`<p class="error-text">❌ Connection Failed: ${c.message}</p>`,h("❌ Failed","API Key check failed")}finally{a.disabled=!1,a.innerHTML="Test Connection"}}),{cleanup:()=>{}}}async function $t(){const t=document.getElementById("app");t.innerHTML=`
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
  `,await g(),await vt(),gt(),M("#dashboard",wt),M("#add",xt),M("#tasks",It),M("#settings",Et);const s=document.querySelectorAll(".nav-btn");function n(){const a=window.location.hash||"#dashboard";s.forEach(e=>{e.classList.toggle("active",e.dataset.route===a)})}s.forEach(a=>{a.addEventListener("click",()=>{window.location.hash=a.dataset.route})}),window.addEventListener("hashchange",n),yt("#dashboard"),n()}$t().catch(console.error);
