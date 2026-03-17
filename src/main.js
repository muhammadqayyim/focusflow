// ============================================================
// main.js — App entry point
// ============================================================

import { openDB } from './storage.js';
import { checkNewDay } from './scheduler.js';
import { registerRoute, initRouter } from './router.js';
import { requestNotificationPermission } from './components/notification.js';
import { renderDashboard } from './views/dashboard.js';
import { renderAddTask } from './views/addTask.js';
import { renderTaskList } from './views/taskList.js';
import './styles/main.css';

async function init() {
  // Build shell
  const app = document.getElementById('app');
  app.innerHTML = `
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
  `;

  // Init DB
  await openDB();

  // Check for new day
  await checkNewDay();

  // Request notification permission
  requestNotificationPermission();

  // Register routes
  registerRoute('#dashboard', renderDashboard);
  registerRoute('#add', renderAddTask);
  registerRoute('#tasks', renderTaskList);

  // Nav highlight
  const navBtns = document.querySelectorAll('.nav-btn');
  function updateNav() {
    const hash = window.location.hash || '#dashboard';
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === hash);
    });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.route;
    });
  });

  window.addEventListener('hashchange', updateNav);

  // Start router
  initRouter('#dashboard');
  updateNav();
}

// Boot
init().catch(console.error);
