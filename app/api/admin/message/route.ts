// app/api/admin/message/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import type { Lead } from "@/generated/prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";
const BOOKING_URL = "https://trymentel.com/#book";

// ── Email builders ─────────────────────────────────────────────────────────────

function buildSeq1(
  name: string,
  band: string,
): { subject: string; html: string } {
  return {
    subject: `${name}, a thought on what you shared with us`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr><td align="center" style="padding-bottom:24px;">
    <a href="https://trymentel.com"><img src="https://trymentel.com/logo.png" alt="Mentel" width="110" style="display:block;border:0;"/></a>
  </td></tr>
  <tr><td style="background:#fff;border-radius:20px;padding:40px 36px;border:1px solid #ddeae2;">
    <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#1c3a3a;">Hi ${name},</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">
      We've been thinking about your ${band} results since you took the check-in.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">
      We know life is busy. And we know that "I'll deal with it later" can stretch into weeks without you even noticing.
      But here's what we've seen, the people who act early, even when things feel manageable,
      are the ones who look back and say it was the best decision they made.
    </p>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">Your first session is one conversation. That's it.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="${BOOKING_URL}" style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
        Book a session &rarr;
      </a>
    </td></tr></table>
    <p style="margin:24px 0 0;font-size:13px;color:#8da898;font-family:Georgia,serif;">Questions? Just reply to this email.</p>
  </td></tr>
  <tr><td style="padding:20px 0;text-align:center;">
    <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
      &copy; ${new Date().getFullYear()} Mentel &middot;
      <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy</a> &middot;
      <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`,
  };
}

function buildSeq2(name: string): { subject: string; html: string } {
  return {
    subject: `Checking in, ${name}`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr><td align="center" style="padding-bottom:24px;">
    <a href="https://trymentel.com"><img src="https://trymentel.com/logo.png" alt="Mentel" width="110" style="display:block;border:0;"/></a>
  </td></tr>
  <tr><td style="background:#fff;border-radius:20px;padding:40px 36px;border:1px solid #ddeae2;">
    <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#1c3a3a;">How have you been, ${name}?</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">
      It's been a few days since your wellness check-in. We just wanted to reach out, not to push anything,
      but because we genuinely care about what happens next for you.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-radius:14px;background:#edf7f1;border-left:3px solid #7ba98b;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0;font-size:14px;line-height:1.75;color:#2c3e35;font-style:italic;font-family:Georgia,serif;">
          "I kept telling myself I'd book when things calmed down. Things never calmed down.
          Booking the session was the thing that helped things calm down."
        </p>
        <p style="margin:8px 0 0;font-size:12px;color:#7ba98b;font-family:Georgia,serif;">— Mentel client, Lagos</p>
      </td></tr>
    </table>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">Whenever you're ready, we're here.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="${BOOKING_URL}" style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
        Book a session &rarr;
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:20px 0;text-align:center;">
    <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
      &copy; ${new Date().getFullYear()} Mentel &middot;
      <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy</a> &middot;
      <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`,
  };
}

function buildSeq3(name: string): { subject: string; html: string } {
  return {
    subject: `Last nudge, ${name} — the offer doesn't last forever`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr><td align="center" style="padding-bottom:24px;">
    <a href="https://trymentel.com"><img src="https://trymentel.com/logo.png" alt="Mentel" width="110" style="display:block;border:0;"/></a>
  </td></tr>
  <tr><td style="background:#fff;border-radius:20px;padding:40px 36px;border:1px solid #ddeae2;">
    <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#1c3a3a;">${name}, this is our last nudge.</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">
      We've sent a couple of emails now. We don't want to be that brand that never stops.
      So this is the last one, unless you reach out to us.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">
      The &#8358;10,000 introductory rate is a limited offer. It will go back to &#8358;35,000.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">
      50 minutes. A real therapist. A real conversation.
    </p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="${BOOKING_URL}" style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
        Book now &rarr;
      </a>
    </td></tr></table>
    <p style="margin:20px 0 0;font-size:13px;color:#8da898;font-family:Georgia,serif;">Take care of yourself, ${name}. That's all we want.</p>
  </td></tr>
  <tr><td style="padding:20px 0;text-align:center;">
    <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
      &copy; ${new Date().getFullYear()} Mentel &middot;
      <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy</a> &middot;
      <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`,
  };
}

function buildCustomHtml(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr><td align="center" style="padding-bottom:24px;">
    <a href="https://trymentel.com"><img src="https://trymentel.com/logo.png" alt="Mentel" width="110" style="display:block;border:0;"/></a>
  </td></tr>
  <tr><td style="background:#fff;border-radius:20px;padding:40px 36px;border:1px solid #ddeae2;">
    <div style="font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;white-space:pre-wrap;">${body
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</div>
    <p style="margin:28px 0 0;font-size:13px;color:#8da898;font-family:Georgia,serif;">— The Mentel Team</p>
  </td></tr>
  <tr><td style="padding:20px 0;text-align:center;">
    <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
      &copy; ${new Date().getFullYear()} Mentel &middot;
      <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy</a> &middot;
      <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

// ── POST /api/admin/message ────────────────────────────────────────────────────
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      leadId: string;
      type: "seq1" | "seq2" | "seq3" | "custom";
      customSubject?: string;
      customBody?: string;
    };

    const lead: Lead | null = await db.lead.findUnique({
      where: { id: body.leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 },
      );
    }

    let subject = "";
    let html = "";

    if (body.type === "seq1") {
      ({ subject, html } = buildSeq1(lead.name, lead.band));
    } else if (body.type === "seq2") {
      ({ subject, html } = buildSeq2(lead.name));
    } else if (body.type === "seq3") {
      ({ subject, html } = buildSeq3(lead.name));
    } else {
      if (!body.customSubject || !body.customBody) {
        return NextResponse.json(
          { success: false, error: "Subject and body required" },
          { status: 400 },
        );
      }
      subject = body.customSubject;
      html = buildCustomHtml(body.customBody);
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [lead.email],
      subject,
      html,
    });

    const seqTimestamp: Partial<{
      seq1SentAt: Date;
      seq2SentAt: Date;
      seq3SentAt: Date;
    }> =
      body.type === "seq1"
        ? { seq1SentAt: new Date() }
        : body.type === "seq2"
          ? { seq2SentAt: new Date() }
          : body.type === "seq3"
            ? { seq3SentAt: new Date() }
            : {};

    await db.$transaction([
      db.lead.update({
        where: { id: body.leadId },
        data: {
          ...seqTimestamp,
          status: lead.status === "new" ? "contacted" : lead.status,
        },
      }),
      db.message.create({
        data: {
          leadId: body.leadId,
          subject,
          body:
            body.type === "custom"
              ? (body.customBody ?? "")
              : `[${body.type} sequence]`,
          type: body.type,
          sentBy: "admin",
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// app/api/admin/messages/route.ts

// ── GET /api/admin/messages ────────────────────────────────────────────────────
// Returns all messages with optional filters.
// Query params: leadId, type (seq1|seq2|seq3|custom), sentBy, page, limit, from, to
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const type = searchParams.get("type");
    const sentBy = searchParams.get("sentBy");
    const from = searchParams.get("from"); // ISO date string
    const to = searchParams.get("to"); // ISO date string
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50")),
    );
    const skip = (page - 1) * limit;

    const where = {
      ...(leadId ? { leadId } : {}),
      ...(type ? { type } : {}),
      ...(sentBy ? { sentBy } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [messages, total] = await Promise.all([
      db.message.findMany({
        where,
        include: {
          lead: {
            select: {
              id: true,
              name: true,
              email: true,
              band: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.message.count({ where }),
    ]);

    // ── Aggregate stats ────────────────────────────────────────────────────────
    const [typeCounts, sentByCounts] = await Promise.all([
      db.message.groupBy({ by: ["type"], _count: { id: true } }),
      db.message.groupBy({ by: ["sentBy"], _count: { id: true } }),
    ]);

    // Messages sent per day for the last 14 days (simple approach)
    const now = new Date();
    const cutoff = new Date(now.getTime() - 14 * 86_400_000);
    const recentMessages = await db.message.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { createdAt: true },
    });

    const dailyCounts: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(now.getTime() - i * 86_400_000);
      const key = d.toISOString().slice(0, 10);
      dailyCounts[key] = 0;
    }
    for (const m of recentMessages) {
      const key = new Date(m.createdAt).toISOString().slice(0, 10);
      if (key in dailyCounts) dailyCounts[key]++;
    }

    const analytics = {
      total,
      page,
      pages: Math.ceil(total / limit),
      typeCounts: Object.fromEntries(
        typeCounts.map((r) => [r.type, r._count.id]),
      ),
      sentByCounts: Object.fromEntries(
        sentByCounts.map((r) => [r.sentBy, r._count.id]),
      ),
      // Ordered oldest→newest for charting
      dailySends: Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
    };

    return NextResponse.json({ success: true, messages, analytics });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/admin/messages — delete a single message log entry ─────────────
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      );
    }

    await db.message.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
