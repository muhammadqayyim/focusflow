// ============================================================
// taskList.js — View all tasks grouped by category
// ============================================================

import { getAllTasks, deleteTask, getSubtasksByTask } from '../storage.js';
import { showToast } from '../components/notification.js';

export function renderTaskList() {
  const app = document.getElementById('app-content');
  app.innerHTML = `
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
  `;

  loadTaskList();
  return { cleanup: () => {} };
}

async function loadTaskList() {
  const container = document.getElementById('task-list-content');
  if (!container) return;

  const tasks = await getAllTasks();
  const activeTasks = tasks.filter(t => t.active);

  if (activeTasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Add tasks to see them here.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#add'">
          Add Task
        </button>
      </div>
    `;
    return;
  }

  const categories = [
    { key: 'daily', label: '🔄 Daily Tasks', cls: 'cat-daily' },
    { key: 'periodic', label: '📅 Periodic Tasks', cls: 'cat-periodic' },
    { key: 'oneoff', label: '🎯 One-off Tasks', cls: 'cat-oneoff' },
    { key: 'new', label: '⭐ New Tasks', cls: 'cat-new' }
  ];

  let html = '';

  for (const cat of categories) {
    const catTasks = activeTasks.filter(t => t.category === cat.key);
    if (catTasks.length === 0) continue;

    html += `
      <div class="task-category-section">
        <div class="category-header ${cat.cls}">
          <span>${cat.label}</span>
          <span class="task-count">${catTasks.length}</span>
        </div>
        <div class="task-items">
    `;

    for (const task of catTasks) {
      const subs = await getSubtasksByTask(task.id);
      const doneSubs = subs.filter(s => s.status === 'done').length;
      const totalSubs = subs.length;
      const progress = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0;

      let metaInfo = '';
      if (task.category === 'periodic' && task.intervalDays) {
        metaInfo = `Every ${task.intervalDays} days`;
      } else if (task.completedDates.length > 0) {
        metaInfo = `Done ${task.completedDates.length} time${task.completedDates.length > 1 ? 's' : ''}`;
      }

      html += `
        <div class="task-item card-enter" data-task-id="${task.id}">
          <div class="task-item-content">
            <div class="task-item-title">
              ${progress === 100 ? '<span class="congratulation-symbol">🏆</span>' : ''}
              ${task.title}
            </div>
            ${metaInfo ? `<div class="task-item-meta">${metaInfo}</div>` : ''}
            <div class="task-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <span class="progress-text">${doneSubs}/${totalSubs} subtasks</span>
            </div>
          </div>
          <button class="btn-icon btn-delete" data-task-id="${task.id}" title="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;
    }

    html += '</div></div>';
  }

  // Show completed one-off tasks
  const completedTasks = tasks.filter(t => !t.active);
  if (completedTasks.length > 0) {
    html += `
      <div class="task-category-section">
        <div class="category-header cat-done">
          <span>✅ Completed</span>
          <span class="task-count">${completedTasks.length}</span>
        </div>
        <div class="task-items">
          ${completedTasks.map(t => `
            <div class="task-item task-item-completed">
              <div class="task-item-content">
                <div class="task-item-title">
                  <span class="congratulation-symbol">🏆</span>
                  ${t.title}
                </div>
                <div class="task-item-meta">Completed</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  // Delete button listeners
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.taskId;
      const item = e.currentTarget.closest('.task-item');
      
      if (confirm('Delete this task and all its subtasks?')) {
        item.classList.add('card-exit');
        setTimeout(async () => {
          await deleteTask(id);
          showToast('🗑️ Deleted', 'Task removed');
          loadTaskList();
        }, 300);
      }
    });
  });
}
