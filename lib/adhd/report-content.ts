// lib/adhd/report-content.ts
//
// Static content library the PDF report pulls from. Keeping this separate
// from the render template means non-engineers (e.g. your Clinical
// Director) can review or edit the actual clinical-adjacent wording
// without touching the PDF layout code.
//
// Style note: no em dashes anywhere in this file, per Mentel's document
// convention, use commas, colons, or conjunctions instead.

import { Domain } from "./questions";

export const domainStrategies: Record<Domain, string[]> = {
  attention: [
    "Work in short, timed blocks of 20 to 25 minutes, with a deliberate break between each one, rather than aiming for long unbroken focus sessions.",
    "Remove competing stimuli before starting a task, such as your phone in another room or browser tabs closed, rather than relying on willpower to ignore them.",
    "When you notice your attention has drifted, treat it as neutral information rather than a failure, and gently redirect back to the task.",
  ],
  working_memory: [
    "Externalise anything you need to remember the moment you think of it, using a single running notes app or notebook checked at set times, rather than several scattered lists.",
    "Repeat instructions or plans back out loud or in writing right after you receive them, while they're still fresh.",
    "Use visual anchors, such as a note by the door or an item placed somewhere you can't miss it, instead of relying on remembering to remember.",
  ],
  executive_function: [
    "Break the first step of any task down until it takes less than two minutes: starting is usually the hardest part, not the task itself.",
    "Use a visible list of three things for today rather than a long backlog, so the next action is always obvious.",
    "Pair task switching with a short physical cue, such as standing up or a stretch, to help your brain register the transition.",
  ],
  organisation: [
    "Build in a buffer of 25 to 50 percent more time than you think a task needs, especially for anything with a hard deadline.",
    "Give frequently used items one fixed home, and put them back there every time. The friction of a new decision each time is often what causes items to go missing.",
    "Do a five-minute reset of your main workspace at the end of each day rather than a full weekly clear-out.",
  ],
  impulsivity: [
    "Build in a short, deliberate pause, even 10 seconds, between deciding and acting on non-urgent purchases or commitments.",
    "In conversations, try holding your first response for a beat before saying it. This isn't about suppressing it, just noticing it before it comes out.",
    "Where possible, add a small structural delay between impulse and action, such as letting an item sit in a cart overnight before you check out.",
  ],
  emotional_regulation: [
    "Name the emotion as specifically as you can in the moment, such as frustrated, overwhelmed, or embarrassed. Labelling it tends to lower its intensity.",
    "Build in a genuine reset break when you notice flooding, rather than pushing through or apologising for needing one.",
    "Identify your early physical signs of overwhelm, such as a tight chest or racing thoughts, so you can intervene before it peaks.",
  ],
  hyperactivity: [
    "Build movement into tasks that don't need stillness, such as pacing on calls, a standing desk, or a fidget tool during meetings.",
    "Schedule short, regular movement breaks rather than waiting until restlessness becomes distracting.",
    "Notice whether background activity, such as music or a busy environment, helps or hinders your focus, and use that deliberately.",
  ],
  daily_impact: [
    "Pick one domain from this report to focus on for the next few weeks rather than trying to change everything at once.",
    "Loop in one person close to you, such as a partner, friend, or colleague, on what you're working on, so you're not managing it alone.",
    "Revisit this assessment in two to three months to see what's shifted. Patterns are easier to see over time than in a single snapshot.",
  ],
};

export const doctorSummaryIntro =
  "This summary was generated from a self-reported educational screening, not a clinical evaluation. It is intended purely to help structure a conversation with a qualified healthcare professional, and carries no diagnostic weight on its own.";

export const reportDisclaimer =
  "This report is an educational self-assessment. It does not diagnose ADHD or any other condition, and is not a substitute for evaluation by a qualified healthcare professional. If you're concerned about these patterns, consider sharing this summary with a doctor, psychiatrist, or licensed therapist.";
