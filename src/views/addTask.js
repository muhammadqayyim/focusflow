// ============================================================
// addTask.js — Task input form with category selection
// ============================================================

import { createTask } from '../models.js';
import { addTask, addSubtask, deleteTask } from '../storage.js';
import { breakdownTask } from '../breakdown.js';
import { showToast } from '../components/notification.js';
import { navigate } from '../router.js';

export function renderAddTask() {
  const app = document.getElementById('app-content');
  app.innerHTML = `
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
  `;

  let selectedCategory = 'daily';
  const form = document.getElementById('add-task-form');
  const intervalGroup = document.getElementById('interval-group');
  const intervalInput = document.getElementById('interval-days');

  // Category selection
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
      intervalGroup.style.display = selectedCategory === 'periodic' ? 'block' : 'none';
    });
  });

  // Interval +/- buttons
  document.getElementById('interval-dec').addEventListener('click', () => {
    intervalInput.value = Math.max(2, parseInt(intervalInput.value) - 1);
  });
  document.getElementById('interval-inc').addEventListener('click', () => {
    intervalInput.value = Math.min(365, parseInt(intervalInput.value) + 1);
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    if (!title) return;

    const interval = selectedCategory === 'periodic' ? parseInt(intervalInput.value) : null;
    const task = createTask(title, selectedCategory, interval);
    await addTask(task);

    // Show loading state on button
    const btnSubmit = document.getElementById('btn-submit');
    const originalBtnText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Breaking it down...`;
    btnSubmit.disabled = true;

    try {
      // Breakdown - Await the async API call
      const subtasks = await breakdownTask(task);
      
      for (const s of subtasks) {
        await addSubtask(s);
      }

      // Show preview (REVERTED logic)
      form.style.display = 'none';
      const preview = document.getElementById('breakdown-preview');
      preview.style.display = 'block';

      const subtaskList = document.getElementById('subtask-list');
      subtaskList.innerHTML = subtasks.map((s, i) => `
        <div class="subtask-preview-card card-enter" style="animation-delay: ${i * 0.15}s">
          <div class="subtask-preview-num">${i + 1}</div>
          <div class="subtask-preview-content">
            <div class="subtask-preview-title">${s.title}</div>
            <div class="subtask-preview-meta">
              <span class="time-estimate">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${s.estimatedMinutes} min
              </span>
              <span class="priority-badge ${s.priority >= 4 ? 'priority-high' : s.priority >= 3 ? 'priority-med' : 'priority-low'}">
                ${s.priority >= 4 ? 'High' : s.priority >= 3 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
        </div>
      `).join('');

      showToast('✅ Task Added!', `"${title}" has been broken into ${subtasks.length} subtasks`);

    } catch (error) {
      console.error("Failed to break down:", error);
      
      // Cleanup: delete the task we just created since we failed to generate subtasks
      try {
        await deleteTask(task.id);
      } catch (e) {
        console.error("Failed to cleanup empty task:", e);
      }
      
      btnSubmit.innerHTML = originalBtnText;
      btnSubmit.disabled = false;
      showToast('❌ Error Breakdown', error.message || 'Failed to break down task. Please check API Key or try again.');
    }

    document.getElementById('btn-go-dashboard').addEventListener('click', () => {
      navigate('#dashboard');
    });
  });

  return { cleanup: () => {} };
}
