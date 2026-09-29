// import {
//   Brain,
//   Heart,
//   Users,
//   Anchor,
//   Flame,
//   Sun,
//   Puzzle,
//   type LucideIcon,
// } from "lucide-react";

// export interface ServiceFAQ {
//   q: string;
//   a: string;
// }

// export interface ServiceApproach {
//   name: string;
//   desc: string;
// }

// export interface Service {
//   slug: string;
//   title: string;
//   shortTitle: string;
//   shortDesc: string;
//   metaTitle: string;
//   metaDescription: string;
//   keywords: string[];
//   icon: LucideIcon;
//   intro: string;
//   symptoms: string[];
//   approaches: ServiceApproach[];
//   whatToExpect: string;
//   faqs: ServiceFAQ[];
//   tags: string[];
// }

// export const services: Service[] = [
//   {
//     slug: "anxiety-stress-therapy",
//     title: "Anxiety & Stress Therapy",
//     shortTitle: "Anxiety & Stress",
//     shortDesc:
//       "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
//     metaTitle: "Anxiety & Stress Therapy in Nigeria | Mentel LTD",
//     metaDescription:
//       "Work with a licensed therapist in Nigeria to manage anxiety, chronic stress and racing thoughts. CBT and mindfulness-based online sessions. Book a free consultation.",
//     keywords: [
//       "anxiety therapy Nigeria",
//       "stress management Nigeria",
//       "online anxiety counselling",
//       "CBT therapist Nigeria",
//       "anxiety therapy",
//       "online anxiety therapy",
//       "anxiety therapist",
//       "CBT for anxiety",
//       "anxiety therapist Nigeria",
//     ],
//     icon: Brain,
//     tags: ["CBT", "Mindfulness", "Breathing Techniques"],
//     intro:
//       "Anxiety and chronic stress show up differently for everyone, from a constantly racing mind to tight shoulders and a stomach that never quite settles. At Mentel, our licensed therapists help you understand what is driving your anxiety and build practical, evidence-based skills to manage it, whether it stems from work pressure, finances, relationships, or an anxiety disorder that has been with you for years. Sessions are held online, so you can work with a Nigerian therapist who understands your context, from a private space that feels comfortable to you.",
//     symptoms: [
//       "Persistent worry that is hard to switch off, even when things are going well",
//       "Racing or intrusive thoughts, especially at night",
//       "Physical symptoms such as a tight chest, rapid heartbeat, or stomach upset",
//       "Avoiding situations, people, or tasks out of fear or dread",
//       "Irritability, restlessness, or trouble concentrating",
//       "Panic attacks or a recurring sense that something bad is about to happen",
//     ],
//     approaches: [
//       {
//         name: "Cognitive Behavioural Therapy (CBT)",
//         desc: "We help you identify the thought patterns that fuel anxiety and replace them with more balanced, realistic ways of thinking.",
//       },
//       {
//         name: "Mindfulness-Based Techniques",
//         desc: "Grounding and present-moment awareness practices that reduce the intensity of anxious spirals over time.",
//       },
//       {
//         name: "Breathing & Nervous System Regulation",
//         desc: "Practical exercises you can use in the moment to calm your body when anxiety spikes.",
//       },
//     ],
//     whatToExpect:
//       "Your first session focuses on understanding your history with anxiety and stress, what triggers it, and what you have already tried. From there, your therapist builds a plan tailored to you, combining talk therapy with tools you can practise between sessions. Most clients notice a measurable reduction in symptoms within six to eight sessions.",
//     faqs: [
//       {
//         q: "How long does anxiety therapy take to work?",
//         a: "Many clients notice meaningful improvement within four to six sessions, though this varies depending on how long the anxiety has been present and its severity.",
//       },
//       {
//         q: "Is online anxiety therapy as effective as in-person sessions?",
//         a: "Research consistently shows online CBT and talk therapy produce outcomes comparable to in-person sessions, with the added benefit of convenience and privacy.",
//       },
//       {
//         q: "Do I need a diagnosis to start therapy for anxiety?",
//         a: "No. You do not need a formal diagnosis to begin. Many clients start therapy simply because stress or worry is affecting their daily life, work, or relationships.",
//       },
//       {
//         q: "Can therapy help with panic attacks?",
//         a: "Yes. Therapists at Mentel use CBT and nervous-system regulation techniques specifically shown to reduce the frequency and intensity of panic attacks.",
//       },
//     ],
//   },
//   {
//     slug: "depression-therapy",
//     title: "Depression Therapy",
//     shortTitle: "Depression",
//     shortDesc:
//       "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
//     metaTitle: "Depression Therapy & Counselling in Nigeria | Mentel LTD",
//     metaDescription:
//       "Compassionate, evidence-based depression therapy with licensed Nigerian therapists. Talk therapy and behavioural activation delivered online. Book a free consultation.",
//     keywords: [
//       "depression therapy Nigeria",
//       "depression counselling Lagos",
//       "online therapist for depression",
//       "low mood treatment Nigeria",
//       "depression therapy",
//       "online depression therapy",
//       "depression therapist",
//       "depression counselling Nigeria",
//     ],
//     icon: Heart,
//     tags: ["Behavioural Activation", "Talk Therapy"],
//     intro:
//       "Depression can make even ordinary tasks feel heavy, and it often convinces you that things will not get better. That is not true, and it is not a reflection of your character or strength. At Mentel, our therapists work with you to understand what is contributing to your low mood, whether it is grief, burnout, a life transition, or a longer-standing pattern, and to rebuild a sense of motivation and connection at a pace that respects where you are right now.",
//     symptoms: [
//       "Persistent low mood or sadness lasting more than two weeks",
//       "Loss of interest in activities you used to enjoy",
//       "Low energy, fatigue, or sleeping too much or too little",
//       "Difficulty concentrating or making decisions",
//       "Withdrawing from friends, family, or work",
//       "Feelings of worthlessness, hopelessness, or guilt",
//     ],
//     approaches: [
//       {
//         name: "Behavioural Activation",
//         desc: "A structured way of reintroducing small, meaningful activities that rebuild motivation and momentum.",
//       },
//       {
//         name: "Talk Therapy",
//         desc: "A safe, non-judgmental space to process what you are carrying and understand the roots of your low mood.",
//       },
//       {
//         name: "Cognitive Restructuring",
//         desc: "Techniques to gently challenge the self-critical thought patterns that often accompany depression.",
//       },
//     ],
//     whatToExpect:
//       "Your therapist will start by understanding your history, current symptoms, and support system. Together you will set small, achievable goals to rebuild momentum, while addressing the underlying thought patterns that keep low mood in place. Many clients begin to notice small shifts in energy and outlook within the first few weeks.",
//     faqs: [
//       {
//         q: "How do I know if I need therapy for depression?",
//         a: "If low mood, loss of interest, or fatigue has lasted more than two weeks and is affecting your work, relationships, or daily functioning, therapy can help, whether or not you have a formal diagnosis.",
//       },
//       {
//         q: "Can therapy help with depression without medication?",
//         a: "Yes. Talk therapy and behavioural activation are effective on their own for many people. Your therapist can also advise when a referral for medical support may be helpful.",
//       },
//       {
//         q: "What if I do not know what is causing my depression?",
//         a: "That is common, and completely fine. Part of the therapeutic process is exploring your history and current life together to understand the contributing factors.",
//       },
//       {
//         q: "Is online depression counselling private?",
//         a: "Yes. Sessions are confidential and held over a secure video call, so you can speak openly from a space where you feel safe.",
//       },
//     ],
//   },
//   {
//     slug: "marriage-couples-therapy",
//     title: "Marriage & Couples Therapy",
//     shortTitle: "Marriage & Couples",
//     shortDesc:
//       "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
//     metaTitle: "Marriage & Couples Therapy in Nigeria | Mentel LTD",
//     metaDescription:
//       "Rebuild trust and communication with licensed couples therapists in Nigeria. Gottman Method and EFT-informed sessions delivered online. Book a free consultation.",
//     keywords: [
//       "couples therapy Nigeria",
//       "marriage counselling Lagos",
//       "relationship therapist Nigeria",
//       "online couples counselling",
//       "couples therapy",
//       "relationship therapy",
//       "marriage counselling",
//       "online couples therapy",
//       "relationship counselling",
//       "relationship counselling Nigeria",
//     ],
//     icon: Users,
//     tags: ["Gottman Method", "EFT", "Conflict Resolution"],
//     intro:
//       "Every relationship goes through seasons of disconnection, whether from repeated arguments, trust that has been broken, or simply drifting apart under the weight of work and life. Couples therapy at Mentel gives you and your partner a structured, guided space to be heard, understand each other's underlying needs, and rebuild the connection you are looking for, together.",
//     symptoms: [
//       "Recurring arguments that never seem to get resolved",
//       "Feeling unheard, dismissed, or disconnected from your partner",
//       "Difficulty rebuilding trust after infidelity or a breach of trust",
//       "Different expectations around finances, family, or parenting",
//       "Growing emotional or physical distance in the relationship",
//       "Considering separation but wanting to try everything first",
//     ],
//     approaches: [
//       {
//         name: "The Gottman Method",
//         desc: "A research-backed framework for improving communication, managing conflict, and deepening friendship between partners.",
//       },
//       {
//         name: "Emotionally Focused Therapy (EFT)",
//         desc: "Helps couples identify the emotional patterns driving disconnection and rebuild secure attachment.",
//       },
//       {
//         name: "Conflict Resolution Skills",
//         desc: "Practical tools for arguing productively, so disagreements strengthen rather than erode the relationship.",
//       },
//     ],
//     whatToExpect:
//       "Sessions typically begin with both partners sharing their perspective on the relationship's history and current challenges. Your therapist helps surface the patterns beneath recurring conflicts and introduces structured exercises to practise between sessions. Couples therapy is collaborative, both partners are active participants, not just the therapist working on one person.",
//     faqs: [
//       {
//         q: "Does couples therapy mean our relationship is failing?",
//         a: "No. Many couples come to therapy simply to strengthen a good relationship, improve communication, or navigate a specific life transition together.",
//       },
//       {
//         q: "What if my partner is hesitant to join?",
//         a: "This is common. You are welcome to start with an individual session to explore your concerns, and your therapist can advise on how to invite your partner in.",
//       },
//       {
//         q: "Can couples therapy help after infidelity?",
//         a: "Yes, many couples successfully rebuild trust after infidelity with structured support. It requires commitment from both partners and typically takes longer than general relationship work.",
//       },
//       {
//         q: "Is online couples therapy effective?",
//         a: "Yes. Video sessions allow both partners to join from a comfortable, private space, and outcomes are comparable to in-person couples therapy.",
//       },
//     ],
//   },
//   {
//     slug: "trauma-ptsd-therapy",
//     title: "Trauma & PTSD Therapy",
//     shortTitle: "Trauma & PTSD",
//     shortDesc:
//       "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
//     metaTitle: "Trauma & PTSD Therapy in Nigeria | Mentel LTD",
//     metaDescription:
//       "Trauma-informed therapy with licensed Nigerian therapists trained in EMDR, somatic therapy and narrative approaches. Confidential online sessions. Book a free consultation.",
//     keywords: [
//       "trauma therapy Nigeria",
//       "PTSD treatment Lagos",
//       "EMDR therapist Nigeria",
//       "trauma-informed counselling",
//       "PTSD treatment Nigeria",
//       "trauma therapy",
//       "trauma therapist",
//       "PTSD therapy",
//       "EMDR therapy",
//     ],
//     icon: Anchor,
//     tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
//     intro:
//       "Trauma can live in the mind and the body long after the event itself has passed, shaping how you respond to stress, relationships, and even ordinary moments in daily life. Our trauma-informed therapists create a safe, paced environment where you are never pushed faster than you are ready to go, using approaches with strong evidence for helping people process and move through traumatic experiences.",
//     symptoms: [
//       "Flashbacks, intrusive memories, or nightmares related to a past event",
//       "Feeling constantly on edge, easily startled, or hypervigilant",
//       "Avoiding people, places, or situations that are reminders of the trauma",
//       "Emotional numbness or difficulty feeling connected to others",
//       "Physical tension, unexplained pain, or a heightened stress response",
//       "Difficulty trusting others or feeling safe, even in stable environments",
//     ],
//     approaches: [
//       {
//         name: "EMDR (Eye Movement Desensitisation and Reprocessing)",
//         desc: "A structured, well-researched approach that helps the brain reprocess traumatic memories so they lose their emotional intensity.",
//       },
//       {
//         name: "Somatic Therapy",
//         desc: "Body-based techniques that address how trauma is held physically, not just cognitively.",
//       },
//       {
//         name: "Narrative Therapy",
//         desc: "Helps you reshape your relationship to your story, separating your identity from what happened to you.",
//       },
//     ],
//     whatToExpect:
//       "Trauma therapy begins with building safety and stability before any processing work starts. Your therapist will move at a pace led by you, checking in regularly and equipping you with grounding tools before deeper work begins. Healing from trauma is not linear, and your therapist will support you through the full course of it.",
//     faqs: [
//       {
//         q: "Do I have to talk about the traumatic event in detail?",
//         a: "No. Approaches like EMDR do not require you to narrate every detail of what happened for processing to be effective. Your therapist will explain what each approach requires before you begin.",
//       },
//       {
//         q: "How long does trauma therapy usually take?",
//         a: "This varies widely depending on the nature and duration of the trauma. Some clients see meaningful shifts within a few months, while more complex trauma may take longer.",
//       },
//       {
//         q: "Is EMDR safe to do online?",
//         a: "Yes, EMDR can be adapted for secure video sessions and has been shown to be effective when delivered online.",
//       },
//       {
//         q: "What is the difference between trauma and PTSD?",
//         a: "Trauma refers to the response to a distressing event, while PTSD is a clinical diagnosis involving specific, persistent symptoms. You do not need a PTSD diagnosis to benefit from trauma-informed therapy.",
//       },
//     ],
//   },
//   {
//     slug: "burnout-life-transitions",
//     title: "Burnout & Life Transitions",
//     shortTitle: "Burnout & Transitions",
//     shortDesc:
//       "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
//     metaTitle:
//       "Burnout Therapy & Life Transition Coaching in Nigeria | Mentel LTD",
//     metaDescription:
//       "Recover from burnout and navigate major life transitions with licensed Nigerian therapists. Values-based coaching and goal setting, delivered online.",
//     keywords: [
//       "burnout therapy Nigeria",
//       "burnout recovery Lagos",
//       "career transition coaching Nigeria",
//       "life transition therapist",
//       "burnout therapy",
//       "burnout therapist",
//       "burnout recovery",
//       "work stress therapy",
//       "burnout therapist Nigeria",
//     ],
//     icon: Flame,
//     tags: ["Life Coaching", "Values Work", "Goal Setting"],
//     intro:
//       "Burnout rarely announces itself all at once. It builds up through months, sometimes years, of overwork, unclear boundaries, or misalignment between what you do and what actually matters to you. Whether you are exhausted from work, adjusting to a new role, relocating, or rebuilding your identity after a major life change, Mentel's therapists help you find your footing again and move forward with clarity.",
//     symptoms: [
//       "Chronic exhaustion that rest does not seem to fix",
//       "Cynicism or detachment from work you used to care about",
//       "Reduced sense of accomplishment or effectiveness",
//       "Difficulty concentrating or making decisions",
//       "Feeling stuck, directionless, or unsure who you are outside of a role or title",
//       "Physical symptoms of stress, such as headaches or disrupted sleep",
//     ],
//     approaches: [
//       {
//         name: "Life & Career Coaching",
//         desc: "Structured support to reassess priorities, set boundaries, and design a sustainable way forward.",
//       },
//       {
//         name: "Values Clarification Work",
//         desc: "Exercises to reconnect with what genuinely matters to you, so decisions come from clarity rather than exhaustion.",
//       },
//       {
//         name: "Goal Setting",
//         desc: "Practical, achievable steps toward the changes you want to make, whether in work, identity, or daily routine.",
//       },
//     ],
//     whatToExpect:
//       "Sessions start by mapping out where burnout or transition is showing up in your life and what has contributed to it. Your therapist helps you set realistic boundaries, reconnect with your values, and build a plan for the transition ahead, whether that means changing how you work, changing roles entirely, or adjusting to a new chapter of life.",
//     faqs: [
//       {
//         q: "How is burnout different from regular stress?",
//         a: "Burnout is a state of chronic exhaustion, cynicism, and reduced effectiveness that builds up over time, whereas everyday stress tends to be more situational and shorter-lived.",
//       },
//       {
//         q: "Can therapy help if I am simply going through a life transition, not burnout?",
//         a: "Yes. Many clients come to Mentel for support navigating a move, career change, new parenthood, or other transitions, without any diagnosis or crisis involved.",
//       },
//       {
//         q: "How many sessions does burnout recovery typically take?",
//         a: "Many clients begin to feel a shift in energy and clarity within six to eight sessions, though full recovery often depends on whether underlying work or life conditions also change.",
//       },
//       {
//         q: "Is this therapy or coaching?",
//         a: "It is a blend of both. Your therapist draws on clinical training as well as coaching techniques, so sessions are both emotionally supportive and practically oriented toward change.",
//       },
//     ],
//   },
//   {
//     slug: "self-esteem-growth-therapy",
//     title: "Self-Esteem & Personal Growth",
//     shortTitle: "Self-Esteem & Growth",
//     shortDesc:
//       "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
//     metaTitle: "Self-Esteem & Personal Growth Therapy in Nigeria | Mentel LTD",
//     metaDescription:
//       "Build genuine self-esteem and work through self-criticism with licensed Nigerian therapists using ACT and schema therapy. Confidential online sessions.",
//     keywords: [
//       "self-esteem therapy Nigeria",
//       "confidence coaching Lagos",
//       "personal growth therapist Nigeria",
//       "ACT therapy Nigeria",
//       "self-esteem therapist Nigeria",
//       "confidence therapy Nigeria",
//       "self-esteem therapy",
//       "self-esteem therapist",
//       "confidence therapy",
//     ],
//     icon: Sun,
//     tags: ["Schema Therapy", "ACT", "Compassion Work"],
//     intro:
//       "Low self-esteem often shows up as a harsh inner voice, second-guessing decisions, or a persistent sense that you are not quite enough, no matter what you achieve. This work is about building a genuinely healthier relationship with yourself, not through empty affirmations, but by understanding where these patterns come from and building new ones that hold up under real life.",
//     symptoms: [
//       "A persistent inner critic or harsh self-talk",
//       "Difficulty accepting compliments or acknowledging your own achievements",
//       "People-pleasing or difficulty setting boundaries",
//       "Comparing yourself unfavourably to others",
//       "Fear of failure that holds you back from opportunities",
//       "A sense of not knowing who you are outside of others' expectations",
//     ],
//     approaches: [
//       {
//         name: "Schema Therapy",
//         desc: "Identifies the early life patterns behind persistent self-esteem struggles and works to shift them at the root.",
//       },
//       {
//         name: "Acceptance and Commitment Therapy (ACT)",
//         desc: "Helps you build psychological flexibility, so self-critical thoughts have less power over your choices.",
//       },
//       {
//         name: "Compassion-Focused Work",
//         desc: "Practical exercises to build genuine self-compassion, especially useful if self-criticism has become automatic.",
//       },
//     ],
//     whatToExpect:
//       "Your therapist will explore where your current self-view comes from, including early experiences, relationships, and recurring patterns of self-talk. From there, you will work together on practical exercises to challenge unhelpful beliefs and build a steadier, more compassionate relationship with yourself over time.",
//     faqs: [
//       {
//         q: "Is low self-esteem the same as depression?",
//         a: "Not necessarily. Low self-esteem can exist on its own or alongside depression or anxiety. Your therapist will help clarify what is happening for you specifically.",
//       },
//       {
//         q: "Can therapy really change how I see myself?",
//         a: "Yes, with consistent work. Self-esteem is shaped by patterns learned over years, and it can also be reshaped, though it typically takes sustained practice rather than a single session.",
//       },
//       {
//         q: "How is this different from confidence coaching?",
//         a: "Therapy addresses the underlying patterns and history behind self-esteem, while coaching tends to focus more narrowly on skills and performance. Our approach blends both.",
//       },
//       {
//         q: "Who typically seeks self-esteem therapy?",
//         a: "Clients range from young professionals navigating comparison and imposter feelings to individuals working through long-standing patterns from childhood or past relationships.",
//       },
//     ],
//   },
//   {
//     slug: "adhd-therapy",
//     title: "ADHD Support & Therapy",
//     shortTitle: "ADHD Support",
//     shortDesc:
//       "Understand your attention, focus, and executive function, and build systems that actually work for how your brain operates.",
//     metaTitle: "ADHD Therapy & Coaching in Nigeria | Mentel LTD",
//     metaDescription:
//       "Work with a licensed Nigerian therapist on ADHD, focus, and executive function challenges. Practical, non-judgmental online support. Book a free consultation.",
//     keywords: [
//       "ADHD therapy Nigeria",
//       "adult ADHD support Lagos",
//       "ADHD coaching Nigeria",
//       "executive function therapist",
//       "ADHD therapy",
//       "adult ADHD therapy",
//       "ADHD coaching",
//       "executive function therapy",
//       "adult ADHD support Nigeria",
//     ],
//     icon: Puzzle,
//     tags: ["ADHD Coaching", "Executive Function", "CBT for ADHD"],
//     intro:
//       "Living with ADHD, whether diagnosed in childhood or only recognised in adulthood, often means fighting an ongoing battle with focus, time, and follow-through, even on things that genuinely matter to you. At Mentel, our therapists help you understand how your brain works, not against you, and build practical systems for attention, organisation, and emotional regulation that fit your actual life, without the shame that so often gets attached to ADHD.",
//     symptoms: [
//       "Difficulty sustaining focus, especially on tasks that are not immediately engaging",
//       "Losing track of time, deadlines, or appointments",
//       "Starting projects with enthusiasm but struggling to finish them",
//       "Restlessness, impulsivity, or difficulty sitting through meetings or long conversations",
//       "Feeling overwhelmed by everyday organisation, such as bills, emails, or chores",
//       "A long history of being called lazy, careless, or disorganised, despite trying hard",
//     ],
//     approaches: [
//       {
//         name: "ADHD Coaching",
//         desc: "Practical, collaborative work to build routines, systems, and accountability structures suited to how your brain actually functions.",
//       },
//       {
//         name: "CBT for ADHD",
//         desc: "Adapted cognitive behavioural techniques that address the self-criticism and avoidance patterns that often build up around ADHD.",
//       },
//       {
//         name: "Executive Function Strategies",
//         desc: "Concrete tools for planning, prioritising, and time management, tailored to your specific challenges rather than generic productivity advice.",
//       },
//     ],
//     whatToExpect:
//       "Your first session focuses on understanding how ADHD shows up for you specifically, in work, relationships, and daily routines, and what has or has not worked before. From there, your therapist helps you build realistic systems and coping strategies, while also addressing the frustration or self-criticism that often builds up after years of feeling like you are working harder than everyone else for the same results.",
//     faqs: [
//       {
//         q: "Do I need a formal ADHD diagnosis to start therapy?",
//         a: "No. You can start working with a therapist on attention, focus, and organisation challenges without a formal diagnosis. Your therapist can also discuss the assessment and referral process if you want to pursue one.",
//       },
//       {
//         q: "Can adults be diagnosed with ADHD, or is it just for children?",
//         a: "ADHD is increasingly recognised in adults, many of whom were never diagnosed as children. It is common to first realise you have ADHD in your twenties, thirties, or later.",
//       },
//       {
//         q: "Is ADHD therapy the same as medication management?",
//         a: "No. Mentel's therapists focus on coaching, CBT, and executive function strategies. If medication is something you want to explore, your therapist can guide you on next steps for a medical referral.",
//       },
//       {
//         q: "Will therapy help with procrastination and follow-through, not just focus?",
//         a: "Yes. Much of ADHD-focused therapy centres on the gap between intention and action, building systems that reduce reliance on willpower alone.",
//       },
//     ],
//   },
// ];

// export function getServiceBySlug(slug: string): Service | undefined {
//   return services.find((s) => s.slug === slug);
// }

import {
  Brain,
  Heart,
  Users,
  Anchor,
  Flame,
  Sun,
  Puzzle,
  Feather,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceApproach {
  name: string;
  desc: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  shortDesc: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  icon: LucideIcon;
  intro: string;
  symptoms: string[];
  causesAndContext: string;
  approaches: ServiceApproach[];
  whatToExpect: string;
  faqs: ServiceFAQ[];
  tags: string[];
}

export const services: Service[] = [
  {
    slug: "anxiety-stress-therapy",
    title: "Anxiety & Stress Therapy",
    shortTitle: "Anxiety & Stress",
    shortDesc:
      "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
    metaTitle: "Anxiety & Stress Therapy in Nigeria | Mentel LTD",
    metaDescription:
      "Work with a licensed therapist in Nigeria to manage anxiety, chronic stress and racing thoughts. CBT and mindfulness-based online sessions. Book a free consultation.",
    keywords: [
      "anxiety therapy Nigeria",
      "stress management Nigeria",
      "online anxiety counselling",
      "CBT therapist Nigeria",
      "anxiety therapy",
      "online anxiety therapy",
      "anxiety therapist",
      "CBT for anxiety",
      "anxiety therapist Nigeria",
    ],
    icon: Brain,
    tags: ["CBT", "Mindfulness", "Breathing Techniques"],
    intro:
      "Anxiety and chronic stress show up differently for everyone, from a constantly racing mind to tight shoulders and a stomach that never quite settles. At Mentel, our licensed therapists help you understand what is driving your anxiety and build practical, evidence-based skills to manage it, whether it stems from work pressure, finances, relationships, or an anxiety disorder that has been with you for years. Sessions are held online, so you can work with a Nigerian therapist who understands your context, from a private space that feels comfortable to you.",
    symptoms: [
      "Persistent worry that is hard to switch off, even when things are going well",
      "Racing or intrusive thoughts, especially at night",
      "Physical symptoms such as a tight chest, rapid heartbeat, or stomach upset",
      "Avoiding situations, people, or tasks out of fear or dread",
      "Irritability, restlessness, or trouble concentrating",
      "Panic attacks or a recurring sense that something bad is about to happen",
    ],
    causesAndContext:
      "Anxiety and chronic stress rarely come from a single cause. For many people in Nigeria, they build up from a mix of financial pressure, demanding work environments, family expectations, relationship strain, or the constant low-grade uncertainty of daily life in a fast-moving city like Lagos, Abuja, or Port Harcourt. Genetics and temperament also play a role, some people are simply wired to feel threat more intensely, while past experiences, including childhood environments where worry was normalised or safety felt unpredictable, can shape how the nervous system responds to stress well into adulthood. Anxiety can also develop or worsen around major transitions, starting a new job, relocating, getting married, or becoming a parent, even when the change itself is a positive one. Understanding your specific mix of triggers, rather than treating anxiety as one uniform condition, is central to how our therapists design your treatment plan.",
    approaches: [
      {
        name: "Cognitive Behavioural Therapy (CBT)",
        desc: "We help you identify the thought patterns that fuel anxiety and replace them with more balanced, realistic ways of thinking.",
      },
      {
        name: "Mindfulness-Based Techniques",
        desc: "Grounding and present-moment awareness practices that reduce the intensity of anxious spirals over time.",
      },
      {
        name: "Breathing & Nervous System Regulation",
        desc: "Practical exercises you can use in the moment to calm your body when anxiety spikes.",
      },
    ],
    whatToExpect:
      "Your first session focuses on understanding your history with anxiety and stress, what triggers it, and what you have already tried. From there, your therapist builds a plan tailored to you, combining talk therapy with tools you can practise between sessions. Most clients notice a measurable reduction in symptoms within six to eight sessions.",
    faqs: [
      {
        q: "How long does anxiety therapy take to work?",
        a: "Many clients notice meaningful improvement within four to six sessions, though this varies depending on how long the anxiety has been present and its severity.",
      },
      {
        q: "Is online anxiety therapy as effective as in-person sessions?",
        a: "Research consistently shows online CBT and talk therapy produce outcomes comparable to in-person sessions, with the added benefit of convenience and privacy.",
      },
      {
        q: "Do I need a diagnosis to start therapy for anxiety?",
        a: "No. You do not need a formal diagnosis to begin. Many clients start therapy simply because stress or worry is affecting their daily life, work, or relationships.",
      },
      {
        q: "Can therapy help with panic attacks?",
        a: "Yes. Therapists at Mentel use CBT and nervous-system regulation techniques specifically shown to reduce the frequency and intensity of panic attacks.",
      },
      {
        q: "What is the difference between everyday stress and an anxiety disorder?",
        a: "Everyday stress is usually tied to a specific situation and eases once it passes. An anxiety disorder involves persistent, excessive worry that continues even when there is no clear trigger, and interferes with daily functioning. Your therapist can help you understand which pattern fits your experience.",
      },
      {
        q: "How much does anxiety therapy cost in Nigeria?",
        a: "Mentel offers a pay-per-session option as well as monthly Care and Plus plans, so you can choose what fits your budget and how often you would like to meet. Visit our booking page for current pricing.",
      },
    ],
  },
  {
    slug: "depression-therapy",
    title: "Depression Therapy",
    shortTitle: "Depression",
    shortDesc:
      "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
    metaTitle: "Depression Therapy & Counselling in Nigeria | Mentel LTD",
    metaDescription:
      "Compassionate, evidence-based depression therapy with licensed Nigerian therapists. Talk therapy and behavioural activation delivered online. Book a free consultation.",
    keywords: [
      "depression therapy Nigeria",
      "depression counselling Lagos",
      "online therapist for depression",
      "low mood treatment Nigeria",
      "depression therapy",
      "online depression therapy",
      "depression therapist",
      "depression counselling Nigeria",
    ],
    icon: Heart,
    tags: ["Behavioural Activation", "Talk Therapy"],
    intro:
      "Depression can make even ordinary tasks feel heavy, and it often convinces you that things will not get better. That is not true, and it is not a reflection of your character or strength. At Mentel, our therapists work with you to understand what is contributing to your low mood, whether it is grief, burnout, a life transition, or a longer-standing pattern, and to rebuild a sense of motivation and connection at a pace that respects where you are right now.",
    symptoms: [
      "Persistent low mood or sadness lasting more than two weeks",
      "Loss of interest in activities you used to enjoy",
      "Low energy, fatigue, or sleeping too much or too little",
      "Difficulty concentrating or making decisions",
      "Withdrawing from friends, family, or work",
      "Feelings of worthlessness, hopelessness, or guilt",
    ],
    causesAndContext:
      "Depression is rarely caused by one single event. It often develops from a combination of biological factors, such as changes in brain chemistry or a family history of depression, and life circumstances, including grief, prolonged stress, burnout, relationship difficulties, financial strain, or a major life transition. In Nigeria, cultural stigma around mental health can also delay people from recognising depression or seeking support, sometimes for years, which can allow low mood to deepen and become harder to shift. Depression can also emerge without any clear external trigger at all, which does not make it any less real or any less deserving of care. Postpartum depression, seasonal shifts in mood, and depression linked to chronic illness are also common patterns our therapists see and are trained to work with.",
    approaches: [
      {
        name: "Behavioural Activation",
        desc: "A structured way of reintroducing small, meaningful activities that rebuild motivation and momentum.",
      },
      {
        name: "Talk Therapy",
        desc: "A safe, non-judgmental space to process what you are carrying and understand the roots of your low mood.",
      },
      {
        name: "Cognitive Restructuring",
        desc: "Techniques to gently challenge the self-critical thought patterns that often accompany depression.",
      },
    ],
    whatToExpect:
      "Your therapist will start by understanding your history, current symptoms, and support system. Together you will set small, achievable goals to rebuild momentum, while addressing the underlying thought patterns that keep low mood in place. Many clients begin to notice small shifts in energy and outlook within the first few weeks.",
    faqs: [
      {
        q: "How do I know if I need therapy for depression?",
        a: "If low mood, loss of interest, or fatigue has lasted more than two weeks and is affecting your work, relationships, or daily functioning, therapy can help, whether or not you have a formal diagnosis.",
      },
      {
        q: "Can therapy help with depression without medication?",
        a: "Yes. Talk therapy and behavioural activation are effective on their own for many people. Your therapist can also advise when a referral for medical support may be helpful.",
      },
      {
        q: "What if I do not know what is causing my depression?",
        a: "That is common, and completely fine. Part of the therapeutic process is exploring your history and current life together to understand the contributing factors.",
      },
      {
        q: "Is online depression counselling private?",
        a: "Yes. Sessions are confidential and held over a secure video call, so you can speak openly from a space where you feel safe.",
      },
      {
        q: "How do I find the best therapist for depression in Nigeria?",
        a: "Look for a licensed therapist with experience in evidence-based approaches like behavioural activation and CBT, and who you feel comfortable being open with. Mentel matches you with a therapist based on what you are going through, and you can request a different one at any time if the fit is not right.",
      },
      {
        q: "What is the difference between sadness and clinical depression?",
        a: "Sadness is a normal, temporary emotional response to a difficult event. Clinical depression involves a persistent low mood or loss of interest lasting two weeks or more, alongside other symptoms like fatigue or hopelessness, and it affects daily functioning even after the initial trigger has passed.",
      },
    ],
  },
  {
    slug: "marriage-couples-therapy",
    title: "Marriage & Couples Therapy",
    shortTitle: "Marriage & Couples",
    shortDesc:
      "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
    metaTitle: "Marriage & Couples Therapy in Nigeria | Mentel LTD",
    metaDescription:
      "Rebuild trust and communication with licensed couples therapists in Nigeria. Gottman Method and EFT-informed sessions delivered online. Book a free consultation.",
    keywords: [
      "couples therapy Nigeria",
      "marriage counselling Lagos",
      "relationship therapist Nigeria",
      "online couples counselling",
      "couples therapy",
      "relationship therapy",
      "marriage counselling",
      "online couples therapy",
      "relationship counselling",
      "relationship counselling Nigeria",
    ],
    icon: Users,
    tags: ["Gottman Method", "EFT", "Conflict Resolution"],
    intro:
      "Every relationship goes through seasons of disconnection, whether from repeated arguments, trust that has been broken, or simply drifting apart under the weight of work and life. Couples therapy at Mentel gives you and your partner a structured, guided space to be heard, understand each other's underlying needs, and rebuild the connection you are looking for, together.",
    symptoms: [
      "Recurring arguments that never seem to get resolved",
      "Feeling unheard, dismissed, or disconnected from your partner",
      "Difficulty rebuilding trust after infidelity or a breach of trust",
      "Different expectations around finances, family, or parenting",
      "Growing emotional or physical distance in the relationship",
      "Considering separation but wanting to try everything first",
    ],
    causesAndContext:
      "Relationship disconnection tends to build gradually rather than appear overnight. Common contributors include unresolved conflict that keeps resurfacing in new forms, mismatched communication styles, differing expectations around finances, in-laws, parenting, or religion, and the everyday pressure of work and family life crowding out time for the relationship itself. Trust breaches, whether infidelity, financial secrecy, or broken promises, are another common reason couples seek support, as are major life transitions such as relocating, having a child, or blending families, all of which can strain even strong relationships. Many Nigerian couples also navigate additional pressure from extended family involvement and cultural expectations around marriage, which can add complexity to conflicts that might otherwise be straightforward to resolve. Couples therapy helps you name what is actually driving the disconnection, rather than continuing to fight about its surface symptoms.",
    approaches: [
      {
        name: "The Gottman Method",
        desc: "A research-backed framework for improving communication, managing conflict, and deepening friendship between partners.",
      },
      {
        name: "Emotionally Focused Therapy (EFT)",
        desc: "Helps couples identify the emotional patterns driving disconnection and rebuild secure attachment.",
      },
      {
        name: "Conflict Resolution Skills",
        desc: "Practical tools for arguing productively, so disagreements strengthen rather than erode the relationship.",
      },
    ],
    whatToExpect:
      "Sessions typically begin with both partners sharing their perspective on the relationship's history and current challenges. Your therapist helps surface the patterns beneath recurring conflicts and introduces structured exercises to practise between sessions. Couples therapy is collaborative, both partners are active participants, not just the therapist working on one person.",
    faqs: [
      {
        q: "Does couples therapy mean our relationship is failing?",
        a: "No. Many couples come to therapy simply to strengthen a good relationship, improve communication, or navigate a specific life transition together.",
      },
      {
        q: "What if my partner is hesitant to join?",
        a: "This is common. You are welcome to start with an individual session to explore your concerns, and your therapist can advise on how to invite your partner in.",
      },
      {
        q: "Can couples therapy help after infidelity?",
        a: "Yes, many couples successfully rebuild trust after infidelity with structured support. It requires commitment from both partners and typically takes longer than general relationship work.",
      },
      {
        q: "Is online couples therapy effective?",
        a: "Yes. Video sessions allow both partners to join from a comfortable, private space, and outcomes are comparable to in-person couples therapy.",
      },
      {
        q: "How many sessions does couples therapy usually take?",
        a: "Many couples notice improved communication within six to eight sessions, though this depends on how long the difficulties have been present and what you are working through together.",
      },
      {
        q: "Do you offer marriage counselling for couples not yet married?",
        a: "Yes. Our couples therapists work with dating, engaged, cohabiting, and married partners alike, on anything from premarital preparation to long-standing relationship patterns.",
      },
    ],
  },
  {
    slug: "trauma-ptsd-therapy",
    title: "Trauma & PTSD Therapy",
    shortTitle: "Trauma & PTSD",
    shortDesc:
      "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
    metaTitle: "Trauma & PTSD Therapy in Nigeria | Mentel LTD",
    metaDescription:
      "Trauma-informed therapy with licensed Nigerian therapists trained in EMDR, somatic therapy and narrative approaches. Confidential online sessions. Book a free consultation.",
    keywords: [
      "trauma therapy Nigeria",
      "PTSD treatment Lagos",
      "EMDR therapist Nigeria",
      "trauma-informed counselling",
      "PTSD treatment Nigeria",
      "trauma therapy",
      "trauma therapist",
      "PTSD therapy",
      "EMDR therapy",
    ],
    icon: Anchor,
    tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
    intro:
      "Trauma can live in the mind and the body long after the event itself has passed, shaping how you respond to stress, relationships, and even ordinary moments in daily life. Our trauma-informed therapists create a safe, paced environment where you are never pushed faster than you are ready to go, using approaches with strong evidence for helping people process and move through traumatic experiences.",
    symptoms: [
      "Flashbacks, intrusive memories, or nightmares related to a past event",
      "Feeling constantly on edge, easily startled, or hypervigilant",
      "Avoiding people, places, or situations that are reminders of the trauma",
      "Emotional numbness or difficulty feeling connected to others",
      "Physical tension, unexplained pain, or a heightened stress response",
      "Difficulty trusting others or feeling safe, even in stable environments",
    ],
    causesAndContext:
      "Trauma can result from a single distressing event, such as an accident, assault, robbery, or medical emergency, or from prolonged exposure to distressing circumstances, including childhood neglect, domestic violence, community violence, or an unsafe work environment. It can also be inherited relationally, growing up around a parent who was themselves unhealed from trauma can shape a child's nervous system long before they have language for what happened. In Nigeria, experiences such as armed robbery, kidnapping, civil unrest, workplace harassment, or road traffic accidents are among the more common trauma triggers our therapists encounter, alongside personal and relational trauma. What determines whether an event becomes traumatic is not only what happened, but how supported, safe, and able to process it you were at the time, which is why two people can experience the same event very differently.",
    approaches: [
      {
        name: "EMDR (Eye Movement Desensitisation and Reprocessing)",
        desc: "A structured, well-researched approach that helps the brain reprocess traumatic memories so they lose their emotional intensity.",
      },
      {
        name: "Somatic Therapy",
        desc: "Body-based techniques that address how trauma is held physically, not just cognitively.",
      },
      {
        name: "Narrative Therapy",
        desc: "Helps you reshape your relationship to your story, separating your identity from what happened to you.",
      },
    ],
    whatToExpect:
      "Trauma therapy begins with building safety and stability before any processing work starts. Your therapist will move at a pace led by you, checking in regularly and equipping you with grounding tools before deeper work begins. Healing from trauma is not linear, and your therapist will support you through the full course of it.",
    faqs: [
      {
        q: "Do I have to talk about the traumatic event in detail?",
        a: "No. Approaches like EMDR do not require you to narrate every detail of what happened for processing to be effective. Your therapist will explain what each approach requires before you begin.",
      },
      {
        q: "How long does trauma therapy usually take?",
        a: "This varies widely depending on the nature and duration of the trauma. Some clients see meaningful shifts within a few months, while more complex trauma may take longer.",
      },
      {
        q: "Is EMDR safe to do online?",
        a: "Yes, EMDR can be adapted for secure video sessions and has been shown to be effective when delivered online.",
      },
      {
        q: "What is the difference between trauma and PTSD?",
        a: "Trauma refers to the response to a distressing event, while PTSD is a clinical diagnosis involving specific, persistent symptoms. You do not need a PTSD diagnosis to benefit from trauma-informed therapy.",
      },
      {
        q: "Can old, unresolved trauma from childhood still be treated as an adult?",
        a: "Yes. It is common to seek trauma therapy for events from years or even decades ago. The nervous system does not have an expiry date on healing, and approaches like EMDR and somatic therapy work regardless of how long ago the trauma occurred.",
      },
      {
        q: "Will I be diagnosed with PTSD before I can start trauma therapy?",
        a: "No formal diagnosis is required to begin. Many clients start trauma-informed therapy simply because a past experience continues to affect their daily life, relationships, or sense of safety.",
      },
    ],
  },
  {
    slug: "burnout-life-transitions",
    title: "Burnout & Life Transitions",
    shortTitle: "Burnout & Transitions",
    shortDesc:
      "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
    metaTitle:
      "Burnout Therapy & Life Transition Coaching in Nigeria | Mentel LTD",
    metaDescription:
      "Recover from burnout and navigate major life transitions with licensed Nigerian therapists. Values-based coaching and goal setting, delivered online.",
    keywords: [
      "burnout therapy Nigeria",
      "burnout recovery Lagos",
      "career transition coaching Nigeria",
      "life transition therapist",
      "burnout therapy",
      "burnout therapist",
      "burnout recovery",
      "work stress therapy",
      "burnout therapist Nigeria",
    ],
    icon: Flame,
    tags: ["Life Coaching", "Values Work", "Goal Setting"],
    intro:
      "Burnout rarely announces itself all at once. It builds up through months, sometimes years, of overwork, unclear boundaries, or misalignment between what you do and what actually matters to you. Whether you are exhausted from work, adjusting to a new role, relocating, or rebuilding your identity after a major life change, Mentel's therapists help you find your footing again and move forward with clarity.",
    symptoms: [
      "Chronic exhaustion that rest does not seem to fix",
      "Cynicism or detachment from work you used to care about",
      "Reduced sense of accomplishment or effectiveness",
      "Difficulty concentrating or making decisions",
      "Feeling stuck, directionless, or unsure who you are outside of a role or title",
      "Physical symptoms of stress, such as headaches or disrupted sleep",
    ],
    causesAndContext:
      "Burnout typically develops from a sustained mismatch between what a role demands and the resources, support, or boundaries available to meet those demands. Common contributors include chronic overwork, unclear job expectations, lack of recognition, insufficient rest, and a workplace culture that treats constant availability as normal, a pattern especially common across Nigeria's high-pressure corporate, healthcare, and entrepreneurial sectors. Life transitions, career changes, relocation, marriage, parenthood, retirement, or loss, can trigger a similar sense of depletion and disorientation, even when the change is welcomed, because identity and routine are disrupted at the same time. Perfectionism and difficulty setting boundaries often make both burnout and transitions harder to navigate, since the instinct is frequently to push through rather than pause and reassess. Recognising burnout early, before it turns into more serious physical or mental health consequences, is one of the most protective things you can do.",
    approaches: [
      {
        name: "Life & Career Coaching",
        desc: "Structured support to reassess priorities, set boundaries, and design a sustainable way forward.",
      },
      {
        name: "Values Clarification Work",
        desc: "Exercises to reconnect with what genuinely matters to you, so decisions come from clarity rather than exhaustion.",
      },
      {
        name: "Goal Setting",
        desc: "Practical, achievable steps toward the changes you want to make, whether in work, identity, or daily routine.",
      },
    ],
    whatToExpect:
      "Sessions start by mapping out where burnout or transition is showing up in your life and what has contributed to it. Your therapist helps you set realistic boundaries, reconnect with your values, and build a plan for the transition ahead, whether that means changing how you work, changing roles entirely, or adjusting to a new chapter of life.",
    faqs: [
      {
        q: "How is burnout different from regular stress?",
        a: "Burnout is a state of chronic exhaustion, cynicism, and reduced effectiveness that builds up over time, whereas everyday stress tends to be more situational and shorter-lived.",
      },
      {
        q: "Can therapy help if I am simply going through a life transition, not burnout?",
        a: "Yes. Many clients come to Mentel for support navigating a move, career change, new parenthood, or other transitions, without any diagnosis or crisis involved.",
      },
      {
        q: "How many sessions does burnout recovery typically take?",
        a: "Many clients begin to feel a shift in energy and clarity within six to eight sessions, though full recovery often depends on whether underlying work or life conditions also change.",
      },
      {
        q: "Is this therapy or coaching?",
        a: "It is a blend of both. Your therapist draws on clinical training as well as coaching techniques, so sessions are both emotionally supportive and practically oriented toward change.",
      },
      {
        q: "What are the warning signs of burnout I should not ignore?",
        a: "Watch for chronic exhaustion that does not improve with rest, growing cynicism toward work you used to enjoy, and a noticeable drop in your own sense of effectiveness. If these have lasted more than a few weeks, it is worth speaking with a therapist before symptoms worsen.",
      },
      {
        q: "Can burnout therapy help even if I cannot change my job right now?",
        a: "Yes. While changing a toxic work environment is sometimes part of the picture, much of burnout recovery focuses on boundaries, recovery habits, and mindset shifts you can make regardless of your current job situation.",
      },
    ],
  },
  {
    slug: "self-esteem-growth-therapy",
    title: "Self-Esteem & Personal Growth",
    shortTitle: "Self-Esteem & Growth",
    shortDesc:
      "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
    metaTitle: "Self-Esteem & Personal Growth Therapy in Nigeria | Mentel LTD",
    metaDescription:
      "Build genuine self-esteem and work through self-criticism with licensed Nigerian therapists using ACT and schema therapy. Confidential online sessions.",
    keywords: [
      "self-esteem therapy Nigeria",
      "confidence coaching Lagos",
      "personal growth therapist Nigeria",
      "ACT therapy Nigeria",
      "self-esteem therapist Nigeria",
      "confidence therapy Nigeria",
      "self-esteem therapy",
      "self-esteem therapist",
      "confidence therapy",
    ],
    icon: Sun,
    tags: ["Schema Therapy", "ACT", "Compassion Work"],
    intro:
      "Low self-esteem often shows up as a harsh inner voice, second-guessing decisions, or a persistent sense that you are not quite enough, no matter what you achieve. This work is about building a genuinely healthier relationship with yourself, not through empty affirmations, but by understanding where these patterns come from and building new ones that hold up under real life.",
    symptoms: [
      "A persistent inner critic or harsh self-talk",
      "Difficulty accepting compliments or acknowledging your own achievements",
      "People-pleasing or difficulty setting boundaries",
      "Comparing yourself unfavourably to others",
      "Fear of failure that holds you back from opportunities",
      "A sense of not knowing who you are outside of others' expectations",
    ],
    causesAndContext:
      "Low self-esteem is usually learned rather than innate. It often traces back to early experiences, critical or emotionally unavailable caregivers, conditional approval tied to achievement or behaviour, bullying, or repeated comparison to siblings or peers. Cultural and family pressure around academic or career success, common across many Nigerian households, can also reinforce a belief that worth must be earned rather than simply existing. Social comparison, amplified by social media, and perfectionism can keep self-esteem fragile well into adulthood, even for people who appear outwardly successful or confident. Self-esteem struggles frequently show up alongside anxiety, depression, or relationship difficulties, since how you see yourself shapes how you interpret feedback, conflict, and setbacks across every area of life. Therapy works by examining where these beliefs originated and building evidence-based, sustainable alternatives, rather than relying on surface-level positive thinking.",
    approaches: [
      {
        name: "Schema Therapy",
        desc: "Identifies the early life patterns behind persistent self-esteem struggles and works to shift them at the root.",
      },
      {
        name: "Acceptance and Commitment Therapy (ACT)",
        desc: "Helps you build psychological flexibility, so self-critical thoughts have less power over your choices.",
      },
      {
        name: "Compassion-Focused Work",
        desc: "Practical exercises to build genuine self-compassion, especially useful if self-criticism has become automatic.",
      },
    ],
    whatToExpect:
      "Your therapist will explore where your current self-view comes from, including early experiences, relationships, and recurring patterns of self-talk. From there, you will work together on practical exercises to challenge unhelpful beliefs and build a steadier, more compassionate relationship with yourself over time.",
    faqs: [
      {
        q: "Is low self-esteem the same as depression?",
        a: "Not necessarily. Low self-esteem can exist on its own or alongside depression or anxiety. Your therapist will help clarify what is happening for you specifically.",
      },
      {
        q: "Can therapy really change how I see myself?",
        a: "Yes, with consistent work. Self-esteem is shaped by patterns learned over years, and it can also be reshaped, though it typically takes sustained practice rather than a single session.",
      },
      {
        q: "How is this different from confidence coaching?",
        a: "Therapy addresses the underlying patterns and history behind self-esteem, while coaching tends to focus more narrowly on skills and performance. Our approach blends both.",
      },
      {
        q: "Who typically seeks self-esteem therapy?",
        a: "Clients range from young professionals navigating comparison and imposter feelings to individuals working through long-standing patterns from childhood or past relationships.",
      },
      {
        q: "What is imposter syndrome, and is it related to self-esteem?",
        a: "Imposter syndrome is the persistent feeling that your achievements are undeserved or that you will be exposed as a fraud, despite evidence of your competence. It is closely tied to self-esteem, and therapy addresses both the thought patterns and the underlying beliefs that drive it.",
      },
      {
        q: "Can low self-esteem affect my relationships and career?",
        a: "Yes. Low self-esteem often shows up as difficulty setting boundaries, over-apologising, avoiding opportunities out of fear of failure, or tolerating treatment you would not otherwise accept. Building healthier self-esteem tends to have ripple effects across relationships, work, and decision-making.",
      },
    ],
  },
  {
    slug: "adhd-therapy",
    title: "ADHD Support & Therapy",
    shortTitle: "ADHD Support",
    shortDesc:
      "Understand your attention, focus, and executive function, and build systems that actually work for how your brain operates.",
    metaTitle: "ADHD Therapy & Coaching in Nigeria | Mentel LTD",
    metaDescription:
      "Work with a licensed Nigerian therapist on ADHD, focus, and executive function challenges. Practical, non-judgmental online support. Book a free consultation.",
    keywords: [
      "ADHD therapy Nigeria",
      "adult ADHD support Lagos",
      "ADHD coaching Nigeria",
      "executive function therapist",
      "ADHD therapy",
      "adult ADHD therapy",
      "ADHD coaching",
      "executive function therapy",
      "adult ADHD support Nigeria",
    ],
    icon: Puzzle,
    tags: ["ADHD Coaching", "Executive Function", "CBT for ADHD"],
    intro:
      "Living with ADHD, whether diagnosed in childhood or only recognised in adulthood, often means fighting an ongoing battle with focus, time, and follow-through, even on things that genuinely matter to you. At Mentel, our therapists help you understand how your brain works, not against you, and build practical systems for attention, organisation, and emotional regulation that fit your actual life, without the shame that so often gets attached to ADHD.",
    symptoms: [
      "Difficulty sustaining focus, especially on tasks that are not immediately engaging",
      "Losing track of time, deadlines, or appointments",
      "Starting projects with enthusiasm but struggling to finish them",
      "Restlessness, impulsivity, or difficulty sitting through meetings or long conversations",
      "Feeling overwhelmed by everyday organisation, such as bills, emails, or chores",
      "A long history of being called lazy, careless, or disorganised, despite trying hard",
    ],
    causesAndContext:
      "ADHD is a neurodevelopmental difference in how the brain manages attention, impulse control, and executive function, it is not a character flaw, a lack of discipline, or a result of poor parenting. It has a strong genetic component, and many adults are only diagnosed after a child in their life is assessed and they recognise the same patterns in themselves. ADHD often looks different depending on gender and upbringing, girls and women, in particular, are frequently underdiagnosed because their symptoms tend to present as inattentiveness or anxiety rather than the hyperactivity more commonly associated with ADHD in boys. In Nigeria, limited public awareness and access to formal assessment mean many adults go undiagnosed for years, often internalising labels like lazy or careless long before anyone considers ADHD as an explanation. Stress, poor sleep, and unmanaged anxiety can also intensify ADHD symptoms, which is why treatment usually addresses the whole picture, not attention alone.",
    approaches: [
      {
        name: "ADHD Coaching",
        desc: "Practical, collaborative work to build routines, systems, and accountability structures suited to how your brain actually functions.",
      },
      {
        name: "CBT for ADHD",
        desc: "Adapted cognitive behavioural techniques that address the self-criticism and avoidance patterns that often build up around ADHD.",
      },
      {
        name: "Executive Function Strategies",
        desc: "Concrete tools for planning, prioritising, and time management, tailored to your specific challenges rather than generic productivity advice.",
      },
    ],
    whatToExpect:
      "Your first session focuses on understanding how ADHD shows up for you specifically, in work, relationships, and daily routines, and what has or has not worked before. From there, your therapist helps you build realistic systems and coping strategies, while also addressing the frustration or self-criticism that often builds up after years of feeling like you are working harder than everyone else for the same results.",
    faqs: [
      {
        q: "Do I need a formal ADHD diagnosis to start therapy?",
        a: "No. You can start working with a therapist on attention, focus, and organisation challenges without a formal diagnosis. Your therapist can also discuss the assessment and referral process if you want to pursue one.",
      },
      {
        q: "Can adults be diagnosed with ADHD, or is it just for children?",
        a: "ADHD is increasingly recognised in adults, many of whom were never diagnosed as children. It is common to first realise you have ADHD in your twenties, thirties, or later.",
      },
      {
        q: "Is ADHD therapy the same as medication management?",
        a: "No. Mentel's therapists focus on coaching, CBT, and executive function strategies. If medication is something you want to explore, your therapist can guide you on next steps for a medical referral.",
      },
      {
        q: "Will therapy help with procrastination and follow-through, not just focus?",
        a: "Yes. Much of ADHD-focused therapy centres on the gap between intention and action, building systems that reduce reliance on willpower alone.",
      },
      {
        q: "How is ADHD diagnosed in adults in Nigeria?",
        a: "A formal diagnosis typically involves an assessment with a psychiatrist or clinical psychologist. If you are unsure whether to pursue one, your Mentel therapist can talk through what a diagnosis might add for you and refer you to an assessment if you decide to go ahead.",
      },
      {
        q: "Can ADHD coaching help with time blindness and missed deadlines?",
        a: "Yes. Time blindness, the difficulty accurately sensing how much time has passed or is left, is one of the most common ADHD challenges our coaching addresses, using external structures and reminders that do not rely on internal time perception.",
      },
    ],
  },
  {
    slug: "grief-loss-counselling",
    title: "Grief & Loss Counselling",
    shortTitle: "Grief & Loss",
    shortDesc:
      "A compassionate space to process loss, whether recent or long-standing, at whatever pace feels right for you.",
    metaTitle: "Grief & Loss Counselling in Nigeria | Mentel LTD",
    metaDescription:
      "Compassionate grief counselling with licensed Nigerian therapists. Process loss, bereavement, or major life changes in confidential online sessions. Book a free consultation.",
    keywords: [
      "grief counselling Nigeria",
      "bereavement therapy Lagos",
      "grief therapist Nigeria",
      "loss counselling online",
      "grief therapy",
      "grief counselling",
      "bereavement counselling Nigeria",
      "coping with loss therapy",
    ],
    icon: Feather,
    tags: ["Grief Work", "Bereavement Support", "Meaning-Making"],
    intro:
      "Grief does not follow a schedule, and it rarely moves in a straight line. Whether you have lost a loved one, a relationship, a job, your health, or a version of the future you had planned for, grief counselling at Mentel offers a compassionate, unhurried space to feel what you feel without being told to move on before you are ready. Our therapists support you in carrying your loss in a way that allows you to keep living fully alongside it.",
    symptoms: [
      "Waves of sadness, anger, or numbness that come and go unpredictably",
      "Difficulty concentrating, sleeping, or functioning in daily life",
      "Guilt or regret connected to the loss, or to how it happened",
      "Avoiding reminders of the person or situation you lost",
      "Feeling isolated because others around you have moved on",
      "Grief that feels stuck, unchanging, or is intensifying rather than easing over time",
    ],
    causesAndContext:
      "Grief is most commonly associated with the death of a loved one, but it can also follow divorce or separation, job loss, infertility or pregnancy loss, immigration and leaving home behind, estrangement from family, or a serious health diagnosis, your own or someone else's. In many Nigerian communities, mourning periods and rituals are culturally significant, and the pressure to grieve a certain way, or to appear strong for others, can make it harder to process loss on your own terms. Grief can also become complicated when it involves an ambiguous loss, such as a strained or unresolved relationship, or when multiple losses occur close together and there has been little space to process any of them fully. There is no correct timeline for grief, and support can help whether the loss happened last week or many years ago.",
    approaches: [
      {
        name: "Grief-Focused Talk Therapy",
        desc: "A steady, supportive space to express what you are feeling without judgment, at whatever pace feels right for you.",
      },
      {
        name: "Meaning-Making Work",
        desc: "Helps you find ways to carry your loss forward, honouring what or who you lost while continuing to build a life.",
      },
      {
        name: "Support for Complicated Grief",
        desc: "Specialised approaches for grief that feels stuck, unusually intense, or tangled up with guilt, anger, or trauma.",
      },
    ],
    whatToExpect:
      "Your first session focuses on understanding your loss, its context, and how it has affected your daily life, relationships, and sense of self. There is no pressure to reach a particular stage of grief or move at a set pace. Your therapist will support you in processing what you are carrying and, over time, help you find ways to hold your loss alongside a full life.",
    faqs: [
      {
        q: "How soon after a loss should I start grief counselling?",
        a: "There is no set timeline. Some people seek support within days of a loss, others after months or years. Whenever you feel ready, or whenever grief starts interfering with daily life, is the right time to start.",
      },
      {
        q: "Is it normal for grief to resurface years later?",
        a: "Yes. Grief can resurface around anniversaries, milestones, or seemingly unrelated events, even long after a loss. This does not mean you have failed to heal, and therapy can help you understand and work through these waves.",
      },
      {
        q: "Can therapy help with types of loss other than death, like divorce or job loss?",
        a: "Yes. Grief counselling at Mentel supports any significant loss, including relationships, health, identity, or major life changes, not only bereavement.",
      },
      {
        q: "What is complicated grief, and how is it different from normal grief?",
        a: "Complicated grief involves prolonged, intense mourning that does not ease over time and significantly interferes with daily functioning. It often benefits from more structured therapeutic support than grief that is following a more typical course.",
      },
      {
        q: "Do I need to be religious or follow a specific mourning tradition to benefit from grief counselling?",
        a: "No. Mentel's grief counselling is respectful of your personal, cultural, or religious beliefs, and works alongside whatever traditions or practices are meaningful to you, rather than replacing them.",
      },
      {
        q: "Can I bring family members into grief counselling sessions?",
        a: "Individual sessions are the default, but your therapist can discuss options for family or group support if that would help you and the people grieving alongside you.",
      },
    ],
  },
  {
    slug: "anger-management-therapy",
    title: "Anger Management Therapy",
    shortTitle: "Anger Management",
    shortDesc:
      "Understand what is really driving your anger and build practical tools to respond rather than react.",
    metaTitle: "Anger Management Therapy in Nigeria | Mentel LTD",
    metaDescription:
      "Work with a licensed Nigerian therapist to understand and manage anger, irritability, and reactive outbursts. Confidential online sessions. Book a free consultation.",
    keywords: [
      "anger management therapy Nigeria",
      "anger management counselling Lagos",
      "anger management therapist Nigeria",
      "online anger management",
      "anger management therapy",
      "anger management counselling",
      "irritability therapy Nigeria",
    ],
    icon: AlertTriangle,
    tags: ["CBT", "Emotional Regulation", "Trigger Mapping"],
    intro:
      "Anger is often a signal, not the actual problem, pointing to unmet needs, old hurt, stress, or boundaries that have been crossed repeatedly. Anger management therapy at Mentel helps you understand what is really underneath your anger and build practical tools to notice it earlier, express it constructively, and stop it from damaging the relationships and situations that matter most to you.",
    symptoms: [
      "Frequent irritability or a short fuse, even over small things",
      "Outbursts you regret afterward, verbally or physically",
      "Difficulty calming down once you feel triggered",
      "Strained relationships with family, colleagues, or a partner because of your reactions",
      "Physical tension, a racing heart, or clenched jaw when frustrated",
      "Using anger to avoid feeling more vulnerable emotions, like hurt or fear",
    ],
    causesAndContext:
      "Anger is frequently a secondary emotion, sitting on top of something more vulnerable, such as hurt, fear, shame, or exhaustion, that feels safer to express as anger than to sit with directly. Common contributors include chronic stress, unresolved past conflict or trauma, growing up in a household where anger was modelled as the primary way to express frustration, and situational pressures like traffic, financial strain, or workplace conflict that build up over time. In Nigeria, cultural norms around expressing emotion, particularly for men, can also mean anger becomes one of the few socially acceptable outlets for a much wider range of underlying feelings. Left unaddressed, chronic anger can affect physical health, relationships, and career, which is why learning to recognise and respond to your own triggers early makes such a meaningful difference.",
    approaches: [
      {
        name: "Cognitive Behavioural Therapy (CBT)",
        desc: "Identifies the thought patterns and triggers that escalate anger, and builds more balanced, less reactive responses to them.",
      },
      {
        name: "Emotional Regulation Skills",
        desc: "Practical techniques to notice anger building and calm your body and mind before it reaches a boiling point.",
      },
      {
        name: "Trigger Mapping",
        desc: "Structured work to identify your specific patterns and early warning signs, so you can intervene earlier each time.",
      },
    ],
    whatToExpect:
      "Your therapist will start by mapping out where and how your anger tends to show up, what triggers it, and what has happened afterward. From there, you will build practical, personalised strategies for recognising anger early, managing it in the moment, and addressing the underlying emotions or stressors that fuel it, rather than only treating the outbursts themselves.",
    faqs: [
      {
        q: "Does needing anger management mean something is wrong with me?",
        a: "No. Anger is a normal human emotion, and struggling to manage it well is common, not a sign of a flawed character. Therapy focuses on building skills, not on judgment.",
      },
      {
        q: "Can anger management therapy help if my anger has affected my relationship or family?",
        a: "Yes. Many clients start anger management therapy specifically because their reactions have strained a relationship, and it is often paired with couples or family sessions where helpful.",
      },
      {
        q: "How long does anger management therapy usually take?",
        a: "Many clients notice improved awareness and control within six to eight sessions, though this depends on how long the pattern has been present and what is driving it.",
      },
      {
        q: "Is anger management only for people with 'explosive' outbursts?",
        a: "No. Anger can also show up as chronic irritability, passive-aggressiveness, or simmering resentment. Therapy is helpful for any pattern of anger that is affecting your life or relationships, not only visible outbursts.",
      },
      {
        q: "Will therapy tell me to just suppress my anger?",
        a: "No. Suppressing anger is not the goal, and it often makes things worse over time. The focus is on understanding and expressing anger in ways that do not harm you or the people around you.",
      },
      {
        q: "Can workplace anger or frustration be addressed in these sessions?",
        a: "Yes. Work-related stress and conflict are common contributors to anger, and your therapist can help you build strategies specific to professional situations, including managing conflict with colleagues or supervisors.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
