// lib/seo/google-indexing.ts
//
// Minimal Google Indexing API client. Deliberately implemented with only
// Node's built-in `crypto` + `fetch` — no `googleapis`/`google-auth-library`
// dependency — so this drops into the project without an npm install.
//
// ── Setup (one-time, in Google Cloud Console) ────────────────────────────────
// 1. Create a project (or use an existing one) at console.cloud.google.com
// 2. Enable the "Web Search Indexing API"
// 3. Create a Service Account → generate a JSON key
// 4. In Google Search Console, add that service account's email as an
//    "Owner" of your trymentel.com property (Settings → Users and permissions)
// 5. Put these two values from the JSON key into your .env:
//      GOOGLE_INDEXING_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
//      GOOGLE_INDEXING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
//    (keep the \n escape sequences literal — they get unescaped below)
//
// ── Important honesty note ───────────────────────────────────────────────────
// Google's Indexing API is officially scoped to pages with JobPosting or
// BroadcastEvent structured data. Submitting ordinary article/marketing
// pages through it works for many sites in practice and is widely used that
// way, but Google doesn't guarantee it'll index non-job/broadcast content
// any faster than normal crawling — treat it as "a nudge", not a guarantee,
// and keep your XML sitemap + internal linking as the primary strategy.

import { createSign } from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const INDEXING_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const SCOPE = "https://www.googleapis.com/auth/indexing";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function isConfigured(): boolean {
  return !!(process.env.GOOGLE_INDEXING_CLIENT_EMAIL && process.env.GOOGLE_INDEXING_PRIVATE_KEY);
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (!isConfigured()) {
    throw new Error(
      "Google Indexing API isn't configured. Set GOOGLE_INDEXING_CLIENT_EMAIL and GOOGLE_INDEXING_PRIVATE_KEY in .env."
    );
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL!;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY!.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claimSet))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = base64url(signer.sign(privateKey));
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token exchange failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

export interface IndexingResult {
  url: string;
  success: boolean;
  error?: string;
}

/** Submit a single URL to Google for (re)crawling. type is URL_UPDATED unless the page was removed. */
export async function submitUrlForIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingResult> {
  try {
    const token = await getAccessToken();
    const res = await fetch(INDEXING_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, type }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { url, success: false, error: `${res.status}: ${body.slice(0, 300)}` };
    }
    return { url, success: true };
  } catch (err) {
    return { url, success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/** Submit many URLs, sequentially with a small delay — the API allows ~200/day per project by default. */
export async function submitUrlsForIndexing(urls: string[]): Promise<IndexingResult[]> {
  const results: IndexingResult[] = [];
  for (const url of urls) {
    results.push(await submitUrlForIndexing(url));
    await new Promise((r) => setTimeout(r, 250));
  }
  return results;
}

export { isConfigured as isGoogleIndexingConfigured };
