// ============================================================
// breakdown.js — Smart AI task breakdown engine
// Generates actionable subtasks using Google Gemini API
// ============================================================

import { createSubtask } from './models.js';
import { getState } from './storage.js';

// Fallback logic in case API is missing or fails
const CATEGORY_TEMPLATES = {
  daily: (title) => [
    { t: `Set up & prepare to start: ${title}`, min: 5, p: 3 },
    { t: `Focus on the main work: ${title}`, min: 20, p: 5 },
    { t: `Wrap up & quick review of: ${title}`, min: 5, p: 4 }
  ],
  periodic: (title) => [
    { t: `Recall where you left off & review progress on: ${title}`, min: 5, p: 3 },
    { t: `Do the core work session: ${title}`, min: 20, p: 5 },
    { t: `Document progress & set reminders for next time: ${title}`, min: 5, p: 4 }
  ],
  oneoff: (title) => [
    { t: `Research & figure out the approach for: ${title}`, min: 10, p: 3 },
    { t: `Execute the main action: ${title}`, min: 20, p: 5 },
    { t: `Verify completion & do any follow-ups for: ${title}`, min: 10, p: 4 }
  ],
  new: (title) => [
    { t: `Understand requirements & ask clarifying questions about: ${title}`, min: 10, p: 3 },
    { t: `Create first draft / initial attempt: ${title}`, min: 20, p: 5 },
    { t: `Review your work & refine: ${title}`, min: 10, p: 4 }
  ]
};

function fallbackBreakdown(task) {
  console.warn("Using fallback breakdown for:", task.title);
  const templateFn = CATEGORY_TEMPLATES[task.category] || CATEGORY_TEMPLATES.daily;
  const steps = templateFn(task.title);
  
  return steps.map((step, i) => {
    return createSubtask(task.id, step.t, step.min, step.p, i);
  });
}

/**
 * Break down a task into highly specific subtasks using Gemini
 * @param {object} task - Task object from models.js
 * @returns {Promise<object[]>} Array of subtask objects
 */
export async function breakdownTask(task) {
  const apiKey = await getState('geminiApiKey');
  
  // If no API key, use fallback
  if (!apiKey) {
    return fallbackBreakdown(task);
  }

  const prompt = `
You are a productivity expert who breaks down tasks into highly specific, bite-sized, actionable steps to prevent procrastination.
I need to do this task: "${task.title}".
The task is categorized as a "${task.category}" task.

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
  `.trim();

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
      }
      const msg = errorData.error?.message || `API Error: ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    let textOutput = data.candidates[0].content.parts[0].text;
    
    // Clean up potential markdown formatting (```json ... ```)
    textOutput = textOutput.replace(/```json|```/g, '').trim();
    
    // Parse the JSON array
    let stepsData = JSON.parse(textOutput);
    
    if (!Array.isArray(stepsData) || stepsData.length === 0) {
      throw new Error("Invalid format from API");
    }

    return stepsData.map((step, i) => {
      const title = step.t || step.title || step.task || `Step ${i+1} for ${task.title}`;
      const min = parseInt(step.min || step.minutes || step.time) || 15;
      const p = parseInt(step.p || step.priority) || 3;
      
      return createSubtask(task.id, title, min, p, i);
    });

  } catch (error) {
    console.error("Gemini API Breakdown failed:", error);
    // Throw the error so the UI can catch it and display it
    throw error;
  }
}
