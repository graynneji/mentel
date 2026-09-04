// lib/sms/bestbulksms.ts
//
// Thin wrapper around the BestBulkSMS API so the rest of the app never
// touches the raw HTTP calls or the API key directly.
//
// Set BESTBULKSMS_API_KEY in your .env (never commit it, never put it in
// client-side code — this file only runs server-side). Since a key was
// shared in plain text at some point, regenerating it from the BestBulkSMS
// dashboard before going live is a good idea — treat any key that's ever
// appeared outside your own .env as potentially exposed.

const BASE_URL = "https://www.bestbulksms.com.ng";
const SOURCE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/admin/sms`
  : "https://www.trymentel.com/admin/sms";

function apiKey(): string {
  const key = process.env.BESTBULKSMS_API_KEY;
  if (!key) throw new Error("BESTBULKSMS_API_KEY is not set in .env");
  return key;
}

function headers() {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export interface SendSmsInput {
  to: string[] | string;
  message: string;
  senderId?: string;
  route?: "standard" | "corporate" | "sme" | string;
}

export interface SendSmsResult {
  success: boolean;
  smsMessageId?: number;
  segments?: number;
  unitsBilled?: number;
  costBilled?: number;
  invalidRecipients?: string[];
  error?: string;
}

export async function sendSms(input: SendSmsInput): Promise<SendSmsResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/sms/send`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        sender_id: input.senderId ?? "MENTEL",
        to: Array.isArray(input.to) ? input.to : [input.to],
        message: input.message,
        route: input.route ?? "standard",
        source_url: SOURCE_URL,
      }),
    });

    const data = await res.json();
    console.log("Send SMS response:", data);
    if (!res.ok || data.status !== "sent") {
      return {
        success: false,
        error: data.message || data.error || `Request failed (${res.status})`,
      };
    }

    return {
      success: true,
      smsMessageId: data.sms_message_id,
      segments: data.segments,
      unitsBilled: data.units_billed,
      costBilled: data.cost_billed,
      invalidRecipients: data.invalid_recipients ?? [],
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export interface BalanceResult {
  success: boolean;
  available?: number;
  ledger?: number;
  currency?: string;
  error?: string;
}

export async function checkBalance(): Promise<BalanceResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/balance.php`, {
      method: "GET",
      headers: headers(),
      cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok || data.status !== "sent") {
      return {
        success: false,
        error: data.message || `Request failed (${res.status})`,
      };
    }
    return {
      success: true,
      available: data?.balance,
      ledger: data?.ledger,
      currency: data?.currency,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export interface MessageStatusResult {
  success: boolean;
  status?: string;
  recipients?: number;
  segments?: number;
  totalCost?: number;
  createdAt?: string;
  error?: string;
}

export async function getMessageStatus(
  smsMessageId: number,
): Promise<MessageStatusResult> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/message-status.php?sms_message_id=${encodeURIComponent(smsMessageId)}`,
      {
        method: "GET",
        headers: headers(),
        cache: "no-store",
      },
    );
    const data = await res.json();
    if (!res.ok || data.status !== "sent") {
      return {
        success: false,
        error: data.message || `Request failed (${res.status})`,
      };
    }

    return {
      success: true,
      status: data.data?.message_status,
      recipients: data.data?.recipients,
      segments: data.data?.segments,
      totalCost: data.data?.total_cost,
      createdAt: data.data?.created_at,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
