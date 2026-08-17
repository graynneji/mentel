// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const { name, email, message } = await req.json();

//     await resend.emails.send({
//       from: "Mentel Contact <hello@mail.trymentel.com>",
//       to: ["hello@mail.trymentel.com"], // your email
//       //   to: ["hello@trymentel.com"], // your email
//       subject: "New Contact Form Message",
//       html: `
//         <h2>New Contact Message</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     });

//     return NextResponse.json({ success: true });
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

// app/api/contact/route.ts
// POST: Save contact submission to DB with category, send email notification.
// GET:  Admin list — filterable by category, paginated. Requires admin cookie.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { withRateLimit } from "@/lib/withRateLimit";
import { sendFbConversionEvent } from "@/lib/fbConversion";

const resend = new Resend(process.env.RESEND_API_KEY);

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

// Valid categories for type safety
const VALID_CATEGORIES = [
  "general",
  "hmo_booking",
  "corporate_booking",
  "support",
  "partnership",
  "press",
  "payment_initiated",
  "other",
] as const;

type ContactCategory = (typeof VALID_CATEGORIES)[number];

const CATEGORY_LABELS: Record<ContactCategory, string> = {
  general: "General Enquiry",
  hmo_booking: "HMO / Insurance Booking",
  corporate_booking: "Corporate / EAP Booking",
  support: "Support Request",
  partnership: "Partnership",
  press: "Press / Media",
  payment_initiated: "Payment Initiated",
  other: "Other",
};

// ── POST: submit contact form ─────────────────────────────────────────────────

export async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;

  try {
    const body = await nextReq.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();
    const rawSource = String(body.source ?? "general").trim();
    // Extra fields for HMO/corporate
    const hmoProvider = String(body.hmoProvider ?? "").trim();
    const hmoPolicyNumber = String(body.hmoPolicyNumber ?? "").trim();
    const corporateCode = String(body.corporateCode ?? "").trim();

    // Normalise category
    const category: ContactCategory = VALID_CATEGORIES.includes(
      rawSource as ContactCategory,
    )
      ? (rawSource as ContactCategory)
      : "general";

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Please enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!message || message.length < 5)
      errors.message = "Please enter a message.";
    if (Object.keys(errors).length > 0)
      return NextResponse.json({ success: false, errors }, { status: 400 });

    // Build structured notes for special categories
    let structuredNotes = message;
    if (category === "hmo_booking" && (hmoProvider || hmoPolicyNumber)) {
      structuredNotes = `HMO Provider: ${hmoProvider || "Not provided"}\nPolicy Number: ${hmoPolicyNumber || "Not provided"}\n\n${message}`;
    } else if (category === "corporate_booking" && corporateCode) {
      structuredNotes = `Access Code: ${corporateCode}\n\n${message}`;
    }

    // Save to DB — reuse the Lead model's Message structure won't work since
    // contacts are not Leads. We store contacts in the Setting table as a
    // JSON log until a dedicated Contact model exists, OR we save to Lead
    // with source matching the category and status="contact".
    // Best approach: create a Lead record (name/email/phone/source) and a
    // linked Message, so the admin CRM already shows it.
    //
    // For contacts that aren't therapy leads (hmo, corporate, general),
    // we still need them tracked. We use Lead.source to distinguish:
    // "hmo_booking" | "corporate_booking" | "general_contact" | etc.
    // Score = 0 for non-assessment contacts.

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        score: 0,
        band: "Low",
        severity: "Low",
        answers: {},
        status: "new",
        source: category,
        notes: structuredNotes,
        tags: [category],
      },
    });

    const cookieHeader = nextReq.headers.get("cookie") ?? "";

    const getCookie = (name: string) =>
      cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];

    sendFbConversionEvent({
      eventName: "Lead",
      eventId: lead.id,
      email: lead.email,
      phone: lead.phone ?? undefined,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      clientIp: nextReq.headers.get("x-forwarded-for") ?? undefined,
      userAgent: nextReq.headers.get("user-agent") ?? undefined,
      eventSourceUrl: nextReq.headers.get("referer") ?? undefined,
    }).catch((err) => console.error("[FB CAPI] Booking Lead error:", err));

    // Save the message body as a linked Message record
    await db.message.create({
      data: {
        leadId: lead.id,
        subject: `Contact: ${CATEGORY_LABELS[category]}`,
        body: structuredNotes,
        type: "contact",
        sentBy: "client",
      },
    });

    // Send email notification (non-blocking, best-effort)
    const categoryLabel = CATEGORY_LABELS[category];
    resend.emails
      .send({
        from: "Mentel Contact <hello@mail.trymentel.com>",
        to: ["hello@trymentel.com"],
        replyTo: email,
        subject: `[${categoryLabel}] New message from ${name}`,
        html: `
          <h2 style="color:#1c3a3a">New ${categoryLabel}</h2>
          <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 0;color:#7a9088;width:140px"><strong>Name</strong></td><td>${name}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:6px 0;color:#7a9088"><strong>Phone</strong></td><td>${phone}</td></tr>` : ""}
            ${corporateCode ? `<tr><td style="padding:6px 0;color:#7a9088"><strong>Access Code</strong></td><td><code>${corporateCode}</code></td></tr>` : ""}
            ${hmoProvider ? `<tr><td style="padding:6px 0;color:#7a9088"><strong>HMO Provider</strong></td><td>${hmoProvider}</td></tr>` : ""}
            ${hmoPolicyNumber ? `<tr><td style="padding:6px 0;color:#7a9088"><strong>Policy #</strong></td><td>${hmoPolicyNumber}</td></tr>` : ""}
            <tr><td style="padding:6px 0;color:#7a9088"><strong>Category</strong></td><td>${categoryLabel}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top"><strong>Message</strong></td><td style="white-space:pre-wrap">${message}</td></tr>
          </table>
          <p style="color:#b0c8bc;font-size:12px;margin-top:24px">Submitted via trymentel.com · Lead ID: ${lead.id}</p>
        `,
      })
      .catch((err) => console.error("[Contact email error]", err));

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error("[Contact POST]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}

// ── GET: admin fetch contacts by category ──────────────────────────────────────

export async function GET_HANDLER(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(nextReq.url);
    const category = searchParams.get("category"); // e.g. "hmo_booking"
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50")),
    );
    const skip = (page - 1) * limit;

    // Contact sources — everything that's NOT a standard organic lead
    const contactSources = [
      "hmo_booking",
      "corporate_booking",
      "general",
      "general_contact",
      "support",
      "partnership",
      "press",
      "payment_initiated",
      "other",
    ];

    const where = {
      // Only show contact submissions (filter out organic assessment leads)
      source: category ? { equals: category } : { in: contactSources },
      ...(status && status !== "all" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
              { notes: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [contacts, total] = await Promise.all([
      db.lead.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    // Category counts for the filter tabs
    const categoryCounts = await db.lead.groupBy({
      by: ["source"],
      where: { source: { in: contactSources } },
      _count: { id: true },
    });

    return NextResponse.json({
      success: true,
      contacts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      categoryCounts: Object.fromEntries(
        categoryCounts.map((r) => [r.source, r._count.id]),
      ),
      categoryLabels: CATEGORY_LABELS,
    });
  } catch (err) {
    console.error("[Contact GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch contacts." },
      { status: 500 },
    );
  }
}
export const GET = withRateLimit(GET_HANDLER);
export const POST = withRateLimit(POST_HANDLER);
