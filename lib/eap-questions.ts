// lib/eap-questions.ts
//
// Single source of truth for the multi-domain clinical assessment question
// bank (stress, anxiety, depression, sleep, burnout, relationships,
// self-esteem). Extracted out of app/eap/assessment/page.tsx so it isn't
// duplicated between the internal EAP assessment UI and the partner-facing
// GET /api/partner/v1/assessment/questions endpoint — see the comment on
// lib/eap-scoring.ts ("DO NOT duplicate this anywhere"); this bank gets the
// same discipline for the same reason: clinical content that must only ever
// be edited in one place.
//
// NOTE: contains a self-harm/suicidal-ideation screening item (dep_thoughts).
// This is deliberate clinical content for a licensed mental health platform's
// own intake instrument, not something being generated for an end user in
// distress — treat edits to it with the same care as the rest of a
// validated screening tool (i.e. don't reword items without clinical
// sign-off).

export interface Option {
    value: number;
    label: string;
    socialProof?: string;
}

export interface Question {
    id: string;
    domain: string;
    text: string;
    subtext?: string;
    options: Option[];
    conditional?: string;
    conditionalMin?: number;
}

const SCALE_5 = (labels: [string, string, string, string, string], proofs: string[]): Option[] =>
    labels.map((label, i) => ({ value: i, label, socialProof: proofs[i] }));


export const ALL_QUESTIONS: Question[] = [
    // CONTEXT
    {
        id: "rel_status", domain: "context",
        text: "What best describes your current relationship status?",
        subtext: "This helps us personalise questions about relationships and home life.",
        options: [
            { value: 0, label: "Single / not in a relationship", socialProof: "Around 4 in 10 people say this" },
            { value: 1, label: "In a relationship (dating / partnered)", socialProof: "About 1 in 4 people say this" },
            { value: 2, label: "Married or in a civil partnership", socialProof: "Around 3 in 10 people say this" },
            { value: 3, label: "Separated, divorced or widowed", socialProof: "About 1 in 16 people say this" },
        ],
    },
    {
        id: "has_children", domain: "context",
        text: "Do you have children or dependants you care for?",
        options: [
            { value: 0, label: "No", socialProof: "Nearly half of people say this" },
            { value: 1, label: "Yes — it's manageable", socialProof: "About 1 in 3 people say this" },
            { value: 2, label: "Yes — it's quite demanding", socialProof: "About 1 in 5 people say this" },
        ],
    },
    // STRESS
    {
        id: "stress_freq", domain: "stress",
        text: "Over the past 2 weeks, how often have you felt overwhelmed or unable to cope?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
            ["1 in 9 people", "About 1 in 4", "1 in 3 people — you're not alone", "About 1 in 4", "1 in 12 people"],
        ),
    },
    {
        id: "stress_physical", domain: "stress",
        text: "How often do you experience physical signs of stress — headaches, tight chest, racing heart, or stomach problems?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
            ["About 1 in 7", "More than 1 in 4", "Nearly 1 in 3", "About 1 in 5", "1 in 14 people"],
        ),
    },
    {
        id: "stress_control", domain: "stress",
        text: "How much control do you feel you have over the stressors in your life right now?",
        options: [
            { value: 0, label: "A lot — I feel in control", socialProof: "About 1 in 7 people feel this" },
            { value: 1, label: "Mostly in control, with some struggles", socialProof: "Nearly 2 in 5 people feel this" },
            { value: 2, label: "Partly — many things feel out of my hands", socialProof: "About 1 in 3 people feel this" },
            { value: 3, label: "Very little — I feel powerless", socialProof: "About 1 in 6 people feel this" },
        ],
    },
    // ANXIETY
    {
        id: "anxiety_worry", domain: "anxiety",
        text: "How often do you find yourself worrying excessively about things that may not happen?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 1 in 11", "About 1 in 5", "More than 1 in 3 — very common", "1 in 4 people", "About 1 in 11"],
        ),
    },
    {
        id: "anxiety_restless", domain: "anxiety",
        text: "How often do you feel restless, keyed up, or on edge?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
            ["About 1 in 8", "About 1 in 4", "1 in 3 people", "About 1 in 5", "1 in 12 people"],
        ),
    },
    {
        id: "anxiety_avoidance", domain: "anxiety",
        text: "Do you avoid situations, places or conversations because they make you anxious?",
        options: [
            { value: 0, label: "No — I face things head-on", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Occasionally, for specific things", socialProof: "Nearly 2 in 5 people — very common" },
            { value: 2, label: "Yes — I often avoid to prevent anxiety", socialProof: "About 1 in 4 people" },
            { value: 3, label: "Yes — it significantly limits my life", socialProof: "About 1 in 10 people" },
        ],
    },
    {
        id: "anxiety_panic", domain: "anxiety",
        text: "In the past month, have you experienced sudden rushes of intense fear or discomfort (panic attacks)?",
        options: [
            { value: 0, label: "No", socialProof: "About 7 in 10 people" },
            { value: 1, label: "Once or twice", socialProof: "About 1 in 6 people" },
            { value: 2, label: "Several times", socialProof: "About 1 in 11 people" },
            { value: 3, label: "Frequently — multiple times a week", socialProof: "About 1 in 33 people" },
        ],
    },
    // DEPRESSION
    {
        id: "dep_interest", domain: "depression",
        text: "How often have you had little interest or pleasure in things you normally enjoy?",
        options: SCALE_5(
            ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every day"],
            ["About 1 in 4", "Nearly 1 in 3 — you're not alone", "About 1 in 5", "About 1 in 6", "1 in 12 people"],
        ),
    },
    {
        id: "dep_hopeless", domain: "depression",
        text: "How often have you felt hopeless about the future?",
        options: SCALE_5(
            ["Not at all", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 3 in 10", "About 3 in 10", "About 1 in 4", "About 1 in 8", "1 in 17 people"],
        ),
    },
    {
        id: "dep_fatigue", domain: "depression",
        text: "How often do you feel so fatigued that even small tasks feel difficult?",
        options: SCALE_5(
            ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every single day"],
            ["About 1 in 6", "About 3 in 10", "About 1 in 4", "About 1 in 5", "1 in 12 people"],
        ),
    },
    {
        id: "dep_selfworth", domain: "depression",
        text: "How often have you felt worthless or excessively guilty about things?",
        options: SCALE_5(
            ["Not at all", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 3 in 10", "About 3 in 10", "About 1 in 5", "About 1 in 7", "1 in 17 people"],
        ),
    },
    {
        id: "dep_thoughts", domain: "depression",
        text: "In the past two weeks, have you had thoughts of harming yourself or that you would be better off not being here?",
        subtext: "Your answer is completely confidential and helps us ensure you get the right support.",
        options: [
            { value: 0, label: "No — not at all", socialProof: "About 5 in 6 people" },
            { value: 1, label: "Fleeting thoughts, not acted on", socialProof: "About 1 in 10 people — please know support is here" },
            { value: 2, label: "Yes, more than once", socialProof: "About 1 in 25 people" },
            { value: 3, label: "Yes — I'm struggling with this now", socialProof: "About 1 in 50 people — you will hear from us very soon" },
        ],
    },
    // BURNOUT
    {
        id: "burnout_exhaustion", domain: "burnout",
        text: "How often do you feel emotionally drained by your work?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Every single day"],
            ["About 1 in 12", "About 1 in 5", "More than 1 in 3", "About 1 in 4", "About 1 in 9"],
        ),
    },
    {
        id: "burnout_cynicism", domain: "burnout",
        text: "How often do you feel cynical or detached from your work and colleagues?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost always"],
            ["About 1 in 9", "About 1 in 4", "1 in 3 people", "About 1 in 4", "About 1 in 10"],
        ),
    },
    {
        id: "burnout_effectiveness", domain: "burnout",
        text: "How often do you feel like you're not performing as well as you should, despite the effort you put in?",
        options: SCALE_5(
            ["Never — I feel effective", "Rarely", "Sometimes", "Often", "Almost always"],
            ["About 1 in 11", "About 1 in 4", "More than 1 in 3", "About 1 in 5", "About 1 in 11"],
        ),
    },
    {
        id: "burnout_boundary", domain: "burnout",
        text: "How easy is it for you to switch off from work during evenings and weekends?",
        options: [
            { value: 0, label: "Easy — I fully disconnect", socialProof: "About 1 in 8 people" },
            { value: 1, label: "Mostly — I switch off with some effort", socialProof: "About 3 in 10 people" },
            { value: 2, label: "Difficult — work follows me home", socialProof: "More than 1 in 3 — very common" },
            { value: 3, label: "Impossible — I'm always 'on'", socialProof: "About 1 in 5 people" },
        ],
    },
    // SLEEP
    {
        id: "sleep_quality", domain: "sleep",
        text: "How would you rate your overall sleep quality over the past 2 weeks?",
        options: [
            { value: 0, label: "Very good — I sleep well", socialProof: "About 1 in 6 people" },
            { value: 1, label: "Fairly good", socialProof: "About 1 in 3 people" },
            { value: 2, label: "Fairly poor", socialProof: "About 1 in 3 people" },
            { value: 3, label: "Very poor — I barely sleep", socialProof: "About 1 in 5 people" },
        ],
    },
    {
        id: "sleep_onset", domain: "sleep",
        text: "How often does it take you more than 30 minutes to fall asleep?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every night"],
            ["About 1 in 6", "1 in 4 people", "About 3 in 10", "About 1 in 5", "About 1 in 11"],
        ),
    },
    {
        id: "sleep_daytime", domain: "sleep",
        text: "How often does poor sleep affect your ability to concentrate or function during the day?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Every day"],
            ["About 1 in 7", "About 1 in 4", "About 3 in 10", "About 1 in 5", "About 1 in 10"],
        ),
    },
    // RELATIONSHIPS
    {
        id: "rel_support", domain: "relationships",
        text: "How supported do you feel by the people in your personal life?",
        options: [
            { value: 0, label: "Very supported — I have strong connections", socialProof: "About 1 in 4 people" },
            { value: 1, label: "Somewhat supported", socialProof: "About 2 in 5 people" },
            { value: 2, label: "Limited support — I feel mostly alone", socialProof: "About 1 in 4 people" },
            { value: 3, label: "Very isolated — I have no one to turn to", socialProof: "About 1 in 9 people — you deserve support" },
        ],
    },
    {
        id: "rel_conflict", domain: "relationships",
        text: "How often do conflicts in your personal relationships cause you distress?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Very frequently"],
            ["About 1 in 5", "About 3 in 10", "About 3 in 10", "About 1 in 6", "About 1 in 17"],
        ),
        conditional: "rel_status", conditionalMin: 0,
    },
    // Partnership questions
    {
        id: "rel_partner_comm", domain: "relationships",
        text: "How well do you and your partner communicate when there are problems?",
        subtext: "These questions only apply if you're currently in a relationship.",
        options: [
            { value: 0, label: "Very well — we talk openly", socialProof: "About 1 in 5 couples" },
            { value: 1, label: "Usually well, with occasional breakdowns", socialProof: "More than 1 in 3 couples" },
            { value: 2, label: "Poorly — we often avoid difficult topics", socialProof: "About 3 in 10 couples" },
            { value: 3, label: "Very poorly — communication has broken down", socialProof: "About 1 in 7 couples" },
        ],
        conditional: "rel_status", conditionalMin: 1,
    },
    {
        id: "rel_intimacy", domain: "relationships",
        text: "How satisfied are you with the level of emotional intimacy and closeness in your relationship?",
        options: [
            { value: 0, label: "Very satisfied", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Mostly satisfied", socialProof: "About 1 in 3 people" },
            { value: 2, label: "Somewhat unsatisfied", socialProof: "About 3 in 10 people" },
            { value: 3, label: "Very unsatisfied — we feel like strangers", socialProof: "About 1 in 6 people" },
        ],
        conditional: "rel_status", conditionalMin: 1,
    },
    {
        id: "rel_trust", domain: "relationships",
        text: "Is there anything in your relationship (such as infidelity, dishonesty, or past hurt) that is currently affecting your trust?",
        options: [
            { value: 0, label: "No — trust is solid", socialProof: "About half of people" },
            { value: 1, label: "There have been issues but we're working on it", socialProof: "About 1 in 4 people" },
            { value: 2, label: "Yes — trust is significantly damaged", socialProof: "About 1 in 4 people" },
        ],
        conditional: "rel_status", conditionalMin: 1,
    },
    // Marriage specific
    {
        id: "rel_marriage_stress", domain: "relationships",
        text: "How much would you say your marriage is a source of stress in your life right now?",
        options: [
            { value: 0, label: "It's a source of strength and support", socialProof: "About 3 in 10 married people" },
            { value: 1, label: "Neutral — not a major stressor", socialProof: "About 3 in 10 married people" },
            { value: 2, label: "Mildly stressful", socialProof: "About 1 in 4 married people" },
            { value: 3, label: "A significant source of stress or conflict", socialProof: "About 1 in 6 married people" },
        ],
        conditional: "rel_status", conditionalMin: 2,
    },
    {
        id: "rel_sex", domain: "relationships",
        text: "How satisfied are you with the physical intimacy in your relationship?",
        subtext: "This is a sensitive but important aspect of wellbeing. Your answer is fully confidential.",
        options: [
            { value: 0, label: "Very satisfied", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Mostly satisfied", socialProof: "About 3 in 10 people" },
            { value: 2, label: "Somewhat unsatisfied", socialProof: "About 3 in 10 people" },
            { value: 3, label: "Very unsatisfied or not currently active", socialProof: "About 1 in 5 people" },
        ],
        conditional: "rel_status", conditionalMin: 2,
    },
    // SELF-ESTEEM
    {
        id: "se_worth", domain: "selfesteem",
        text: "Overall, how positively do you feel about yourself?",
        options: [
            { value: 0, label: "Very positively — I feel good about who I am", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Mostly positive", socialProof: "About 2 in 5 people" },
            { value: 2, label: "Mostly negative", socialProof: "About 3 in 10 people" },
            { value: 3, label: "Very negatively — I don't like myself much", socialProof: "About 1 in 7 people" },
        ],
    },
    {
        id: "se_criticism", domain: "selfesteem",
        text: "How often is your inner voice harsh or highly critical of yourself?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 1 in 12", "About 1 in 5", "About 1 in 3", "About 1 in 4", "About 1 in 8"],
        ),
    },
    {
        id: "se_comparison", domain: "selfesteem",
        text: "How often do you compare yourself unfavourably to others and feel inadequate?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 1 in 10", "About 1 in 5", "More than 1 in 3", "About 1 in 4", "About 1 in 11"],
        ),
    },
];


// Domain labels without the icon/color metadata (that stays UI-only in
// app/eap/assessment/page.tsx) — safe to expose over the partner API.
export const DOMAIN_LABELS: Record<string, string> = {
    context: "About You",
    stress: "Stress",
    anxiety: "Anxiety",
    depression: "Low Mood",
    burnout: "Work & Burnout",
    sleep: "Sleep",
    relationships: "Relationships",
    selfesteem: "Self & Identity",
};
