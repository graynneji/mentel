import {
  Brain,
  Heart,
  Users,
  Anchor,
  Flame,
  Sun,
  Puzzle,
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
      "stress management Lagos",
      "online anxiety counselling",
      "CBT therapist Nigeria",
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
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
