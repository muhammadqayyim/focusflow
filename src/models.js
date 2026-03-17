// ============================================================
// models.js — Data model factories
// ============================================================

let _idCounter = 0;

export function uid() {
  return Date.now().toString(36) + '-' + (++_idCounter).toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

/**
 * Create a Task object
 * @param {string} title
 * @param {'daily'|'periodic'|'oneoff'|'new'} category
 * @param {number|null} intervalDays - for periodic tasks
 */
export function createTask(title, category, intervalDays = null) {
  return {
    id: uid(),
    title: title.trim(),
    category,
    intervalDays,           // only for periodic
    createdAt: Date.now(),
    completedDates: [],     // ISO date strings of days this was completed
    lastScheduledDate: null,
    active: true
  };
}

/**
 * Create a Subtask object
 * @param {string} taskId
 * @param {string} title
 * @param {number} estimatedMinutes
 * @param {number} priority  1-5 (5=highest)
 * @param {number} order
 */
export function createSubtask(taskId, title, estimatedMinutes, priority, order = 0) {
  return {
    id: uid(),
    taskId,
    title: title.trim(),
    estimatedMinutes,
    priority,
    order,
    status: 'pending',       // pending | active | done
    completedAt: null,
    addedTimeMinutes: 0
  };
}
