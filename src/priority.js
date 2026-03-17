// ============================================================
// priority.js — Priority scoring & selection algorithm
// Picks the best 3 subtasks for the user to focus on
// ============================================================

/**
 * Score and select the top 3 subtasks from available pool
 * @param {object[]} subtasks - All pending subtasks
 * @param {object[]} tasks - All tasks (for category info)
 * @returns {object[]} Top 3 subtasks sorted by score
 */
export function selectTopSubtasks(subtasks, tasks) {
  const pending = subtasks.filter(s => s.status === 'pending' || s.status === 'active');
  if (pending.length <= 3) return pending;

  const taskMap = {};
  for (const t of tasks) taskMap[t.id] = t;

  const now = Date.now();
  const hour = new Date().getHours();

  // Score each subtask
  const scored = pending.map(sub => {
    const task = taskMap[sub.taskId];
    if (!task) return { sub, score: 0 };

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
      score += Math.min(overdueRatio * 12.5, 25); // weight: 25 max
    } else if (task.category === 'daily') {
      const today = new Date().toISOString().slice(0, 10);
      const doneToday = task.completedDates.includes(today);
      if (!doneToday) score += 20;
    } else if (task.category === 'new') {
      // New tasks that are older get more urgent
      const ageHours = (now - task.createdAt) / (1000 * 60 * 60);
      score += Math.min(ageHours * 2, 25);
    }

    // 3. Time-of-day fit (15%)
    // Heavier subtasks (longer time) should be done in morning/early afternoon
    if (sub.estimatedMinutes >= 20) {
      if (hour >= 6 && hour <= 14) score += 15;    // morning boost for heavy tasks
      else if (hour >= 15 && hour <= 18) score += 8;
      else score += 3;
    } else {
      // Light tasks fit anytime
      score += 10;
    }

    // 4. Recency boost (15%)
    const ageMs = now - task.createdAt;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    score += Math.max(15 - ageDays * 2, 0); // newer tasks get up to 15

    // 5. Subtask order priority (internal)
    // Core tasks (step 2) get a small boost
    if (sub.order === 0) score += 2;  // start first
    else if (sub.order === 1) score += 5; // core work
    else score += 1;

    // 6. Inherent priority
    score += sub.priority * 2;

    return { sub, score, category: task.category };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Variety: try to avoid all 3 from same parent task
  const selected = [];
  const usedTaskIds = new Set();
  const usedCategories = new Set();

  // First pass: pick best from different tasks
  for (const item of scored) {
    if (selected.length >= 3) break;
    if (!usedTaskIds.has(item.sub.taskId)) {
      selected.push(item.sub);
      usedTaskIds.add(item.sub.taskId);
      usedCategories.add(item.category);
    }
  }

  // Second pass: fill remaining slots (if < 3 tasks available)
  if (selected.length < 3) {
    for (const item of scored) {
      if (selected.length >= 3) break;
      if (!selected.includes(item.sub)) {
        selected.push(item.sub);
      }
    }
  }

  return selected;
}

/**
 * Add slight randomization to daily ordering
 * Shuffles items within similar priority bands
 */
export function addDailyVariety(subtasks) {
  if (subtasks.length <= 1) return subtasks;

  // Group by similar scores (within 10 points)
  const result = [...subtasks];

  // Simple Fisher-Yates with bias toward current position
  for (let i = result.length - 1; i > 0; i--) {
    // 60% chance to stay, 40% chance to swap
    if (Math.random() < 0.4) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
  }

  return result;
}
