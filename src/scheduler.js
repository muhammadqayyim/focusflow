// ============================================================
// scheduler.js — New day detection & daily task rotation
// ============================================================

import { getAllTasks, getAllSubtasks, updateTask, addSubtask, getSubtasksByTask, deleteSubtask, getState, setState } from './storage.js';
import { breakdownTask } from './breakdown.js';
import { getRankedTasks, getNextSubtasksForTask } from './priority.js';

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if it's a new day and run daily reset if needed
 * @returns {boolean} true if new day was detected
 */
export async function checkNewDay() {
  const lastDate = await getState('lastActiveDate');
  const today = todayStr();

  if (lastDate === today) return false;

  // It's a new day!
  await runDailyReset(today);
  await setState('lastActiveDate', today);
  return true;
}

/**
 * Run the daily reset logic
 */
async function runDailyReset(today) {
  const tasks = await getAllTasks();

  for (const task of tasks) {
    if (!task.active) continue;

    switch (task.category) {
      case 'daily': {
        // Reset subtasks for daily tasks — regenerate with slight variety
        const oldSubs = await getSubtasksByTask(task.id);
        for (const s of oldSubs) {
          if (s.status === 'done') {
            await deleteSubtask(s.id);
          } else {
            // Reset pending/active ones too for fresh start
            await deleteSubtask(s.id);
          }
        }
        // Regenerate subtasks
        const newSubs = breakdownTask(task);
        for (const s of newSubs) await addSubtask(s);
        break;
      }

      case 'periodic': {
        // Check if it's time for this periodic task
        const lastDone = task.completedDates.length > 0
          ? task.completedDates[task.completedDates.length - 1]
          : null;

        let shouldSchedule = false;
        if (!lastDone) {
          shouldSchedule = true; // Never done, should schedule
        } else {
          const lastDate = new Date(lastDone);
          const daysSince = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
          shouldSchedule = daysSince >= (task.intervalDays || 1);
        }

        if (shouldSchedule && task.lastScheduledDate !== today) {
          // Clear old subtasks and regenerate
          const oldSubs = await getSubtasksByTask(task.id);
          for (const s of oldSubs) await deleteSubtask(s.id);
          const newSubs = breakdownTask(task);
          for (const s of newSubs) await addSubtask(s);
          task.lastScheduledDate = today;
          await updateTask(task);
        }
        break;
      }

      case 'oneoff': {
        // Check if completed
        const todayInDates = task.completedDates.includes(today);
        if (todayInDates) {
          task.active = false;
          await updateTask(task);
        }
        // Otherwise keep it as is — subtasks persist
        break;
      }

      case 'new': {
        // New tasks persist until completed
        // Just make sure they have subtasks
        const subs = await getSubtasksByTask(task.id);
        if (subs.length === 0) {
          const newSubs = breakdownTask(task);
          for (const s of newSubs) await addSubtask(s);
        }
        break;
      }
    }
  }
}

/**
 * Get the current single focused task and its next 3 subtasks
 * @returns {{ subtasks: object[], task: object|null }}
 */
export async function getFocusSubtasks() {
  const tasks = await getAllTasks();
  const activeTasks = tasks.filter(t => t.active);
  
  if (activeTasks.length === 0) return { subtasks: [], task: null };

  const rankedTasks = getRankedTasks(activeTasks);
  
  // Get or initialize the currently focused task index
  let focusTaskIndex = await getState('currentFocusTaskIndex') || 0;
  
  // If index is out of bounds (e.g. tasks were deleted), reset to 0
  if (focusTaskIndex >= rankedTasks.length) {
    focusTaskIndex = 0;
    await setState('currentFocusTaskIndex', 0);
  }

  const focusTask = rankedTasks[focusTaskIndex];
  const allSubtasks = await getSubtasksByTask(focusTask.id);
  const pendingSubs = getNextSubtasksForTask(allSubtasks);

  // If this task has no pending subtasks but is active, it might be in a broken state
  // Auto-shuffle to the next one
  if (pendingSubs.length === 0 && rankedTasks.length > 1) {
    return await shuffleFocusTask();
  }

  return { subtasks: pendingSubs, task: focusTask };
}

/**
 * Shuffle to the next highest priority Task
 * @returns {{ subtasks: object[], task: object|null }}
 */
export async function shuffleFocusTask() {
  const tasks = await getAllTasks();
  const activeTasks = tasks.filter(t => t.active);
  
  if (activeTasks.length <= 1) return await getFocusSubtasks();

  let currentIndex = await getState('currentFocusTaskIndex') || 0;
  currentIndex = (currentIndex + 1) % activeTasks.length;
  await setState('currentFocusTaskIndex', currentIndex);
  
  return await getFocusSubtasks();
}

/**
 * Mark a subtask as done and check if parent task is complete
 */
export async function completeSubtask(subtaskId) {
  const { getSubtask, updateSubtask } = await import('./storage.js');
  const sub = await getSubtask(subtaskId);
  if (!sub) return;

  sub.status = 'done';
  sub.completedAt = Date.now();
  await updateSubtask(sub);

  // Check if all subtasks for this task are done
  const siblings = await getSubtasksByTask(sub.taskId);
  const allDone = siblings.every(s => s.status === 'done');

  if (allDone) {
    const { getTask, updateTask } = await import('./storage.js');
    const task = await getTask(sub.taskId);
    if (task) {
      task.completedDates.push(todayStr());
      if (task.category === 'oneoff') {
        task.active = false;
      }
      await updateTask(task);
    }
  }

  return allDone;
}
