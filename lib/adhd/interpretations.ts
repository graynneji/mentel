// lib/adhd/interpretations.ts
//
// Clinician-voice prose used on the results page and in the PDF. Every
// sentence here should read as an interpretation of a pattern, never as a
// diagnostic verdict. This file is the single source both surfaces draw
// from, so a wording fix only needs to happen once.
//
// IMPORTANT: this copy has not been clinically reviewed yet. Before it
// reaches real users, have Oridupa (Clinical Director) read through this
// file specifically, this is exactly the kind of interpretive language
// where the wrong verb ("indicates" vs "is consistent with") matters.

import { Domain } from "./questions";
import { Band } from "./scoring";

type Interpretation = Record<Band, string>;

export const domainInterpretations: Record<Domain, Interpretation> = {
  attention: {
    minimal: "You reported rarely losing focus, even during repetitive or effortful tasks, which suggests sustained attention isn't a significant source of friction for you day to day.",
    mild: "You reported occasionally losing focus during routine tasks, particularly when activities become repetitive or require sustained mental effort. This happens to most people sometimes and didn't come through as a dominant pattern in your responses.",
    moderate: "You reported losing focus fairly often during routine tasks, particularly when activities become repetitive or require sustained mental effort. This pattern is commonly associated with attentional regulation difficulties.",
    significant: "You reported losing focus frequently, even during tasks you consider important. Sustained attention appears to be one of the more prominent patterns in your responses.",
  },
  working_memory: {
    minimal: "You reported rarely forgetting appointments, conversations, or intended tasks, suggesting working memory isn't a significant strain area for you.",
    mild: "You reported occasionally forgetting appointments, conversations, or intended tasks despite understanding their importance. This came through as a mild, intermittent pattern.",
    moderate: "You reported regularly forgetting appointments, conversations, or intended tasks despite understanding their importance, a pattern that often shows up as losing your train of thought or misplacing items you use daily.",
    significant: "You reported frequently forgetting appointments, conversations, or intended tasks, even ones you cared about. This was one of the more consistent patterns across your responses.",
  },
  executive_function: {
    minimal: "You reported rarely struggling to start or plan tasks, suggesting initiation and planning aren't major friction points for you.",
    mild: "Your responses suggest planning and initiating tasks occasionally requires more effort than expected, particularly when managing several responsibilities at once.",
    moderate: "Your responses suggest planning and initiating tasks often requires more effort than expected, particularly when managing multiple responsibilities. Knowing what to do and actually starting it can feel like two separate problems.",
    significant: "Your responses suggest a strong, recurring gap between knowing what needs to happen and being able to start or sequence it, especially when several things compete for your attention at once.",
  },
  organisation: {
    minimal: "You reported rarely misjudging how long things take or losing track of items, suggesting organisation and time estimation are relative strengths for you.",
    mild: "You appear to occasionally underestimate how long activities take, which may contribute to the odd rushed moment or unfinished task, but this wasn't a dominant theme.",
    moderate: "You appear to underestimate how long activities take fairly regularly, which may contribute to rushing or unfinished tasks, alongside a tendency to misplace frequently used items.",
    significant: "Time estimation and organisation came through as one of the stronger patterns in your responses, with frequent rushing, unfinished tasks, and difficulty keeping track of belongings or space.",
  },
  impulsivity: {
    minimal: "You reported rarely acting or speaking before thinking things through, suggesting impulse control isn't a significant pattern for you.",
    mild: "You reported occasionally speaking or deciding before fully thinking something through, a pattern most people recognise sometimes.",
    moderate: "You reported a regular pattern of interrupting, blurting things out, or making quick decisions you reconsider shortly after.",
    significant: "Quick, unreflective action, whether in conversation, decisions, or commitments, came through as one of the more prominent patterns in your responses.",
  },
  emotional_regulation: {
    minimal: "You reported rarely feeling emotionally flooded or disproportionately frustrated, suggesting emotional regulation is a relative strength for you.",
    mild: "Your responses suggest occasional moments where frustration builds a little faster than the situation seems to call for, but this wasn't a dominant pattern.",
    moderate: "Your responses suggest frustration sometimes builds quickly when you're interrupted or overwhelmed, along with a need for time alone to reset afterward.",
    significant: "Emotional intensity, particularly around interruption and overwhelm, came through as one of the more consistent patterns in your responses, along with a real need for recovery time afterward.",
  },
  hyperactivity: {
    minimal: "You reported rarely feeling physically or mentally restless, suggesting this isn't a significant pattern for you.",
    mild: "Rather than physical restlessness, your responses suggest occasional internal mental restlessness, such as racing thoughts, that mostly doesn't interfere with rest.",
    moderate: "Rather than physical restlessness, your responses suggest a recurring pattern of internal mental restlessness, racing thoughts, or difficulty switching off even when you want to rest.",
    significant: "Internal restlessness, racing thoughts, or a persistent difficulty switching off came through strongly and consistently across your responses.",
  },
  daily_impact: {
    minimal: "Overall, the patterns above don't appear to create significant interference in your work, study, or home life based on your responses.",
    mild: "Overall these patterns appear to create mild interference across work, study, or home life, noticeable at times but not consistently disruptive.",
    moderate: "Overall these patterns appear to create mild to moderate interference across work, study, and home life, which is often the point where people start actively looking for strategies or answers.",
    significant: "Overall these patterns appear to create noticeable, frequent interference across work, study, and home life, which is worth taking seriously and exploring further.",
  },
};

export const strengthsPool: Record<string, string> = {
  attention: "Curiosity",
  working_memory: "Big-picture thinking",
  executive_function: "Creative problem-solving",
  organisation: "Adaptability",
  impulsivity: "Quick decision-making under pressure",
  emotional_regulation: "Emotional depth and empathy",
  hyperactivity: "High energy and drive",
  daily_impact: "Resilience",
};

export const whatThisMeans = {
  whatItIs:
    "ADHD, attention-deficit/hyperactivity disorder, is a pattern of attention, activity, and impulse-related traits that can affect focus, organisation, memory, emotional regulation, and follow-through. It's increasingly recognised in adults, not just children, and it shows up differently from person to person.",
  whatItIsNot:
    "This screening cannot diagnose ADHD or any other condition. A diagnosis requires a structured clinical interview with a qualified professional, who can also rule out or identify overlapping explanations for what you're experiencing.",
  overlap:
    "Attention, memory, and energy difficulties don't only come from ADHD. Chronic stress, burnout, anxiety, poor sleep, depression, and unresolved trauma can all produce very similar day-to-day patterns. That overlap is exactly why a conversation with a professional, rather than a self-assessment alone, is the right next step if these patterns are affecting your life.",
  encouragement:
    "If any of this resonated, the most useful next step is usually a conversation, either with your doctor or with a licensed mental health professional who can take a fuller history than a 20-question screening ever could.",
};

export const faqItems: { q: string; a: string }[] = [
  {
    q: "Is this a diagnosis?",
    a: "No. This is an educational self-assessment based on commonly recognised ADHD symptom domains. Only a licensed clinician, through a structured evaluation, can diagnose ADHD.",
  },
  {
    q: "How accurate is it?",
    a: "It reflects your own responses to questions drawn from recognised symptom domains, so it's a reasonable starting point for self-understanding, but it isn't validated as a clinical diagnostic instrument and shouldn't be treated as one.",
  },
  {
    q: "Who developed it?",
    a: "The question set was built around symptom domains used in established ADHD screening approaches, and reviewed internally by Mentel's clinical team before release.",
  },
  {
    q: "Will anyone see my results?",
    a: "No. Your results are private to you. We don't share individual results with employers, insurers, or any third party, and if you choose to see a professional through Mentel, you control what's shared.",
  },
  {
    q: "Can ADHD appear in adulthood?",
    a: "ADHD itself begins in childhood by definition, but many adults are diagnosed later in life, often because their symptoms were missed, masked, or attributed to something else when they were younger.",
  },
  {
    q: "Can anxiety look like ADHD?",
    a: "Yes. Anxiety, and several other conditions, can produce very similar attention and concentration difficulties. This is one of the main reasons a self-screening isn't a substitute for a professional evaluation.",
  },
];
