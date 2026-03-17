// ============================================================
// breakdown.js — Smart task breakdown engine
// Generates 3 actionable subtasks from a task description
// ============================================================

import { createSubtask } from './models.js';

// ---- Keyword dictionaries for task type detection ----

const TASK_PATTERNS = {
  study: {
    keywords: ['study', 'learn', 'read', 'research', 'review', 'revise', 'memorize', 'understand', 'course', 'lecture', 'chapter', 'textbook', 'exam', 'test', 'quiz'],
    subtasks: (title) => [
      { t: `Gather & open all materials for: ${title}`, min: 5 },
      { t: `Focus session — actively study/read the core content of: ${title}`, min: 25 },
      { t: `Summarize key takeaways & note 3 things you learned about: ${title}`, min: 10 }
    ]
  },
  write: {
    keywords: ['write', 'blog', 'essay', 'report', 'article', 'draft', 'document', 'compose', 'email', 'proposal', 'letter', 'content', 'post', 'assignment'],
    subtasks: (title) => [
      { t: `Create outline with 3-5 key points for: ${title}`, min: 10 },
      { t: `Write the first draft (don't edit, just write) for: ${title}`, min: 20 },
      { t: `Review, edit, and finalize: ${title}`, min: 15 }
    ]
  },
  exercise: {
    keywords: ['exercise', 'workout', 'gym', 'run', 'jog', 'walk', 'stretch', 'yoga', 'pushup', 'plank', 'sport', 'swim', 'bike', 'cycle', 'fitness', 'train'],
    subtasks: (title) => [
      { t: `Warm up (5 min light movement) before: ${title}`, min: 5 },
      { t: `Main session — do the core workout: ${title}`, min: 20 },
      { t: `Cool down & stretch after: ${title}`, min: 5 }
    ]
  },
  clean: {
    keywords: ['clean', 'tidy', 'organize', 'declutter', 'sweep', 'mop', 'vacuum', 'wash', 'laundry', 'dishes', 'dust', 'scrub', 'room', 'desk'],
    subtasks: (title) => [
      { t: `Clear and sort items (remove trash/clutter) for: ${title}`, min: 10 },
      { t: `Deep clean the main area: ${title}`, min: 15 },
      { t: `Put everything back in place & quick final check: ${title}`, min: 5 }
    ]
  },
  code: {
    keywords: ['code', 'program', 'develop', 'build', 'implement', 'debug', 'fix', 'deploy', 'feature', 'api', 'frontend', 'backend', 'app', 'software', 'website', 'script', 'automate'],
    subtasks: (title) => [
      { t: `Plan approach & identify the specific files/components for: ${title}`, min: 10 },
      { t: `Implement the core logic/changes for: ${title}`, min: 25 },
      { t: `Test, review & commit changes for: ${title}`, min: 10 }
    ]
  },
  cook: {
    keywords: ['cook', 'meal', 'recipe', 'food', 'dinner', 'lunch', 'breakfast', 'bake', 'prepare', 'kitchen', 'grocery', 'ingredients'],
    subtasks: (title) => [
      { t: `Gather & prep all ingredients for: ${title}`, min: 10 },
      { t: `Cook the main dish: ${title}`, min: 20 },
      { t: `Plate & clean up the kitchen after: ${title}`, min: 10 }
    ]
  },
  meeting: {
    keywords: ['meeting', 'presentation', 'present', 'pitch', 'call', 'standup', 'sync', 'discuss', 'agenda', 'slide', 'demo'],
    subtasks: (title) => [
      { t: `Prepare agenda/notes/slides for: ${title}`, min: 15 },
      { t: `Rehearse key points (practice out loud) for: ${title}`, min: 10 },
      { t: `Final review & set up environment for: ${title}`, min: 5 }
    ]
  },
  shop: {
    keywords: ['buy', 'shop', 'purchase', 'order', 'get', 'pick up', 'shopping', 'store', 'market'],
    subtasks: (title) => [
      { t: `Make a specific list of what to buy for: ${title}`, min: 5 },
      { t: `Go and purchase items: ${title}`, min: 20 },
      { t: `Sort, organize, and put away what you bought: ${title}`, min: 10 }
    ]
  },
  plan: {
    keywords: ['plan', 'schedule', 'arrange', 'budget', 'goal', 'strategy', 'roadmap', 'brainstorm', 'decide', 'think about'],
    subtasks: (title) => [
      { t: `Brainstorm all options/ideas for: ${title}`, min: 10 },
      { t: `Evaluate and narrow down to top 3 choices: ${title}`, min: 10 },
      { t: `Make final decision & write down action steps for: ${title}`, min: 10 }
    ]
  }
};

// ---- Category-based fallback templates ----

const CATEGORY_TEMPLATES = {
  daily: (title) => [
    { t: `Set up & prepare to start: ${title}`, min: 5 },
    { t: `Focus on the main work: ${title}`, min: 20 },
    { t: `Wrap up & quick review of: ${title}`, min: 5 }
  ],
  periodic: (title) => [
    { t: `Recall where you left off & review progress on: ${title}`, min: 5 },
    { t: `Do the core work session: ${title}`, min: 20 },
    { t: `Document progress & set reminders for next time: ${title}`, min: 5 }
  ],
  oneoff: (title) => [
    { t: `Research & figure out the approach for: ${title}`, min: 10 },
    { t: `Execute the main action: ${title}`, min: 20 },
    { t: `Verify completion & do any follow-ups for: ${title}`, min: 10 }
  ],
  new: (title) => [
    { t: `Understand requirements & ask clarifying questions about: ${title}`, min: 10 },
    { t: `Create first draft / initial attempt: ${title}`, min: 20 },
    { t: `Review your work & refine: ${title}`, min: 10 }
  ]
};

/**
 * Break down a task into 3 actionable subtasks
 * @param {object} task - Task object from models.js
 * @returns {object[]} Array of 3 subtask objects
 */
export function breakdownTask(task) {
  const titleLower = task.title.toLowerCase();

  // Try to match a specific pattern first
  let matched = null;
  let bestScore = 0;

  for (const [, pattern] of Object.entries(TASK_PATTERNS)) {
    const score = pattern.keywords.reduce((acc, kw) => {
      return acc + (titleLower.includes(kw) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      matched = pattern;
    }
  }

  let steps;
  if (matched && bestScore > 0) {
    steps = matched.subtasks(task.title);
  } else {
    // Fallback to category template
    const templateFn = CATEGORY_TEMPLATES[task.category] || CATEGORY_TEMPLATES.daily;
    steps = templateFn(task.title);
  }

  // Assign priority based on step order (first step slightly lower priority since it's prep)
  const priorities = [3, 5, 4]; // prep=3, core=5, wrap=4

  return steps.map((step, i) => {
    return createSubtask(task.id, step.t, step.min, priorities[i], i);
  });
}
