// lib/adhd/questions.ts
//
// Question bank for the /adhd educational self-assessment.
// This is a screening tool, not a diagnostic instrument. Questions are
// organised around recognised ADHD symptom domains (DSM-5-aligned areas)
// but are NOT presented as clinically validated diagnostic criteria.
//
// Scale: 0 = Never/Rarely, 1 = Occasionally, 2 = Sometimes, 3 = Often, 4 = Almost always
// Domains map to two subscales used for the (non-diagnostic) pattern summary:
//   "inattentive"      — Attention, Working Memory, Organisation, Daily Functional Impact
//   "hyperactive"       — Impulsivity, Hyperactivity, Emotional Regulation
// Executive Function is scored as its own domain and also folds into both subscales lightly.

export type Domain =
  | "attention"
  | "working_memory"
  | "executive_function"
  | "organisation"
  | "impulsivity"
  | "emotional_regulation"
  | "hyperactivity"
  | "daily_impact";

export interface AdhdOption {
  label: string;
  value: 0 | 1 | 2 | 3 | 4;
}

export interface AdhdQuestion {
  id: string;
  domain: Domain;
  domainLabel: string;
  text: string;
  helper?: string;
  options: AdhdOption[];
}

const scale = (labels: [string, string, string, string, string]): AdhdOption[] =>
  labels.map((label, i) => ({ label, value: i as AdhdOption["value"] }));

const standardScale = scale([
  "Never",
  "Rarely",
  "Sometimes",
  "Often",
  "Almost always",
]);

export const domainMeta: Record<Domain, { label: string; blurb: string }> = {
  attention: { label: "Attention & Concentration", blurb: "Staying focused on tasks, conversations, and details" },
  working_memory: { label: "Working Memory", blurb: "Holding information in mind while you use it" },
  executive_function: { label: "Executive Function", blurb: "Planning, starting tasks, and switching between them" },
  organisation: { label: "Organisation & Time Management", blurb: "Structuring tasks, time, and belongings" },
  impulsivity: { label: "Impulsivity", blurb: "Pausing before acting, speaking, or deciding" },
  emotional_regulation: { label: "Emotional Regulation", blurb: "Managing frustration, overwhelm, and reactivity" },
  hyperactivity: { label: "Hyperactivity", blurb: "Physical or mental restlessness" },
  daily_impact: { label: "Daily Functional Impact", blurb: "How these patterns show up in everyday life" },
};

export const questions: AdhdQuestion[] = [
  // Attention & Concentration
  {
    id: "a1",
    domain: "attention",
    domainLabel: "Attention & Concentration",
    text: "How often do you find your mind wandering during conversations or meetings, even when you want to focus?",
    options: standardScale,
  },
  {
    id: "a2",
    domain: "attention",
    domainLabel: "Attention & Concentration",
    text: "How often do you lose focus partway through reading, watching, or listening to something, and have to go back?",
    options: standardScale,
  },
  {
    id: "a3",
    domain: "attention",
    domainLabel: "Attention & Concentration",
    text: "How often do small distractions (notifications, noise, other thoughts) pull you away from what you're doing?",
    options: standardScale,
  },

  // Working Memory
  {
    id: "wm1",
    domain: "working_memory",
    domainLabel: "Working Memory",
    text: "How often do you walk into a room and forget why you went there, or lose your train of thought mid-sentence?",
    options: standardScale,
  },
  {
    id: "wm2",
    domain: "working_memory",
    domainLabel: "Working Memory",
    text: "How often do you forget appointments, deadlines, or things you told someone you'd do?",
    helper: "Even when you cared about them and intended to remember.",
    options: standardScale,
  },

  // Executive Function
  {
    id: "ef1",
    domain: "executive_function",
    domainLabel: "Executive Function",
    text: "How often do you know exactly what you need to do, but still struggle to actually start doing it?",
    options: standardScale,
  },
  {
    id: "ef2",
    domain: "executive_function",
    domainLabel: "Executive Function",
    text: "How often do you have several tasks open or in progress at once, without finishing any of them?",
    options: standardScale,
  },
  {
    id: "ef3",
    domain: "executive_function",
    domainLabel: "Executive Function",
    text: "How often does switching from one task to another feel disproportionately hard or disorienting?",
    options: standardScale,
  },

  // Organisation & Time Management
  {
    id: "o1",
    domain: "organisation",
    domainLabel: "Organisation & Time Management",
    text: "How often do you misjudge how long a task will take, leaving you rushed or scrambling?",
    options: standardScale,
  },
  {
    id: "o2",
    domain: "organisation",
    domainLabel: "Organisation & Time Management",
    text: "How often do you lose track of items you use regularly (keys, phone, documents, wallet)?",
    options: standardScale,
  },
  {
    id: "o3",
    domain: "organisation",
    domainLabel: "Organisation & Time Management",
    text: "How often does your space (desk, inbox, home) become cluttered faster than you can keep up with it?",
    options: standardScale,
  },

  // Impulsivity
  {
    id: "i1",
    domain: "impulsivity",
    domainLabel: "Impulsivity",
    text: "How often do you interrupt others or blurt something out before you've fully thought it through?",
    options: standardScale,
  },
  {
    id: "i2",
    domain: "impulsivity",
    domainLabel: "Impulsivity",
    text: "How often do you make quick decisions (purchases, commitments, plans) that you reconsider shortly after?",
    options: standardScale,
  },

  // Emotional Regulation
  {
    id: "er1",
    domain: "emotional_regulation",
    domainLabel: "Emotional Regulation",
    text: "How often do small frustrations feel bigger or more intense than the situation seems to call for?",
    options: standardScale,
  },
  {
    id: "er2",
    domain: "emotional_regulation",
    domainLabel: "Emotional Regulation",
    text: "How often do you feel emotionally 'flooded' or overwhelmed and need time alone to reset?",
    options: standardScale,
  },

  // Hyperactivity
  {
    id: "h1",
    domain: "hyperactivity",
    domainLabel: "Hyperactivity",
    text: "How often do you feel physically restless, fidgety, or like you need to be moving or doing something?",
    options: standardScale,
  },
  {
    id: "h2",
    domain: "hyperactivity",
    domainLabel: "Hyperactivity",
    text: "How often does your mind feel like it's running multiple threads at once, even when you're trying to rest?",
    options: standardScale,
  },

  // Daily Functional Impact
  {
    id: "d1",
    domain: "daily_impact",
    domainLabel: "Daily Functional Impact",
    text: "How often do these patterns affect your performance at work, school, or in running your household?",
    options: standardScale,
  },
  {
    id: "d2",
    domain: "daily_impact",
    domainLabel: "Daily Functional Impact",
    text: "How often do these patterns create friction in your relationships (partners, family, friends, colleagues)?",
    options: standardScale,
  },
  {
    id: "d3",
    domain: "daily_impact",
    domainLabel: "Daily Functional Impact",
    text: "Looking back, how long have you noticed patterns like these — would you say most of your life, or more recently?",
    helper: "This helps distinguish long-standing patterns from a temporarily stressful period.",
    options: scale([
      "Not really present",
      "The last few months",
      "The last couple of years",
      "Most of my adult life",
      "As far back as I can remember",
    ]),
  },
];

export const TOTAL_QUESTIONS = questions.length;
