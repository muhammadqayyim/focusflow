// ============================================================
// priority.js — Priority scoring & selection algorithm
// Picks the best 3 subtasks for the user to focus on
// ============================================================

/**
 * Score and sort Tasks based on urgency/priority
 * @param {object[]} tasks - All active tasks
 * @returns {object[]} Ranked array of tasks
 */
export function getRankedTasks(tasks) {
  const now = Date.now();
  const hour = new Date().getHours();

  const scored = tasks.map(task => {
    let score = 0;

    // 1. Category urgency (30%)
    const catScores = { new: 5, oneoff: 4, daily: 3, periodic: 2 };
    score += (catScores[task.category] || 2) * 6; // weight: 30 max

    // 2. Overdue factor (25%)
    if (task.category === 'periodic' && task.intervalDays) {
      const lastDone = task.completedDates.length > 0
        ? new Date(task.completedDates[task.completedDates.length - 1]).getTime()
        : task.createdAt;
      const daysSinceLast = (now - lastDone) / (1000 * 60 * 60 * 24);
      const overdueRatio = daysSinceLast / task.intervalDays;
      score += Math.min(overdueRatio * 12.5, 25);
    } else if (task.category === 'daily') {
      const today = new Date().toISOString().slice(0, 10);
      const doneToday = task.completedDates.includes(today);
      if (!doneToday) score += 20;
    } else if (task.category === 'new') {
      const ageHours = (now - task.createdAt) / (1000 * 60 * 60);
      score += Math.min(ageHours * 2, 25);
    }

    // 3. Time-of-day fit (15%) - morning bias for heavier tasks
    if (hour >= 6 && hour <= 14) score += 10;
    
    // 4. Recency boost (10%)
    const ageMs = now - task.createdAt;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    score += Math.max(10 - ageDays * 2, 0);

    return { task, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.task);
}

/**
 * Gets up to 3 next pending subtasks for a specific task
 * @param {object[]} subtasks - All subtasks for a specific task
 * @returns {object[]} Array of next pending subtasks
 */
export function getNextSubtasksForTask(subtasks) {
  const pending = subtasks
    .filter(s => s.status !== 'done')
    .sort((a, b) => a.order - b.order); // Must be chronological
  
  return pending.slice(0, 3);
}
