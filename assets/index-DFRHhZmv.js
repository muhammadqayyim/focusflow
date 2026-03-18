(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();const ut="focusflow",pt=1;let P=null;function f(){return new Promise((t,s)=>{if(P)return t(P);const n=indexedDB.open(ut,pt);n.onupgradeneeded=a=>{const e=a.target.result;if(e.objectStoreNames.contains("tasks")||e.createObjectStore("tasks",{keyPath:"id"}).createIndex("category","category",{unique:!1}),!e.objectStoreNames.contains("subtasks")){const o=e.createObjectStore("subtasks",{keyPath:"id"});o.createIndex("taskId","taskId",{unique:!1}),o.createIndex("status","status",{unique:!1})}e.objectStoreNames.contains("appState")||e.createObjectStore("appState",{keyPath:"key"})},n.onsuccess=a=>{P=a.target.result,t(P)},n.onerror=a=>s(a.target.error)})}function k(t,s="readonly"){return P.transaction(t,s).objectStore(t)}function w(t){return new Promise((s,n)=>{t.onsuccess=()=>s(t.result),t.onerror=()=>n(t.error)})}async function z(t){return await f(),w(k("tasks","readwrite").put(t))}async function mt(t){return await f(),w(k("tasks").get(t))}async function A(){return await f(),w(k("tasks").getAll())}async function U(t){await f();const s=await S(t),n=k("subtasks","readwrite");for(const a of s)n.delete(a.id);return w(k("tasks","readwrite").delete(t))}async function K(t){return z(t)}async function B(t){return await f(),w(k("subtasks","readwrite").put(t))}async function vt(t){return await f(),w(k("subtasks").get(t))}async function S(t){await f();const s=k("subtasks").index("taskId");return w(s.getAll(t))}async function ht(t){return B(t)}async function F(t){return await f(),w(k("subtasks","readwrite").delete(t))}async function L(t){await f();const s=await w(k("appState").get(t));return s?s.value:null}async function E(t,s){return await f(),w(k("appState","readwrite").put({key:t,value:s}))}const D=Object.freeze(Object.defineProperty({__proto__:null,addSubtask:B,addTask:z,deleteSubtask:F,deleteTask:U,getAllTasks:A,getState:L,getSubtask:vt,getSubtasksByTask:S,getTask:mt,openDB:f,setState:E,updateSubtask:ht,updateTask:K},Symbol.toStringTag,{value:"Module"})),yt="modulepreload",ft=function(t){return"/focusflow/"+t},tt={},I=function(s,n,a){let e=Promise.resolve();if(n&&n.length>0){let u=function(i){return Promise.all(i.map(c=>Promise.resolve(c).then(r=>({status:"fulfilled",value:r}),r=>({status:"rejected",reason:r}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));e=u(n.map(i=>{if(i=ft(i),i in tt)return;tt[i]=!0;const c=i.endsWith(".css"),r=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${r}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":yt,c||(p.as="script"),p.crossOrigin="",p.href=i,d&&p.setAttribute("nonce",d),document.head.appendChild(p),c)return new Promise((v,m)=>{p.addEventListener("load",v),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})}))}function o(u){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=u,window.dispatchEvent(l),!l.defaultPrevented)throw u}return e.then(u=>{for(const l of u||[])l.status==="rejected"&&o(l.reason);return s().catch(o)})};let gt=0;function it(){return Date.now().toString(36)+"-"+(++gt).toString(36)+"-"+Math.random().toString(36).slice(2,7)}function bt(t,s,n=null){return{id:it(),title:t.trim(),category:s,intervalDays:n,createdAt:Date.now(),completedDates:[],lastScheduledDate:null,active:!0}}function ot(t,s,n,a,e=0){return{id:it(),taskId:t,title:s.trim(),estimatedMinutes:n,priority:a,order:e,status:"pending",completedAt:null,addedTimeMinutes:0}}const et={daily:t=>[{t:`Set up & prepare to start: ${t}`,min:5,p:3},{t:`Focus on the main work: ${t}`,min:20,p:5},{t:`Wrap up & quick review of: ${t}`,min:5,p:4}],periodic:t=>[{t:`Recall where you left off & review progress on: ${t}`,min:5,p:3},{t:`Do the core work session: ${t}`,min:20,p:5},{t:`Document progress & set reminders for next time: ${t}`,min:5,p:4}],oneoff:t=>[{t:`Research & figure out the approach for: ${t}`,min:10,p:3},{t:`Execute the main action: ${t}`,min:20,p:5},{t:`Verify completion & do any follow-ups for: ${t}`,min:10,p:4}],new:t=>[{t:`Understand requirements & ask clarifying questions about: ${t}`,min:10,p:3},{t:`Create first draft / initial attempt: ${t}`,min:20,p:5},{t:`Review your work & refine: ${t}`,min:10,p:4}]};function kt(t){return console.warn("Using fallback breakdown for:",t.title),(et[t.category]||et.daily)(t.title).map((a,e)=>ot(t.id,a.t,a.min,a.p,e))}async function H(t){var a;const s=await L("geminiApiKey");if(!s)return kt(t);const n=`
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
  `.trim();try{const e=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:n}]}],generationConfig:{temperature:.1}})});if(!e.ok){let d;try{d=await e.json()}catch{d={error:{message:`HTTP ${e.status}: ${e.statusText}`}}}const i=((a=d.error)==null?void 0:a.message)||`API Error: ${e.status}`;throw new Error(i)}let u=(await e.json()).candidates[0].content.parts[0].text;u=u.replace(/```json|```/g,"").trim();let l=JSON.parse(u);if(!Array.isArray(l)||l.length===0)throw new Error("Invalid format from API");return l.map((d,i)=>{const c=d.t||d.title||d.task||`Step ${i+1} for ${t.title}`,r=parseInt(d.min||d.minutes||d.time)||15,p=parseInt(d.p||d.priority)||3;return ot(t.id,c,r,p,i)})}catch(e){throw console.error("Gemini API Breakdown failed:",e),e}}function Y(t){const s=Date.now(),n=new Date().getHours(),a=t.map(e=>{let o=0;if(o+=({new:5,oneoff:4,daily:3,periodic:2}[e.category]||2)*6,e.category==="periodic"&&e.intervalDays){const i=e.completedDates.length>0?new Date(e.completedDates[e.completedDates.length-1]).getTime():e.createdAt,r=(s-i)/(1e3*60*60*24)/e.intervalDays;o+=Math.min(r*12.5,25)}else if(e.category==="daily"){const i=new Date().toISOString().slice(0,10);e.completedDates.includes(i)||(o+=20)}else if(e.category==="new"){const i=(s-e.createdAt)/36e5;o+=Math.min(i*2,25)}n>=6&&n<=14&&(o+=10);const d=(s-e.createdAt)/(1e3*60*60*24);return o+=Math.max(10-d*2,0),{task:e,score:o}});return a.sort((e,o)=>o.score-e.score),a.map(e=>e.task)}function wt(t){return t.filter(n=>n.status!=="done").sort((n,a)=>n.order-a.order).slice(0,3)}function W(){return new Date().toISOString().slice(0,10)}async function rt(){const t=await L("lastActiveDate"),s=W();return t===s?!1:(await Tt(s),await E("lastActiveDate",s),!0)}async function Tt(t){const s=await A();for(const n of s)if(n.active)switch(n.category){case"daily":{const a=await S(n.id);for(const o of a)o.status==="done"?await F(o.id):await F(o.id);const e=H(n);for(const o of e)await B(o);break}case"periodic":{const a=n.completedDates.length>0?n.completedDates[n.completedDates.length-1]:null;let e=!1;if(!a)e=!0;else{const o=new Date(a);e=Math.floor((new Date(t)-o)/(1e3*60*60*24))>=(n.intervalDays||1)}if(e&&n.lastScheduledDate!==t){const o=await S(n.id);for(const l of o)await F(l.id);const u=H(n);for(const l of u)await B(l);n.lastScheduledDate=t,await K(n)}break}case"oneoff":{n.completedDates.includes(t)&&(n.active=!1,await K(n));break}case"new":{if((await S(n.id)).length===0){const e=H(n);for(const o of e)await B(o)}break}}}async function j(){const s=(await A()).filter(d=>d.active);if(s.length===0)return{subtasks:[],task:null};const n=Y(s);let a=await L("currentFocusTaskIndex")||0;a>=n.length&&(a=0,await E("currentFocusTaskIndex",0));const e=n[a],o=await S(e.id);let u=await L(`focusBatch_${e.id}`),l=[];if(u&&Array.isArray(u)){const d=o.filter(c=>u.includes(c.id));!(d.length>0&&d.every(c=>c.status==="done"))&&d.length>0&&(l=d.sort((c,r)=>c.order-r.order))}if(l.length===0){const d=wt(o);if(d.length===0&&n.length>1)return await J();d.length>0&&(l=d,await E(`focusBatch_${e.id}`,l.map(i=>i.id)))}return{subtasks:l,task:e}}async function J(){const s=(await A()).filter(e=>e.active);if(s.length<=1)return await j();const n=Y(s);let a=await L("currentFocusTaskIndex")||0;return a=(a+1)%n.length,await E("currentFocusTaskIndex",a),await j()}async function N(t){const{getSubtask:s,updateSubtask:n}=await I(async()=>{const{getSubtask:u,updateSubtask:l}=await Promise.resolve().then(()=>D);return{getSubtask:u,updateSubtask:l}},void 0),a=await s(t);if(!a)return;a.status="done",a.completedAt=Date.now(),await n(a);const o=(await S(a.taskId)).every(u=>u.status==="done");if(o){const{getTask:u,updateTask:l}=await I(async()=>{const{getTask:i,updateTask:c}=await Promise.resolve().then(()=>D);return{getTask:i,updateTask:c}},void 0),d=await u(a.taskId);d&&(d.completedDates.push(W()),d.category==="oneoff"&&(d.active=!1),await l(d))}return o}async function xt(t){const n=(await A()).filter(o=>o.active),e=Y(n).findIndex(o=>o.id===t);e!==-1&&await E("currentFocusTaskIndex",e)}const St=Object.freeze(Object.defineProperty({__proto__:null,checkNewDay:rt,completeSubtask:N,getFocusSubtasks:j,setFocusTask:xt,shuffleFocusTask:J,todayStr:W},Symbol.toStringTag,{value:"Module"})),ct={};let _=null;function C(t,s){ct[t]=s}function R(t){window.location.hash=t}function lt(t="#dashboard"){const s=()=>{const n=window.location.hash||t,a=ct[n];a&&(_&&_.cleanup&&_.cleanup(),_=a())};window.addEventListener("hashchange",s),window.location.hash?s():window.location.hash=t}const It=Object.freeze(Object.defineProperty({__proto__:null,initRouter:lt,navigate:R,registerRoute:C},Symbol.toStringTag,{value:"Module"}));let O=!1;async function Et(){return"Notification"in window?Notification.permission==="granted"?(O=!0,!0):Notification.permission!=="denied"?(O=await Notification.requestPermission()==="granted",O):!1:!1}function $t(t,s){O&&document.hidden&&new Notification(t,{body:s,icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",vibrate:[200,100,200]}),y(t,s)}function y(t,s,n=4e3){const a=document.getElementById("toast-container");if(!a)return;const e=document.createElement("div");e.className="toast",e.innerHTML=`
    <div class="toast-title">${t}</div>
    ${s?`<div class="toast-body">${s}</div>`:""}
  `,a.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast-show")),setTimeout(()=>{e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>e.remove(),400)},n)}let x=null,$=0,G=0;function Lt(t,s,n,a){$=s*60,G=s*60;const e=document.createElement("div");e.className="timer-overlay",e.id="timer-overlay",e.innerHTML=`
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
          ${st($)}
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
  `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("timer-overlay-show"));let o=!1;const u=document.getElementById("timer-display"),l=document.getElementById("timer-progress-ring"),d=2*Math.PI*88,i=document.getElementById("btn-pause");function c(){u&&(u.textContent=st($));const h=1-$/G,M=d*h;l&&(l.style.strokeDashoffset=M)}function r(){o||($--,c(),$<=0&&(clearInterval(x),x=null,p()))}function p(){$t("⏰ Time's Up!",`Timer for "${n}" has ended.`),"vibrate"in navigator&&navigator.vibrate([200,100,200,100,200]),document.querySelector(".timer-controls").style.display="none",document.getElementById("timeup-panel").style.display="block"}function v(h){$+=h*60,G+=h*60,document.getElementById("timeup-panel").style.display="none",document.querySelector(".timer-controls").style.display="flex",c(),x||(x=setInterval(r,1e3)),y("⏱️ Time Added",`+${h} minutes added`)}function m(h){x&&(clearInterval(x),x=null),e.classList.remove("timer-overlay-show"),e.classList.add("timer-overlay-hide"),setTimeout(()=>{e.remove(),a&&a()},400)}x=setInterval(r,1e3),i.addEventListener("click",()=>{o=!o,i.innerHTML=o?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause',i.classList.toggle("btn-resume",o)}),document.getElementById("btn-finish-early").addEventListener("click",async()=>{await N(t),y("✅ Done!","Great focus session!"),m()}),document.getElementById("btn-done-final").addEventListener("click",async()=>{await N(t),y("🎉 Complete!","You crushed it!"),m()}),e.querySelectorAll(".btn-add-time[data-minutes]").forEach(h=>{h.addEventListener("click",()=>{v(parseInt(h.dataset.minutes))})});const g=document.getElementById("random-slider"),T=document.getElementById("random-value");g.addEventListener("input",()=>{T.textContent=`${g.value} min`}),document.getElementById("btn-random-add").addEventListener("click",()=>{const h=parseInt(g.value),M=Math.max(1,Math.floor(Math.random()*h)+1);v(M),y("🎲 Random Time",`Added ${M} random minutes!`)})}function st(t){const s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}let V=null;function Bt(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,nt(),q(),document.getElementById("btn-refresh").addEventListener("click",async()=>{const s=document.getElementById("btn-refresh");s.disabled=!0;const n=s.querySelector("svg");n.style.animation="spin 1s linear infinite",await J(),await q(),s.disabled=!1,n.style.animation=""}),V=setInterval(nt,6e4),{cleanup:()=>{V&&clearInterval(V)}}}function nt(){const t=document.getElementById("greeting");if(!t)return;const s=new Date().getHours();let n="Good evening";s>=5&&s<12?n="Good morning":s>=12&&s<17&&(n="Good afternoon");const a=["🔥","💪","⚡","🚀","✨","🎯","💫"],e=a[Math.floor(Math.random()*a.length)];t.textContent=`${n} ${e}`}async function q(){const t=document.getElementById("focus-cards");if(!t)return;const{subtasks:s,task:n}=await j();if(!n||s.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;return}const a={daily:"🔄 Daily",periodic:"📅 Periodic",oneoff:"🎯 One-off",new:"⭐ New Task"},e={daily:"cat-daily",periodic:"cat-periodic",oneoff:"cat-oneoff",new:"cat-new"},o=a[n.category];let l=`
      <div class="focused-task-header card-enter">
        <div class="focused-task-meta">
          <span class="category-badge ${e[n.category]}">${o}</span>
          <span class="focus-label">Current Focus</span>
        </div>
        <div class="focused-task-title-row">
          <h3 class="focused-task-title">${n.title}</h3>
          <button class="btn-icon btn-view-tasks" data-task-id="${n.id}" title="View in Tasks">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>
    <div class="subtasks-container">
  `;l+=s.map((i,c)=>{const r=i.status==="done",p=i.priority>=4?"High":i.priority>=3?"Medium":"Low",v=i.priority>=4?"priority-high":i.priority>=3?"priority-med":"priority-low";return`
      <div class="focus-card card-enter ${r?"focus-card-done":""}" style="animation-delay: ${c*.1}s" data-subtask-id="${i.id}">
        <div class="focus-card-header">
          <span class="step-badge">Step ${i.order+1}</span>
          ${r?'<span class="done-badge">✅ Completed</span>':`<span class="priority-badge ${v}">${p}</span>`}
        </div>
        <div class="focus-card-title ${r?"title-strike":""}" style="font-size: 14px; margin-bottom: 10px;">${i.title}</div>
        <div class="focus-card-footer">
          <div class="time-estimate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${i.estimatedMinutes} min
          </div>
          ${r?"":`
          <div class="focus-card-actions">
            <button class="btn btn-sm btn-start" data-id="${i.id}" data-minutes="${i.estimatedMinutes}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start
            </button>
            <button class="btn btn-sm btn-done" data-id="${i.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </button>
          </div>
          `}
        </div>
      </div>
    `}).join(""),l+="</div>",t.innerHTML=l,t.querySelectorAll(".btn-start").forEach(i=>{i.addEventListener("click",c=>{const r=c.currentTarget.dataset.id,p=parseInt(c.currentTarget.dataset.minutes),v=s.find(m=>m.id===r);Mt(r,p,v?v.title:"Task")})});const d=t.querySelector(".btn-view-tasks");d&&d.addEventListener("click",async i=>{const c=i.currentTarget.dataset.taskId,{setState:r}=await I(async()=>{const{setState:p}=await Promise.resolve().then(()=>D);return{setState:p}},void 0);await r("highlightTaskId",c),R("#tasks")}),t.querySelectorAll(".btn-done").forEach(i=>{i.addEventListener("click",async c=>{const r=c.currentTarget.dataset.id,p=c.currentTarget.closest(".focus-card");p.classList.add("subtask-done-animation");const v=p.querySelector(".btn-done");if(v&&(v.disabled=!0),await N(r)){setTimeout(()=>{Dt(n.title)},100);return}const g=s.map(b=>b.id),{getSubtask:T}=await I(async()=>{const{getSubtask:b}=await Promise.resolve().then(()=>D);return{getSubtask:b}},void 0);if((await Promise.all(g.map(b=>T(b)))).every(b=>b&&b.status==="done"))setTimeout(()=>{At()},600);else{p.classList.add("focus-card-done");const b=p.querySelector(".focus-card-actions");b&&(b.style.display="none");const X=p.querySelector(".focus-card-header");if(X){const Z=X.querySelector(".priority-badge");Z&&(Z.outerHTML='<span class="done-badge">✅ Completed</span>')}const Q=p.querySelector(".focus-card-title");Q&&Q.classList.add("title-strike"),y("✅ Step Complete!","Great work! Finish the set!")}})})}function Dt(t){const s=document.createElement("div");s.className="full-task-completion-overlay",s.innerHTML=`
    <div class="celebration-content">
      <div class="trophy-bounce">🏆</div>
      <h2 style="color: var(--primary); margin-bottom: 8px;">Task Mastered!</h2>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">"${t}" is officially complete.</p>
      <div class="celebration-badge" style="background: var(--accent-green-soft); color: #059669; padding: 8px 16px; border-radius: 20px; font-weight: 700; display: inline-block;">
        +500 Focus XP
      </div>
    </div>
  `;for(let n=0;n<50;n++){const a=document.createElement("div");a.className="confetti-piece",a.style.left=Math.random()*100+"vw",a.style.backgroundColor=["#6366f1","#fbbf24","#059669","#ec4899","#8b5cf6"][Math.floor(Math.random()*5)],a.style.animationDelay=Math.random()*2+"s",a.style.width=Math.random()*10+5+"px",a.style.height=Math.random()*10+5+"px",s.appendChild(a)}document.body.appendChild(s),setTimeout(()=>{s.classList.add("show")},10),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>{s.remove(),R("#tasks")},500)},3500)}function At(){const t=document.createElement("div");t.className="batch-completion-overlay",t.innerHTML=`
    <div class="batch-completion-content">
      <div class="thumbs-up">👍</div>
      <h3>Batch Complete!</h3>
      <p>You're crushing it. Loading the next set...</p>
    </div>
  `,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove(),q()},400)},2500)}function Mt(t,s,n){Lt(t,s,n,()=>{q()})}function Pt(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;let s="daily";const n=document.getElementById("add-task-form"),a=document.getElementById("interval-group"),e=document.getElementById("interval-days");return document.querySelectorAll(".category-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".category-btn").forEach(u=>u.classList.remove("active")),o.classList.add("active"),s=o.dataset.cat,a.style.display=s==="periodic"?"block":"none"})}),document.getElementById("interval-dec").addEventListener("click",()=>{e.value=Math.max(2,parseInt(e.value)-1)}),document.getElementById("interval-inc").addEventListener("click",()=>{e.value=Math.min(365,parseInt(e.value)+1)}),n.addEventListener("submit",async o=>{o.preventDefault();const u=document.getElementById("task-title").value.trim();if(!u)return;const l=s==="periodic"?parseInt(e.value):null,d=bt(u,s,l);await z(d);const i=document.getElementById("btn-submit"),c=i.innerHTML;i.innerHTML='<svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Breaking it down...',i.disabled=!0;try{const r=await H(d);for(const m of r)await B(m);n.style.display="none";const p=document.getElementById("breakdown-preview");p.style.display="block";const v=document.getElementById("subtask-list");v.innerHTML=r.map((m,g)=>`
        <div class="subtask-preview-card card-enter" style="animation-delay: ${g*.15}s">
          <div class="subtask-preview-num">${g+1}</div>
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
      `).join(""),y("✅ Task Added!",`"${u}" has been broken into ${r.length} subtasks`)}catch(r){console.error("Failed to break down:",r);try{await U(d.id)}catch(p){console.error("Failed to cleanup empty task:",p)}i.innerHTML=c,i.disabled=!1,y("❌ Error Breakdown",r.message||"Failed to break down task. Please check API Key or try again.")}document.getElementById("btn-go-dashboard").addEventListener("click",()=>{R("#dashboard")})}),{cleanup:()=>{}}}function Ct(){const t=document.getElementById("app-content");return t.innerHTML=`
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
  `,dt(),{cleanup:()=>{}}}async function dt(){const t=document.getElementById("task-list-content");if(!t)return;const s=await A(),n=s.filter(i=>i.active);if(n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;return}const a=[{key:"daily",label:"🔄 Daily Tasks",cls:"cat-daily"},{key:"periodic",label:"📅 Periodic Tasks",cls:"cat-periodic"},{key:"oneoff",label:"🎯 One-off Tasks",cls:"cat-oneoff"},{key:"new",label:"⭐ New Tasks",cls:"cat-new"}];let e="";for(const i of a){const c=n.filter(r=>r.category===i.key);if(c.length!==0){e+=`
      <div class="task-category-section">
        <div class="category-header ${i.cls}">
          <span>${i.label}</span>
          <span class="task-count">${c.length}</span>
        </div>
        <div class="task-items">
    `;for(const r of c){const p=await S(r.id),v=p.filter(h=>h.status==="done").length,m=p.length,g=m>0?Math.round(v/m*100):0;let T="";r.category==="periodic"&&r.intervalDays?T=`Every ${r.intervalDays} days`:r.completedDates.length>0&&(T=`Done ${r.completedDates.length} time${r.completedDates.length>1?"s":""}`),e+=`
        <div class="task-item card-enter" data-task-id="${r.id}">
          <div class="task-item-click-area">
            <div class="task-item-content">
              <div class="task-item-title" id="title-${r.id}">
                ${g===100?'<span class="congratulation-symbol">🏆</span>':""}
                ${r.title}
              </div>
              ${T?`<div class="task-item-meta">${T}</div>`:""}
              <div class="task-item-progress">
                <div class="progress-bar">
                  <div class="progress-fill" id="progress-${r.id}" style="width: ${g}%"></div>
                </div>
                <span class="progress-text" id="text-${r.id}">${v}/${m} subtasks</span>
              </div>
            </div>
            <div class="expand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="subtasks-expand-container" id="subs-container-${r.id}">
            <div class="subtask-details-list-content" id="subs-content-${r.id}"></div>
            <div class="subtask-expansion-footer">
              <button class="btn btn-primary btn-focus" data-task-id="${r.id}">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                 Go to Focus
              </button>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${r.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `}e+="</div></div>"}}const o=s.filter(i=>!i.active);o.length>0&&(e+=`
      <div class="task-category-section">
        <div class="category-header cat-done">
          <span>✅ Completed</span>
          <span class="task-count">${o.length}</span>
        </div>
        <div class="task-items">
          ${o.map(i=>`
            <div class="task-item task-item-completed">
              <div class="task-item-content">
                <div class="task-item-title">
                  <span class="congratulation-symbol">🏆</span>
                  ${i.title}
                </div>
                <div class="task-item-meta">Completed</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `),t.innerHTML=e,t.querySelectorAll(".task-item-click-area").forEach(i=>{i.addEventListener("click",c=>{const r=c.currentTarget.closest(".task-item"),p=r.dataset.taskId,v=document.getElementById(`subs-content-${p}`);r.classList.toggle("expanded")&&v.innerHTML===""&&at(p,v)})}),t.querySelectorAll(".btn-focus").forEach(i=>{i.addEventListener("click",async c=>{c.stopPropagation();const r=c.currentTarget.dataset.taskId,{setFocusTask:p}=await I(async()=>{const{setFocusTask:m}=await Promise.resolve().then(()=>St);return{setFocusTask:m}},void 0),{navigate:v}=await I(async()=>{const{navigate:m}=await Promise.resolve().then(()=>It);return{navigate:m}},void 0);await p(r),v("#dashboard")})}),t.querySelectorAll(".btn-delete").forEach(i=>{i.addEventListener("click",async c=>{const r=c.currentTarget.dataset.taskId,p=c.currentTarget.closest(".task-item");confirm("Delete this task and all its subtasks?")&&(p.classList.add("card-exit"),setTimeout(async()=>{await U(r),y("🗑️ Deleted","Task removed"),dt()},300))})});const{getState:u,setState:l}=await I(async()=>{const{getState:i,setState:c}=await Promise.resolve().then(()=>D);return{getState:i,setState:c}},void 0),d=await u("highlightTaskId");if(d){const i=t.querySelector(`.task-item[data-task-id="${d}"]`);i&&(setTimeout(async()=>{i.classList.add("expanded","task-highlight-pulse");const c=document.getElementById(`subs-content-${d}`);await at(d,c),i.scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(()=>i.classList.remove("task-highlight-pulse"),3e3)},300),await l("highlightTaskId",null))}}async function at(t,s){const{getSubtasksByTask:n}=await I(async()=>{const{getSubtasksByTask:e}=await Promise.resolve().then(()=>D);return{getSubtasksByTask:e}},void 0),a=await n(t);if(a.length===0){s.innerHTML='<div class="no-subs">No subtasks found</div>';return}s.innerHTML=`
    <div class="subtask-details-list">
      ${a.map(e=>`
        <div class="subtask-detail-item">
          <label class="checkbox-container read-only">
            <input type="checkbox" ${e.status==="done"?"checked":""} disabled data-sub-id="${e.id}">
            <span class="checkmark"></span>
            <span class="subtask-text ${e.status==="done"?"st-done":""}">${e.title}</span>
          </label>
        </div>
      `).join("")}
    </div>
  `}function _t(){const t=document.getElementById("app-content");t.innerHTML=`
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
  `;const s=document.getElementById("api-key-form"),n=document.getElementById("api-key");L("geminiApiKey").then(o=>{o&&(n.value=o)}),s.addEventListener("submit",async o=>{o.preventDefault();const u=n.value.trim();if(!u){await E("geminiApiKey",null),y("⚠️ Cleared","API Key removed");return}await E("geminiApiKey",u),y("✅ Saved!","Your API Key is securely stored.")});const a=document.getElementById("btn-test-api"),e=document.getElementById("api-test-results");return a.addEventListener("click",async()=>{var u;const o=n.value.trim();if(!o)return y("⚠️ Error","Please enter an API Key first.");a.disabled=!0,a.innerHTML="Testing...",e.style.display="block",e.innerHTML='<p class="loading-text">Fetching authorized models...</p>';try{const l=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${o}`);if(!l.ok){const r=await l.json();throw new Error(((u=r.error)==null?void 0:u.message)||`HTTP ${l.status}`)}const i=(await l.json()).models||[];if(i.length===0){e.innerHTML='<p class="error-text">No models found for this key.</p>';return}const c=i.filter(r=>r.name.includes("gemini"));e.innerHTML=`
        <p class="success-text">✅ Connection Successful!</p>
        <p class="results-hint">Found these Gemini models on your key:</p>
        <ul class="model-list">
          ${c.map(r=>`<li><code>${r.name.replace("models/","")}</code></li>`).join("")}
        </ul>
        <p class="results-hint">If "gemini-1.5-flash" isn't listed, please enable it in Google AI Studio.</p>
      `,y("✅ Connected",`Found ${c.length} Gemini models!`)}catch(l){console.error(l),e.innerHTML=`<p class="error-text">❌ Connection Failed: ${l.message}</p>`,y("❌ Failed","API Key check failed")}finally{a.disabled=!1,a.innerHTML="Test Connection"}}),{cleanup:()=>{}}}async function Ft(){const t=document.getElementById("app");t.innerHTML=`
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
  `,await f(),await rt(),Et(),C("#dashboard",Bt),C("#add",Pt),C("#tasks",Ct),C("#settings",_t);const s=document.querySelectorAll(".nav-btn");function n(){const a=window.location.hash||"#dashboard";s.forEach(e=>{e.classList.toggle("active",e.dataset.route===a)})}s.forEach(a=>{a.addEventListener("click",()=>{window.location.hash=a.dataset.route})}),window.addEventListener("hashchange",n),lt("#dashboard"),n()}Ft().catch(console.error);
