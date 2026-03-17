// ============================================================
// dashboard.js — Main view showing 3 active subtasks
// ============================================================

import { getFocusSubtasks, completeSubtask } from '../scheduler.js';
import { getAllTasks, getSubtask, updateSubtask } from '../storage.js';
import { showToast } from '../components/notification.js';
import { navigate } from '../router.js';
import { renderTimer } from './timer.js';

let refreshInterval = null;

export function renderDashboard() {
  const app = document.getElementById('app-content');
  app.innerHTML = `
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
  `;

  updateGreeting();
  loadFocusTasks();

  document.getElementById('btn-refresh').addEventListener('click', loadFocusTasks);

  // Refresh greeting every minute
  refreshInterval = setInterval(updateGreeting, 60000);

  return {
    cleanup: () => {
      if (refreshInterval) clearInterval(refreshInterval);
    }
  };
}

function updateGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const hour = new Date().getHours();
  let greet = 'Good evening';
  if (hour >= 5 && hour < 12) greet = 'Good morning';
  else if (hour >= 12 && hour < 17) greet = 'Good afternoon';

  const emojis = ['🔥', '💪', '⚡', '🚀', '✨', '🎯', '💫'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  el.textContent = `${greet} ${emoji}`;
}

async function loadFocusTasks() {
  const container = document.getElementById('focus-cards');
  if (!container) return;

  const { subtasks, tasks } = await getFocusSubtasks();
  const taskMap = {};
  for (const t of tasks) taskMap[t.id] = t;

  if (subtasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet!</h3>
        <p>Add some tasks to get started on your productive journey.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Your First Task
        </button>
      </div>
    `;
    return;
  }

  const categoryLabels = {
    daily: '🔄 Daily',
    periodic: '📅 Periodic',
    oneoff: '🎯 One-off',
    new: '⭐ New Task'
  };

  const categoryClasses = {
    daily: 'cat-daily',
    periodic: 'cat-periodic',
    oneoff: 'cat-oneoff',
    new: 'cat-new'
  };

  container.innerHTML = subtasks.map((sub, i) => {
    const task = taskMap[sub.taskId];
    const catLabel = task ? categoryLabels[task.category] : '';
    const catClass = task ? categoryClasses[task.category] : '';
    const priorityLabel = sub.priority >= 4 ? 'High' : sub.priority >= 3 ? 'Medium' : 'Low';
    const priorityClass = sub.priority >= 4 ? 'priority-high' : sub.priority >= 3 ? 'priority-med' : 'priority-low';

    return `
      <div class="focus-card card-enter" style="animation-delay: ${i * 0.1}s" data-subtask-id="${sub.id}">
        <div class="focus-card-header">
          <span class="category-badge ${catClass}">${catLabel}</span>
          <span class="priority-badge ${priorityClass}">${priorityLabel}</span>
        </div>
        <div class="focus-card-parent">${task ? task.title : ''}</div>
        <div class="focus-card-title">${sub.title}</div>
        <div class="focus-card-footer">
          <div class="time-estimate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${sub.estimatedMinutes} min
          </div>
          <div class="focus-card-actions">
            <button class="btn btn-sm btn-start" data-id="${sub.id}" data-minutes="${sub.estimatedMinutes}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start
            </button>
            <button class="btn btn-sm btn-done" data-id="${sub.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners
  container.querySelectorAll('.btn-start').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const minutes = parseInt(e.currentTarget.dataset.minutes);
      const sub = subtasks.find(s => s.id === id);
      startTimer(id, minutes, sub ? sub.title : 'Task');
    });
  });

  container.querySelectorAll('.btn-done').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      const card = e.currentTarget.closest('.focus-card');
      card.classList.add('card-complete');
      
      setTimeout(async () => {
        const allDone = await completeSubtask(id);
        if (allDone) {
          showToast('🎉 Task Complete!', 'All subtasks for this task are done!');
        } else {
          showToast('✅ Subtask Done!', 'Great work! Keep going!');
        }
        loadFocusTasks();
      }, 500);
    });
  });
}

function startTimer(subtaskId, minutes, title) {
  renderTimer(subtaskId, minutes, title, () => {
    loadFocusTasks();
  });
}
