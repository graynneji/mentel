
// app/articles/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Leaf, Share2 } from "lucide-react";
import { articles } from "../page";
import { scorePageSEO } from "@/lib/seo-scoring-engine";
import { ArticleCover, getCategoryStyle } from "../../../components/ArticleVisuals";
import { ArticleCard } from "../../../components/ArticleCard";

/* ─── Full article bodies ─── */
const articleContent: Record<string, {
    intro: string;
    sections: {
        heading: string;
        body: string;
        list?: { label?: string; value: string }[];
    }[];
    tldr: string;
    faq: { q: string; a: string }[];
}> = {
    "mental-health-services-lagos": {
        tldr: "Lagos has government hospitals (free–₦5,000), private clinics (₦15,000–₦40,000), and online platforms like Mentel (from ₦5,500). HMOs increasingly cover mental health. For crises, call LASEMA on 767 or 112.",
        faq: [
            { q: "What is the cheapest mental health option in Lagos?", a: "Government hospitals like Federal Neuropsychiatric Hospital Yaba offer sessions from ₦2,000–₦5,000. Online platforms like Mentel start from ₦5,500 with no transport cost." },
            { q: "Does my HMO cover therapy in Lagos?", a: "Hygeia, Reliance HMO, and Leadway Health all include mental health sessions in some corporate plans — typically 2–6 sessions per year. Check your policy or speak to HR." },
            { q: "What number do I call for a mental health crisis in Lagos?", a: "Call LASEMA on 767 or 112 for immediate emergencies. Mentel can also arrange same-day or next-day sessions for urgent but non-emergency needs." },
        ],
        intro:
            "Lagos is Nigeria's most populous city and one of the most stressful places on earth to live. Yet access to quality mental health care has historically been fragmented, expensive, and hard to navigate. That is changing. Here is a practical, up-to-date map of what is actually available.",
        sections: [
            {
                heading: "Public / Government Facilities",
                body: "The Federal Neuropsychiatric Hospital Yaba (popularly called Yaba Left) is the oldest and largest psychiatric hospital in West Africa. It offers outpatient consultations, inpatient care, and a Child and Adolescent Unit. Lagos State also runs psychiatric units at LASUTH (Lagos State University Teaching Hospital) in Ikeja and LUTH (Lagos University Teaching Hospital) in Idi-Araba. Government facilities are significantly cheaper but can involve long wait times and limited appointment slots.",
            },
            {
                heading: "Private Clinics and Therapy Centres",
                body: "Several private practices have grown over the last decade, particularly on Lagos Island and in Victoria Island, Ikoyi, and Lekki. These typically charge ₦15,000–₦40,000 per session and offer more flexibility in scheduling. Notable options include the Centre for Human Wellbeing and a growing number of solo-practitioner psychologists who are RAPCON or NAPS licensed.",
            },
            {
                heading: "Online Therapy Platforms",
                body: "Online mental health platforms have emerged as the most accessible option for most Lagosians. Platforms like Mentel connect clients with vetted, licensed therapists via secure video calls, starting from ₦5,500 per session. This eliminates transport costs, traffic, and the stigma of walking into a clinic. Sessions can be scheduled around work hours, including evenings and weekends.",
            },
            {
                heading: "HMO and Employer Coverage",
                body: "An increasing number of HMOs, including Hygeia, Reliance HMO, and Leadway Health, are beginning to include mental health consultations in their packages, particularly for corporate clients. Check your policy documents or speak to your HR team to find out what is covered. Many plans cover 2–6 sessions per year.",
            },
            {
                heading: "Crisis and Emergency Support",
                body: "If you or someone you know is in immediate crisis, the Lagos State Emergency Management Agency (LASEMA) can be reached at 767 or 112. The Mentally Aware Nigeria Initiative (MANI) also provides crisis support lines. For non-emergency but urgent support, most online platforms like Mentel can arrange a same-day or next-day session.",
            },
        ],
    },

    "online-therapy-nigeria-how-it-works": {
        tldr: "Online therapy is one-on-one sessions with a licensed therapist over secure video call. Book, get matched within 24 hours, attend from wherever you are. Research confirms it works as well as in-person therapy.",
        faq: [
            { q: "Is online therapy safe and confidential in Nigeria?", a: "Yes. Reputable platforms use encrypted video calls and are bound by professional confidentiality codes. Your sessions are not shared with anyone without your consent." },
            { q: "How quickly can I get matched with a therapist on Mentel?", a: "Mentel typically provides a match within 24 hours of completing the intake form." },
            { q: "What issues can online therapy help with?", a: "Online therapy is effective for anxiety, depression, trauma, burnout, relationship difficulties, grief, stress, and more. Your match is tailored to your specific needs." },
        ],
        intro:
            "A few years ago, seeing a therapist in Nigeria meant navigating unreliable transport, stigma from neighbours who might recognise you walking into a clinic, and session fees that felt out of reach. Online therapy has quietly changed all three of those barriers. Here is exactly how it works.",
        sections: [
            {
                heading: "What 'online therapy' actually means",
                body: "Online therapy (also called teletherapy or e-therapy) involves real, one-on-one sessions with a licensed therapist, conducted over a secure video call instead of in-person. The session is exactly the same: 50 minutes, fully confidential, professionally conducted. The only difference is you're on your phone, laptop, or tablet from wherever you feel comfortable.",
            },
            {
                heading: "Step 1: Book and get matched",
                body: "You complete a short intake form describing what you're dealing with: anxiety, low mood, a relationship problem, burnout, etc. The platform uses this to match you with a therapist whose training and specialisation fit your needs. On Mentel, you receive a match within 24 hours.",
            },
            {
                heading: "Step 2: Your first session",
                body: "The first session is primarily about you telling your story. Your therapist will ask open questions to understand your history, what's brought you to therapy, and what you hope to get out of it. You are not expected to have answers or be 'fixed' at the end. Many people feel relieved just to have been heard honestly.",
            },
            {
                heading: "Step 3: Ongoing sessions",
                body: "Most people find a rhythm of weekly or fortnightly sessions. Your therapist will use evidence-based approaches (CBT, EMDR, psychodynamic therapy, etc.) tailored to your goals. Progress is typically gradual but measurable: many clients report significant improvement in 6–12 sessions.",
            },
            {
                heading: "Is it as effective as in-person therapy?",
                body: "Yes. A growing body of research, including multiple large randomised controlled trials, has found that online therapy produces outcomes equivalent to in-person therapy for anxiety, depression, PTSD, and relationship problems. Some clients actually find it easier to open up when they're in a familiar, private space.",
            },
        ],
    },

    "anxiety-signs-nigerians-ignore": {
        tldr: "Seven commonly missed anxiety signs: physical tension, insomnia, social avoidance, irritability, decision paralysis, chest tightness (often mistaken for heart problems), and chronic 'what if' thinking. All are treatable.",
        faq: [
            { q: "Can anxiety cause physical symptoms?", a: "Yes. Anxiety frequently causes jaw tension, headaches, chest tightness, a churning stomach, and a racing heart. These physical symptoms are your nervous system in a prolonged threat response." },
            { q: "Is anxiety common in Nigeria?", a: "Yes. Anxiety disorders are among the most common mental health conditions worldwide, including in Nigeria. Cultural pressures to 'be strong' or 'pray about it' mean many cases go unrecognised and untreated." },
            { q: "How is anxiety treated?", a: "Anxiety responds well to Cognitive Behavioural Therapy (CBT), which has the strongest evidence base. In some cases, medication may also be recommended by a psychiatrist." },
        ],
        intro:
            "In Nigeria, anxiety is frequently dismissed as weakness, lack of faith, or overthinking. As a result, millions of people are living with an anxiety disorder that is undiagnosed and untreated. Here are the signs that are most commonly missed or explained away.",
        sections: [
            { heading: " Constant physical tension", body: "Anxiety is as physical as it is mental. Jaw clenching, tight shoulders, a churning stomach, frequent headaches: these are not just stress. They are your nervous system in a prolonged state of threat response. Many Nigerians treat these symptoms medically without ever addressing their psychological root." },
            { heading: " Difficulty sleeping even when exhausted", body: "Racing thoughts at night that prevent sleep, despite being physically tired, is one of the most reliable signs of an anxiety disorder. If you regularly lie awake running through worst-case scenarios, it is worth speaking to a mental health professional." },
            { heading: " Avoiding social situations", body: "If you consistently make excuses to avoid gatherings, struggle intensely with public speaking or social interaction, or feel physically sick before social events, this goes beyond introversion. Social anxiety is a treatable condition." },
            { heading: " Irritability and short temper", body: "Anxiety does not always look like worry. Sometimes it presents as a hair-trigger temper, low frustration tolerance, or feeling constantly on edge. If the people closest to you comment on your irritability, anxiety could be the cause." },
            { heading: " Overthinking decisions", body: "Spending hours or days agonising over simple decisions is a hallmark of anxiety. This is not being 'careful'; it is the brain getting stuck in threat-assessment loops that never resolve." },
            { heading: " Chest tightness or racing heart", body: "Panic attacks and anxiety can mimic cardiac symptoms so closely that many people end up in hospital emergency rooms having heart checks that come back normal. If you've been cleared medically but still experience these symptoms, consider an anxiety assessment." },
            { heading: " Chronic 'what if' thinking", body: "Anxiety hijacks your thoughts with an endless stream of worst-case scenarios. \"What if I lose my job?\" \"What if something happens to my children?\" These thoughts feel productive but are actually a form of rumination that maintains and worsens anxiety." },
        ],
    },

    "depression-nigeria-men-silent-struggle": {
        tldr: "Depression in Nigerian men often shows as anger, withdrawal, reckless behaviour, or physical complaints — not classic sadness. It is a medical condition, not weakness, and responds well to therapy and sometimes medication.",
        faq: [
            { q: "How does depression show up differently in Nigerian men?", a: "Men often present with anger, irritability, reckless behaviour, heavy drinking, social withdrawal, and physical complaints rather than visible sadness. These are frequently missed as signs of depression." },
            { q: "Does therapy work for men?", a: "Yes. Goal-focused approaches like Behavioural Activation and CBT are particularly effective for men. Many men find the structured nature of therapy more accessible than they expected." },
            { q: "Is depression a sign of weakness?", a: "No. Depression involves measurable changes in brain chemistry and is a recognised medical condition. It does not respond to willpower alone and is not a character flaw." },
        ],
        intro:
            "Nigeria loses men to suicide every year: men who told no one they were struggling, because to admit it felt impossible. Depression in men is a public health crisis that is almost entirely hidden. This guide is for men who are struggling, and for the people who love them.",
        sections: [
            { heading: "Why men in Nigeria don't talk", body: "The messages men receive from childhood are consistent: be strong, provide, don't cry, handle it. Admitting emotional pain is framed as weakness. In a culture where a man's worth is heavily tied to productivity and stoicism, depression can feel like a shameful failure rather than an illness." },
            { heading: "How depression looks different in men", body: "Men often do not present with classical 'sadness'. Instead, male depression commonly shows up as anger and irritability, reckless behaviour (drinking, speeding, overworking), withdrawal from family and friends, physical complaints (back pain, fatigue, headaches), and loss of interest in things that previously brought joy." },
            { heading: "The role of substance use", body: "Alcohol and cannabis use often mask underlying depression in Nigerian men. The temporary relief they provide makes them appealing, but both, particularly alcohol, worsen depressive symptoms over time. If you find yourself drinking to manage how you feel, that is a signal worth paying attention to." },
            { heading: "Depression is a medical condition", body: "Depression is not a character flaw. It involves measurable changes in brain chemistry, specifically in how neurotransmitters like serotonin, dopamine, and norepinephrine function. It responds well to treatment: therapy, medication, or both. No amount of willpower, prayer alone, or 'manning up' will resolve a clinical depressive episode." },
            { heading: "What treatment looks like", body: "Therapy for depression in men often works best when it is practical and goal-focused. Behavioural Activation, which gently increases meaningful activity, is highly effective. CBT helps identify and challenge the thought patterns that perpetuate low mood. Many men find the structure of therapy more accessible than they expected." },
        ],
    },

    "cost-therapy-nigeria-affordable-options": {
        tldr: "Therapy in Nigeria ranges from ₦2,000 (government hospitals) to ₦50,000 (premium private). Online platforms like Mentel start at ₦5,500. HMOs and sliding-scale fees can reduce costs further. A free assessment is available on Mentel.",
        faq: [
            { q: "What is the cheapest therapy option in Nigeria?", a: "Government hospitals charge ₦2,000–₦5,000. University counselling services are often free for students. Mentel starts at ₦5,500 per session online." },
            { q: "Can I use my HMO to pay for therapy in Nigeria?", a: "Yes, if your plan includes it. Hygeia, Reliance HMO, Avon, and Leadway Health all have plans that cover psychological consultations. Check your policy or HR department." },
            { q: "What is a sliding scale fee for therapy?", a: "Sliding scale pricing means the therapist adjusts their fee based on your income. It is not always advertised, but it is appropriate to ask. Most ethical therapists prefer to see you at a reduced rate than not at all." },
        ],
        intro:
            "\"Therapy is for the rich.\" This is one of the most persistent and damaging myths in Nigerian mental healthcare. Yes, some therapists charge ₦30,000–₦50,000 per session. But that is nowhere near the full picture. Here is a clear-eyed breakdown of what therapy actually costs and how to make it work on your budget.",
        sections: [
            {
                heading: "The real range of costs",
                body: "Most people have more options than they realise.",
                list: [
                    { label: "Government hospitals", value: "₦2,000 – ₦5,000 per session" },
                    { label: "University counselling", value: "Often free for students" },
                    { label: "Online platforms (Mentel)", value: "₦5,500 per session" },
                    { label: "Mid-range private therapists", value: "₦10,000 – ₦20,000" },
                    { label: "Premium private (Lagos Island, Ikoyi, VI)", value: "₦25,000 – ₦50,000" },
                ],
            },
            { heading: "HMO coverage: check before you pay out of pocket", body: "If you have health insurance through your employer, check whether mental health sessions are covered. Hygeia, Reliance HMO, Leadway Health, and Avon HMO all have plans that include psychological consultations. Some plans cover up to 6 sessions per year at little or no additional cost to you." },
            { heading: "Sliding scale fees", body: "Many licensed therapists in Nigeria offer sliding-scale pricing, where the fee is adjusted based on your income. This is not widely advertised, but if you are struggling financially, it is entirely appropriate to ask. Most ethical therapists would rather see you at a reduced rate than not see you at all." },
            { heading: "The cost of NOT getting help", body: "Untreated anxiety and depression reduce workplace productivity, damage relationships, worsen physical health, and in severe cases contribute to premature death. The ₦5,500 you spend on a therapy session could prevent thousands of naira in lost income, medical costs, or the far greater cost of a relationship or career falling apart." },
            { heading: "Starting with a free assessment", body: "If you are unsure whether you need therapy and do not want to spend money before knowing, start with a free mental health assessment. Mentel's 2-minute check-in is free, confidential, and gives you a clear picture of what kind of support might help." },
        ],
    },

    "couples-therapy-nigeria-when-to-go": {
        tldr: "Consider couples therapy when the same argument repeats, communication breaks down, trust is broken, you're co-existing without connecting, or a major life event has destabilised the relationship. You don't have to be in crisis to benefit.",
        faq: [
            { q: "Does couples therapy work?", a: "Yes. Research consistently shows couples therapy improves communication, reduces conflict, and helps partners reconnect. The earlier it begins, the better the outcomes tend to be." },
            { q: "Can couples therapy save a marriage on the verge of divorce?", a: "In many cases, yes. Many couples who believed they were heading for divorce found their way back through structured therapeutic support. It is rarely too late to try." },
            { q: "Is couples therapy available online in Nigeria?", a: "Yes. Mentel offers couples therapy via secure video call, accessible from anywhere in Nigeria. Sessions can be scheduled in the evenings or weekends to accommodate work hours." },
        ],
        intro:
            "All couples argue. All relationships go through difficult seasons. But some patterns, if left unaddressed, will erode even the strongest marriage. Here are eight honest signals that couples therapy could genuinely help.",
        sections: [
            { heading: " The same argument keeps repeating", body: "If you are having the same fight over and over, about money, family, intimacy, or trust, without resolution, it is rarely about the surface topic. Skilled couples therapy identifies the underlying emotional need driving the pattern and helps both partners respond to it." },
            { heading: " Communication has broken down", body: "When conversations consistently escalate into shouting, shut down into silence, or never happen at all, the communication system has broken down. A therapist can teach you the specific skills to talk about hard things without it becoming a fight." },
            { heading: " Infidelity or breach of trust", body: "An affair or any significant betrayal is not automatically the end of a marriage. But trust cannot be rebuilt without a structured process. Couples therapy provides a safe, mediated space where both partners can process the pain and, if both choose it, rebuild." },
            { heading: " You're co-existing but not connecting", body: "Living as roommates rather than partners, with minimal conversation, no physical intimacy, and separate emotional lives, is a form of relationship distress that is easy to ignore and hard to reverse alone." },
            { heading: " A major life event has destabilised the relationship", body: "Job loss, the death of a parent, a new baby, relocation, a health diagnosis: major transitions change the dynamic of a relationship. Therapy can help couples navigate the change as a team rather than being pulled apart by it." },
            { heading: " One or both partners is considering leaving", body: "If you or your spouse has seriously considered ending the marriage, therapy is not too late, but it shouldn't be delayed. Many couples who thought they were heading for divorce have found their way back to each other through therapeutic support." },
            { heading: " You're using children as go-betweens", body: "When children become messengers, allies, or emotional support for one parent, it damages both the marriage and the children. This is a significant indicator that professional help is needed urgently." },
            { heading: " You simply want a stronger relationship", body: "You do not have to be in crisis to benefit from couples therapy. Many couples use therapy proactively to deepen connection, improve communication, and build the foundations of a genuinely fulfilling partnership." },
        ],
    },

    "burnout-vs-stress-difference": {
        tldr: "Stress = too much demand, you're still engaged. Burnout = too little meaning/recovery, rest alone doesn't fix it. Burnout has three stages and physical symptoms. Therapy (especially ACT) helps rebuild your relationship with work.",
        faq: [
            { q: "What are the three stages of burnout?", a: "Stage 1: enthusiasm gives way to exhaustion. Stage 2: exhaustion gives way to cynicism and detachment. Stage 3: ineffectiveness — you stop caring about quality and feel hopeless about change." },
            { q: "Can you recover from burnout without therapy?", a: "Mild burnout may respond to extended rest and lifestyle changes. Moderate to severe burnout typically requires therapy — particularly ACT or values-based work — to address the patterns that caused it." },
            { q: "How is burnout different from depression?", a: "Burnout is primarily work-context-specific and often resolves when the work situation changes. Depression is more pervasive, affecting all areas of life. The two can co-occur and a therapist can help distinguish and treat both." },
        ],
        intro:
            "Nigeria runs on hustle culture. Working hard is a virtue. Being 'busy' is a badge of honour. Against this backdrop, recognising burnout and distinguishing it from ordinary stress is both difficult and essential. Here is how to tell the difference.",
        sections: [
            { heading: "What stress actually is", body: "Stress is the result of too much: too many demands, too little time, too many responsibilities. The key characteristic of stress is that you still care about the outcome. You are overwhelmed, but you are still engaged. Rest, a completed project, or a holiday can often restore a stressed person." },
            { heading: "What burnout actually is", body: "Burnout is the result of too little: too little meaning, too little agency, too little recovery. The World Health Organisation classifies it as an occupational phenomenon characterised by emotional exhaustion, depersonalisation (feeling detached or cynical about your work), and a reduced sense of accomplishment. The defining feature: rest does not fix it." },
            { heading: "The three stages of burnout", body: "Stage 1: Enthusiasm gives way to exhaustion. Stage 2: Exhaustion gives way to cynicism and detachment. Stage 3: Ineffectiveness: you stop caring about the quality of your work and feel hopeless about change. Many people only seek help at Stage 3, when recovery is significantly harder." },
            { heading: "Physical symptoms that signal burnout", body: "Persistent fatigue that doesn't improve with sleep, frequent illness (burnout suppresses immune function), chronic pain with no clear medical cause, brain fog and difficulty concentrating: these physical symptoms are the body's way of forcing a stop." },
            { heading: "How therapy helps", body: "Burnout recovery is not just about rest. It often requires examining the values, people-pleasing patterns, and workplace dynamics that led to burnout in the first place. Therapy, particularly ACT (Acceptance and Commitment Therapy) and values-based work, helps people rebuild their relationship with work and life on their own terms." },
        ],
    },

    "trauma-ptsd-nigeria-understanding": {
        tldr: "Trauma is a normal response to an abnormal experience. PTSD comes from a single event; Complex PTSD from repeated trauma. EMDR is the WHO-endorsed gold standard treatment. Nigerian context matters — find a culturally informed therapist.",
        faq: [
            { q: "What is the best treatment for PTSD?", a: "EMDR (Eye Movement Desensitisation and Reprocessing) has the strongest evidence base and is endorsed by the WHO. Trauma-Focused CBT, Somatic Experiencing, and Narrative Exposure Therapy are also highly effective." },
            { q: "What is the difference between PTSD and Complex PTSD?", a: "PTSD develops after a single traumatic event. Complex PTSD (C-PTSD) develops after prolonged, repeated trauma — particularly in childhood. C-PTSD also involves emotional dysregulation, negative self-perception, and relational difficulties." },
            { q: "Is trauma common in Nigeria?", a: "Yes. Road accidents, childhood adversity, communal violence, economic instability, and bereavement are all common sources of trauma in Nigeria. The prevalence is significantly underreported due to stigma." },
        ],
        intro:
            "We live in a country shaped by trauma. Road accidents. Childhood experiences. Communal violence. Economic precarity. Bereavement. These events leave marks on the nervous system, on relationships, on how we see the world. Understanding trauma is the first step toward healing it.",
        sections: [
            { heading: "What trauma is (and what it isn't)", body: "Trauma is not just what happens to you; it is what happens inside you as a result of what happened. An event becomes traumatic when it overwhelms your nervous system's ability to process and integrate it. This is not weakness; it is a normal response to an abnormal experience. Not everyone who experiences the same event develops trauma, which is why social support, prior history, and individual neurology all play a role." },
            { heading: "How trauma affects the brain", body: "During a traumatic event, the amygdala (the brain's threat-detection system) floods the body with stress hormones. The hippocampus, responsible for filing memories with a time stamp, can be temporarily overwhelmed, which is why traumatic memories often feel as though they are happening now, rather than in the past. This is the neurological basis of flashbacks and hypervigilance." },
            { heading: "PTSD vs complex PTSD", body: "PTSD typically develops after a single traumatic event. Complex PTSD (C-PTSD) develops after prolonged, repeated trauma, particularly during childhood. C-PTSD involves additional symptoms including emotional dysregulation, negative self-perception, and difficulty in relationships. Both are treatable." },
            { heading: "Evidence-based treatments", body: "EMDR (Eye Movement Desensitisation and Reprocessing) has the strongest evidence base for PTSD and is endorsed by the WHO. It works by processing traumatic memories bilaterally, gradually reducing their emotional charge. Trauma-Focused CBT, Somatic Experiencing, and Narrative Exposure Therapy are also highly effective. What does not work: being told to 'get over it' or simply talking through the details of the trauma without a structured therapeutic framework." },
            { heading: "A note on cultural and collective trauma", body: "Nigeria carries significant collective trauma: from Biafra, from decades of insecurity, from the ongoing realities of poverty and inequality. Individual healing exists alongside this broader context. Therapists who understand the Nigerian experience are better equipped to hold this complexity without dismissing or over-pathologising it." },
        ],
    },

    "mental-health-abuja-resources": {
        tldr: "Abuja options include National Hospital Abuja (government), private practices in Wuse 2 and Maitama (₦15,000–₦35,000), online platforms like Mentel (₦5,500), and corporate EAP programmes for large organisations.",
        faq: [
            { q: "Where can I find a therapist in Abuja?", a: "The National Hospital Abuja has a psychiatry department. Private practices operate in Wuse 2, Maitama, and Garki. Online platforms like Mentel serve all FCT districts with evening and weekend availability." },
            { q: "Is there a mental health crisis line in Abuja?", a: "MANI (Mentally Aware Nigeria Initiative) runs awareness events and peer support in Abuja. For emergencies, use the National Emergency number 112." },
            { q: "Does my employer in Abuja cover therapy?", a: "Many large Abuja-based organisations in oil and gas, banking, and the diplomatic community offer EAP programmes that include mental health sessions. Check with HR before paying out of pocket." },
        ],
        intro:
            "As Nigeria's capital and a city with one of the country's highest concentrations of educated professionals, Abuja has a growing, though still insufficient, ecosystem of mental health resources. Here is a practical directory.",
        sections: [
            { heading: "Government and Teaching Hospitals", body: "The National Hospital Abuja has a psychiatry department that offers outpatient consultations and inpatient care. The University of Abuja Teaching Hospital (UATH) in Gwagwalada also has psychiatric services. For residents in Maitama, Asokoro, and Wuse, the National Hospital is the most accessible government option." },
            { heading: "Private Practices in Abuja", body: "Several private psychologists and counsellors operate in Abuja, particularly in Wuse 2, Maitama, and Garki. Fees typically range from ₦15,000–₦35,000 per session. The Nigerian Association of Clinical Psychologists (NACP) maintains a directory of licensed practitioners." },
            { heading: "Online Therapy (Available Nationwide)", body: "Platforms like Mentel serve clients across Nigeria including all FCT districts. Online therapy is particularly practical for Abuja residents who work in government or corporate settings where work hours can be unpredictable. Evening and weekend slots are available." },
            { heading: "Corporate EAP Programmes", body: "Many large Abuja-based organisations, particularly in oil and gas, banking, and the diplomatic community, offer Employee Assistance Programmes (EAPs) that include mental health sessions. If you work in a large organisation, check with HR before paying out of pocket." },
            { heading: "Support Groups and Community Resources", body: "The Mentally Aware Nigeria Initiative (MANI) runs awareness events and peer support networks in Abuja. Depression Alliance Nigeria is another community-based resource. For faith-based support, some churches and mosques in the FCT have trained counsellors on staff." },
        ],
    },

    "how-to-find-right-therapist-nigeria": {
        tldr: "Check credentials (AHPCN, NACP, or APROCON registration), match their specialisation to your issue, ask good questions in session 1, watch for red flags, and don't hesitate to rematch. The right fit matters more than the first booking.",
        faq: [
            { q: "What qualifications should a therapist in Nigeria have?", a: "They should hold a degree in clinical or counselling psychology, psychiatry, or a related field, and be registered with AHPCN, NACP, APROCON, or the Nursing and Midwifery Council (for psychiatric nurses)." },
            { q: "What questions should I ask a therapist in the first session?", a: "Ask about their therapeutic approach, experience with your presenting issue, how they handle confidentiality, and what happens if you feel you're not a good fit. You are interviewing them as much as they are getting to know you." },
            { q: "What are red flags to watch for in a therapist?", a: "Red flags include: pushing religious or political views, maintaining dual relationships (therapist + friend or business contact), promising specific outcomes, or making you feel judged. Trust your instincts." },
        ],
        intro:
            "Finding a therapist is not the same as finding any service provider. The relationship itself, the sense of safety, trust, and being genuinely understood, is a significant part of what makes therapy work. Here is how to find the right match.",
        sections: [
            { heading: "Check credentials first", body: "In Nigeria, licensed therapists should hold a degree in clinical psychology, counselling psychology, or psychiatry from a recognised institution. They should be registered with a professional body: the Registrar of the Allied Health Professions Council of Nigeria (AHPCN), the Nigerian Association of Clinical Psychologists (NACP), the Association of Professional Counsellors of Nigeria (APROCON), or the Nursing and Midwifery Council (for psychiatric nurses). Always ask about qualifications: a good therapist will welcome the question." },
            { heading: "Match the therapist to your issue", body: "Not every therapist is trained in every area. A therapist specialising in trauma may not be the best fit for couples work. Someone who primarily works with adolescents may not be the right person for executive burnout. Be specific about what you're dealing with, and choose someone whose training and experience matches." },
            { heading: "Questions to ask in a first session", body: "What is your therapeutic approach? How long do you typically work with clients presenting with what I'm describing? How do you handle confidentiality? What happens if I feel we're not a good fit? You are interviewing them as much as they are getting to know you." },
            { heading: "Red flags to watch for", body: "A good therapist will never: push their personal religious or political views onto you; maintain dual relationships (being both your therapist and your friend or business contact); promise specific outcomes; or make you feel judged for what you share. Trust your instincts: if something feels wrong, it probably is." },
            { heading: "What to do if the fit isn't right", body: "It is entirely normal to work with two or three therapists before finding the right match. It does not mean therapy doesn't work; it means you haven't found your person yet. Reputable platforms like Mentel offer a free rematch guarantee, because the right fit matters more than a quick booking." },
        ],
    },
};

export async function generateStaticParams() {
    return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const param = await params;
    const article = articles.find((a) => a.slug === param.slug);
    if (!article) return {};

    return {
        title: `${article.title} - Mentel`,
        description: article.excerpt,
        keywords: article.keywords?.join(", "),
        alternates: {
            canonical: `/articles/${article.slug}`,
        },
        openGraph: {
            title: `${article.title} - Mentel`,
            description: article.excerpt,
            url: `https://www.trymentel.com/articles/${article.slug}`,
            type: "article",
            publishedTime: article.date,
            authors: ["Mentel Clinical Team"],
            tags: article.tags,
            images: [
                {
                    url: article.image,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${article.title} - Mentel`,
            description: article.excerpt,
            images: [article.image],
        },
    };
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const param = await params;
    const article = articles.find((a) => a.slug === param.slug);
    if (!article) notFound();

    const content = articleContent[article.slug];
    const articleIndex = articles.findIndex((a) => a.slug === param.slug);
    const prev = articles[articleIndex - 1] ?? null;
    const next = articles[articleIndex + 1] ?? null;

    // Related: same category, excluding current article, max 3
    const related = articles
        .filter((a) => a.slug !== article.slug && a.category === article.category)
        .slice(0, 3);

    const style = getCategoryStyle(article.category);

    /* ...articleSchema, seoScore, faqSchema unchanged... */

    return (
        <>
            {/* JSON-LD scripts unchanged */}

            <div className="relative overflow-x-hidden">
                {/* Back nav */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--teal)]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <ArrowLeft size={14} />
                        All Articles
                    </Link>
                </div>

                <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-20">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                                style={{ background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)" }}
                            >
                                <Leaf size={9} />
                                {article.category}
                            </span>
                        </div>

                        <h1
                            className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-5"
                            style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                        >
                            {article.title}
                        </h1>

                        <p className="text-base sm:text-lg font-normal leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                            {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    M
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>
                                        Mentel Clinical Team
                                    </p>
                                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                                        <span>
                                            {new Date(article.date).toLocaleDateString("en-NG", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={11} />
                                            {article.readMin} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                            >
                                <Share2 size={12} />
                                Share
                            </button>
                        </div>
                    </header>

                    {/* ── Hero cover image ── */}
                    <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] rounded-2xl overflow-hidden mb-10">
                        <ArticleCover image={article.image} category={article.category} title={article.title} iconSize={160} />
                    </div>

                    {/* TL;DR box */}
                    {content?.tldr && (
                        <div
                            className="mb-10 rounded-xl p-5 border"
                            style={{
                                background: "rgba(123,169,139,0.06)",
                                border: "1px solid rgba(123,169,139,0.2)",
                                borderLeft: "4px solid var(--sage)",
                            }}
                        >
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--sage-dark)" }}>
                                TL;DR — Key takeaways
                            </p>
                            <p className="text-sm leading-relaxed font-normal" style={{ color: "var(--text)" }}>
                                {content.tldr}
                            </p>

                        </div>
                    )}

                    {content && content.sections.length >= 5 && (
                        <nav className="mb-10 rounded-xl p-5 border" style={{ borderColor: "var(--border)", background: "white" }} aria-label="Table of contents">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>
                                In this article
                            </p>
                            <ol className="space-y-2">
                                {content.sections.map((section, i) => (
                                    <li key={i}>
                                        <Link
                                            href={`#section-${i}`}
                                            className="text-sm hover:text-[var(--teal)] transition-colors"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            {i + 1}. {section.heading}
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}

                    {/* Article body — unchanged */}
                    {content && (
                        <div className="prose-mentel">
                            <p
                                className="text-base sm:text-lg leading-relaxed font-normal mb-10"
                                style={{ color: "var(--text)", lineHeight: "1.85" }}
                            >
                                {content.intro}
                            </p>
                            <div className="space-y-10">
                                {content.sections.map((section, i) => (
                                    <section key={i} id={`section-${i}`}>
                                        <h2
                                            className={`font-cormorant  font-semibold mb-3 scroll-mt-24 ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}
                                            style={{ color: "var(--deep)" }}
                                        >
                                            {section.heading}
                                        </h2>
                                        <p
                                            className="text-sm sm:text-base leading-relaxed font-normal"
                                            style={{ color: "var(--text)", lineHeight: "1.85" }}
                                        >
                                            {section.body}
                                        </p>
                                        {section.list && (
                                            <ul className="mt-4 space-y-2">
                                                {section.list.map((item, j) => (
                                                    <li key={j} className="flex gap-3 text-sm sm:text-base" style={{ color: "var(--text)" }}>
                                                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--sage)" }} />
                                                        <span>
                                                            {item.label && <strong style={{ color: "var(--deep)" }}>{item.label}: </strong>}
                                                            {item.value}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags — unchanged */}
                    <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2.5 py-1 rounded-full border"
                                style={{ borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* FAQ — unchanged */}
                    {content?.faq && content.faq.length > 0 && (
                        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>
                                Quick answers
                            </p>
                            <h2 className="font-cormorant text-2xl sm:text-3xl font-normal mb-6" style={{ color: "var(--deep)" }}>
                                Frequently asked questions
                            </h2>
                            <div className="space-y-4">
                                {content.faq.map(({ q, a }) => (
                                    <div key={q} className="rounded-xl p-5 border" style={{ borderColor: "var(--border)", background: "white" }}>
                                        <p className="text-sm font-semibold mb-2" style={{ color: "var(--deep)" }}>{q}</p>
                                        <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA box — unchanged */}
                    <div
                        className="mt-12 rounded-2xl p-6 sm:p-8"
                        style={{ background: "rgba(123,169,139,0.06)", border: "1px solid rgba(123,169,139,0.2)", borderLeft: "4px solid var(--sage)" }}
                    >
                        <p className="font-cormorant text-xl sm:text-2xl font-normal mb-2" style={{ color: "var(--deep)" }}>
                            Ready to take the first step?
                        </p>
                        <p className="text-sm font-normal mb-5" style={{ color: "var(--text-muted)" }}>
                            Book a session with a licensed therapist from ₦5,500. No commitment. Fully confidential.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/book"
                                className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full"
                                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                            >
                                Book a Session
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/assessment"
                                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border"
                                style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
                            >
                                Free Assessment
                            </Link>
                        </div>
                    </div>

                    {/* ── Related articles ── */}
                    {related.length > 0 && (
                        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                            <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: style.accent }}>
                                More on {article.category}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {related.map((a) => (
                                    <ArticleCard key={a.slug} article={a} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prev / Next — unchanged */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                        {prev ? (
                            <Link href={`/articles/${prev.slug}`} className="group rounded-2xl p-5 border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200" style={{ background: "white", borderColor: "var(--border)" }}>
                                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>← Previous</p>
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--deep)" }}>{prev.title}</p>
                            </Link>
                        ) : <div />}
                        {next && (
                            <Link href={`/articles/${next.slug}`} className="group rounded-2xl p-5 border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 text-right sm:col-start-2" style={{ background: "white", borderColor: "var(--border)" }}>
                                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Next →</p>
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--deep)" }}>{next.title}</p>
                            </Link>
                        )}
                    </div>
                </article>
            </div>
        </>
    );
}