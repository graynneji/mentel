// app/api/admin/settings/route.ts
// Persists therapists + session types to DB via a simple key-value settings table.
// If you don't have a Settings model yet, add it to your schema (see comment below).
//
// Add to schema.prisma:
//
// model Setting {
//   key       String   @id
//   value     Json
//   updatedAt DateTime @updatedAt @map("updated_at")
//   @@map("settings")
// }
//
// Then run: npx prisma migrate dev --name add_settings

// app/api/admin/settings/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/browser";

// ── Types ──────────────────────────────────────────────────────────────────────
type Therapist = {
  id: string;
  name: string;
  title: string;
  email: string;
  color: string;
};

type SessionType = {
  id: string;
  name: string;
  durationMin: number;
  priceKobo: number;
};

type Practice = {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
};

type Notifications = {
  email: string;
  newLead: boolean;
  highSeverity: boolean;
  noShow: boolean;
  paymentPending: boolean;
};

type SettingsPayload = {
  therapists?: Therapist[];
  sessionTypes?: SessionType[];
  practice?: Practice;
  notifications?: Notifications;
};

// ── Defaults ───────────────────────────────────────────────────────────────────
const DEFAULT_THERAPISTS: Therapist[] = [
  {
    id: "1",
    name: "Yetunde",
    title: "Clinical Psychologist",
    email: "yetunde@trymentel.com",
    color: "#4e8c6a",
  },
];

const DEFAULT_SESSION_TYPES: SessionType[] = [
  { id: "1", name: "Initial Assessment", durationMin: 30, priceKobo: 0 },
  { id: "2", name: "Single Session", durationMin: 50, priceKobo: 1000000 },
  { id: "3", name: "Monthly Plan", durationMin: 200, priceKobo: 3500000 },
];

const DEFAULT_PRACTICE: Practice = {
  name: "Mentel - Mental Health",
  email: "contact@trymentel.com",
  phone: "+234 703 136 2034",
  address: "Lagos, Nigeria",
  currency: "NGN",
  timezone: "Africa/Lagos",
};

const DEFAULT_NOTIFICATIONS: Notifications = {
  email: "admin@trymentel.com",
  newLead: true,
  highSeverity: true,
  noShow: true,
  paymentPending: true,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    if (row) return row.value as T;
  } catch {
    // table may not exist yet
  }
  return fallback;
}

async function setSetting(key: string, value: Prisma.JsonValue): Promise<void> {
  try {
    const jsonValue = value === null ? Prisma.JsonNull : value;
    await db.setting.upsert({
      where: { key },
      update: {
        value: jsonValue,
      },
      create: { key, value: jsonValue },
    });
  } catch {
    // ignore if table not migrated yet
  }
}

// ── GET ────────────────────────────────────────────────────────────────────────
export async function GET(): Promise<NextResponse> {
  try {
    const [therapists, sessionTypes, practice, notifications] =
      await Promise.all([
        getSetting<Therapist[]>("therapists", DEFAULT_THERAPISTS),
        getSetting<SessionType[]>("sessionTypes", DEFAULT_SESSION_TYPES),
        getSetting<Practice>("practice", DEFAULT_PRACTICE),
        getSetting<Notifications>("notifications", DEFAULT_NOTIFICATIONS),
      ]);

    return NextResponse.json({
      success: true,
      therapists,
      sessionTypes,
      practice,
      notifications,
    });
  } catch (error) {
    console.error("GET settings error:", error);

    return NextResponse.json({
      success: true,
      therapists: DEFAULT_THERAPISTS,
      sessionTypes: DEFAULT_SESSION_TYPES,
      practice: DEFAULT_PRACTICE,
      notifications: DEFAULT_NOTIFICATIONS,
    });
  }
}

// ── POST ───────────────────────────────────────────────────────────────────────
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as SettingsPayload;

    const saves: Promise<void>[] = [];

    if (body.therapists !== undefined)
      saves.push(setSetting("therapists", body.therapists));

    if (body.sessionTypes !== undefined)
      saves.push(setSetting("sessionTypes", body.sessionTypes));

    if (body.practice !== undefined)
      saves.push(setSetting("practice", body.practice));

    if (body.notifications !== undefined)
      saves.push(setSetting("notifications", body.notifications));

    await Promise.all(saves);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST settings error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
