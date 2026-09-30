# Mentel Partner API — Integration Guide

**Status:** Live — enrolment, assessments, session-cap tracking, crisis
escalation, availability, and calendar-backed booking.

The Partner API lets an organisation (an insurer, HR platform, or
consortium like WellaHealth) enrol its own beneficiaries into Mentel's
mental health support programme, track their included counselling
sessions, and receive real-time alerts when someone needs urgent
attention — without exposing Mentel's internal admin systems.

## Base URL

```
https://trymentel.com/api/partner/v1
```

## Authentication

Every request must include your API key as a bearer token:

```
Authorization: Bearer mtl_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

Your key is issued once, out of band, when your partnership is set up —
it is never shown again and is not recoverable, only rotatable (contact
Mentel to rotate). Requests without a valid key return `401`.

## Rate limits

60 requests/minute per partner (sliding window). Exceeding it returns
`429` with an `error.code` of `rate_limited`.

## Health check

`GET /health` — unauthenticated, unrated. Use this in your own uptime
monitoring to tell "Mentel is down" apart from "our API key or network is
misconfigured" without spending a real request to find out.

```json
{ "status": "ok", "time": "2026-09-26T10:00:00.000Z" }
```

## Idempotency

`POST /sessions` accepts an optional `Idempotency-Key` header (any string,
max 200 chars — a UUID is fine). If your integration retries a request
(timeout, connection drop, a serverless function re-invoking), send the
**same key with the same body**: the original response is replayed and no
second session or calendar booking is created. Reusing a key with a
**different** body returns `422 idempotency_key_conflict`. We recommend
generating one key per session-booking attempt in your own system and
reusing it only for genuine retries of that same attempt.

```
Idempotency-Key: 8f14e45f-ceea-467e-9de5-5aecc432ce55
```

## Beneficiaries

A beneficiary is one person entitled to support under your programme,
identified by **your own ID** (`externalRef`) — Mentel never asks you to
adopt our internal IDs.

### Enrol a beneficiary

`POST /beneficiaries`

Idempotent: calling this again with the same `externalRef` updates the
stored contact details instead of erroring, so it's safe to call on every
sign-up sync.

```json
// Request
{
  "externalRef": "wh_20458",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+2348012345678",
  "anonymous": false
}
```

`anonymous: true` enrols the beneficiary without storing name, email, or
phone — useful if your programme allows anonymous access. `externalRef`
is still required (it's how you and Mentel refer to the same person).

```json
// Response — 201
{
  "success": true,
  "beneficiary": {
    "externalRef": "wh_20458",
    "status": "active",
    "anonymous": false,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+2348012345678",
    "sessionsUsed": 0,
    "sessionsRemaining": 6,
    "sessionCap": 6,
    "riskBand": null,
    "overallScore": null,
    "lastAssessmentAt": null,
    "enrolledAt": "2026-09-26T10:00:00.000Z"
  }
}
```

### Get a beneficiary

`GET /beneficiaries/{externalRef}`

Returns the same shape as above — use this to check session balance
before showing a beneficiary a "book a session" option in your own UI.

### List beneficiaries

`GET /beneficiaries?limit=25&cursor=<id>`

Cursor-paginated, newest first. Response includes `nextCursor` (`null`
when there are no more pages).

## How your users take the assessment and book (start here)

Your beneficiaries never need to see your API key, and you do not need to
build any clinical screens. There are two ways to integrate; most partners
should use the first.

### Option A (recommended): Mentel-hosted flow

The clinical assessment, scoring, crisis handling and session booking run
on a Mentel-hosted page. Your backend asks Mentel for a short-lived link
for one beneficiary, then sends the user there (redirect, new tab, or an
`<iframe>`).

1. Enrol the beneficiary: `POST /beneficiaries` (include `email` and `name`
   if you want them to be able to book a session; Mentel needs an email to
   create the calendar booking).
2. From your **server**, call `POST /beneficiaries/{externalRef}/session-link`
   with your API key. The response is `{ "url": "...", "expiresAt": "..." }`.
   Links expire after 30 minutes. Generate a fresh one each time the user
   taps "Start" or "Book a session" in your app.
3. Send the user to `url`. In a website use a redirect or
   `<iframe src="{url}" allow="clipboard-write">`; in a mobile app use an
   in-app browser or webview.
4. On the hosted page the user completes the assessment, sees their result
   and recommendations, and (if they have sessions remaining and an email on
   file) picks a time and books. If their answers indicate crisis risk, a
   `crisis.detected` webhook is sent to you and Mentel's clinical team is
   alerted at the same time.
5. Use `GET /beneficiaries/{externalRef}` and `GET /sessions?externalRef=...`
   any time to show status and session balance in your own UI, and the
   webhooks to react to events.

Never put your API key in a browser or mobile app. Only the link from step 2
is safe to hand to the end user.

### Option B: Your own screens, Mentel's API

If you want a fully native experience, fetch the question set with
`GET /assessment/questions`, render it in your UI, then submit
`{ "answers": { "<questionId>": <selected option value> } }` to
`POST /beneficiaries/{externalRef}/assessments`. For booking, call
`GET /availability` to show times and `POST /sessions` with `book: true`.
You are then responsible for presenting crisis messaging to the user when a
response returns `crisisEscalated: true`. Do not reword or reorder the
questions: they form a clinical instrument and scoring depends on the exact
items and values. Some questions only apply based on an earlier answer (see
`conditional` and `conditionalMin` on each question).

## Assessments

`POST /beneficiaries/{externalRef}/assessments`

Submit a mental health assessment for scoring. Uses the same clinical
scoring engine as Mentel's own platform.

```json
// Request
{
  "answers": { "q1": 3, "q2": 1, "q3": 4 },
  "relationshipStatus": "married",
  "hasChildren": true
}
```

`relationshipStatus` and `hasChildren` are optional context fields.
Fetch the current question set from `GET /assessment/questions` (see
Option B above). The set is clinical content and can be updated by Mentel;
re-fetch it rather than hardcoding it.

```json
// Response — 200
{
  "success": true,
  "assessmentId": "clx...",
  "scores": {
    "totalScore": 62,
    "riskBand": "High",
    "flags": ["crisis"],
    "stressScore": 70,
    "anxietyScore": 65
    // ...other domain scores
  },
  "recommendations": [
    { "type": "therapy", "title": "Individual therapy", "description": "..." }
  ],
  "improvementPct": 0,
  "isFirstAssessment": true,
  "crisisEscalated": true
}
```

`crisisEscalated: true` means a `crisis.detected` webhook was fired (see
below) **and** Mentel's own clinical on-call was alerted independently.
Escalation never depends solely on your webhook endpoint being reachable.

`GET /beneficiaries/{externalRef}/assessments` returns that beneficiary's
assessment history, newest first.

## Availability

`GET /availability?start=2026-10-01&end=2026-10-08&timeZone=Africa/Lagos`

Open therapist slots for the counselling-session event type. `start`/`end`
accept an ISO date or datetime. Use this to show real times in your own
booking UI before calling `POST /sessions` with `book: true`.

```json
// Response — 200
{ "success": true, "slots": { "2026-10-02": [{ "time": "14:00:00" }] } }
```


## Assessment questions

`GET /assessment/questions`

Returns `domains` and `questions` (`id`, `domain`, `text`, `subtext`,
`options[{value,label}]`, `conditional`, `conditionalMin`). A question with
`conditional` should only be shown if the answer to the question with that
id is at least `conditionalMin`.

## Hosted session link

`POST /beneficiaries/{externalRef}/session-link`

```json
// Response — 200
{ "success": true, "url": "https://trymentel.com/partner-session/<token>", "expiresAt": "2026-10-01T10:30:00.000Z" }
```

## Sessions

Every session consumes one of a beneficiary's included sessions against
your contracted cap. There are two ways to create one:

**Booked by Mentel** (`book: true`) — actually reserves the calendar slot.
Requires a non-anonymous beneficiary with an email on file (Cal.com needs
someone to book the meeting for).

**Logged only** (omit `book`, or `book: false`) — you arranged the session
yourself (your own scheduling flow, or an anonymous beneficiary Mentel
can't put a name/email to); this just tells Mentel it happened so the cap
stays accurate.

### Create a session

`POST /sessions`

```json
// Request — books a real slot
{
  "externalRef": "wh_20458",
  "book": true,
  "slotStart": "2026-10-02T14:00:00.000Z",
  "type": "individual",
  "notes": "optional"
}
```

```json
// Request — log-only, arranged elsewhere
{
  "externalRef": "wh_20458",
  "scheduledAt": "2026-10-02T14:00:00.000Z",
  "type": "individual",
  "modality": "video",
  "therapist": "Dr. Amaka O.",
  "notes": "optional"
}
```

`type`: `individual` | `couples` | `group` | `coaching` | `crisis`
`modality`: `video` | `phone` | `in-person` (ignored when `book: true` —
the event type's own modality applies)

```json
// Response — 201
{
  "success": true,
  "session": {
    "id": "clz...",
    "externalRef": "wh_20458",
    "scheduledAt": "2026-10-02T14:00:00.000Z",
    "status": "scheduled",
    "booked": true
  },
  "sessionsUsed": 1,
  "sessionsRemaining": 5
}
```

Errors: `409 session_cap_reached` if no sessions remain; `400
cannot_book_anonymous` if `book: true` was used for a beneficiary with no
email; `502 booking_failed` if the requested slot is no longer available.
Check `sessionsRemaining` from the beneficiary endpoint before offering
booking in your own UI to avoid the cap error in the common case. See
[Idempotency](#idempotency) above — recommended on this endpoint
specifically, since a retried booking call could otherwise double-book.

### List a beneficiary's sessions

`GET /sessions?externalRef=wh_20458`

### Update a session

`PATCH /sessions/{id}`

```json
{ "status": "completed" }
```

`status`: `scheduled` | `completed` | `cancelled` | `no-show`. Cancelling
refunds the session back to the beneficiary's cap, fires a
`session.cancelled` webhook, and — if the session was booked (`book: true`
at creation) — cancels the actual calendar event too.

## Webhooks

If you provide a webhook URL when your partnership is set up, Mentel
pushes these events to it:

| Event | Fired when |
|---|---|
| `crisis.detected` | An assessment flags crisis risk or suicidal ideation |
| `session.cancelled` | A session is cancelled via `PATCH /sessions/{id}` |

### Payload

```json
{
  "id": "clw...",
  "type": "crisis.detected",
  "createdAt": "2026-09-26T10:05:00.000Z",
  "data": {
    "externalRef": "wh_20458",
    "name": "Jane Doe",
    "riskBand": "Critical",
    "flags": ["crisis", "suicidal_ideation"],
    "assessmentId": "clx...",
    "occurredAt": "2026-09-26T10:05:00.000Z"
  }
}
```

### Verifying signatures

Every webhook request carries:

```
X-Mentel-Event: crisis.detected
X-Mentel-Signature: sha256=<hex>
```

The signature is an HMAC-SHA256 of the **raw request body**, using the
webhook secret issued alongside your API key.

```js
const crypto = require("crypto");

function isValidMentelSignature(rawBody, signatureHeader, secret) {
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
}
```

Respond `2xx` within 10 seconds to acknowledge receipt. Undelivered
events are retried on a backoff schedule for up to 6 attempts before
being left for manual follow-up — but treat `crisis.detected` delivery
as best-effort, not your only safety net: your own crisis pathway should
never depend exclusively on this webhook arriving.

## Errors

All errors share one shape:

```json
{ "error": { "code": "beneficiary_not_found", "message": "..." } }
```

| Status | Code | Meaning |
|---|---|---|
| 400 | `invalid_json`, `missing_external_ref`, `missing_answers`, `invalid_type`, `invalid_modality`, `invalid_status` | Malformed request |
| 401 | `missing_api_key`, `invalid_api_key` | Auth failed |
| 403 | `partner_suspended` | Your account isn't active — contact Mentel |
| 404 | `beneficiary_not_found`, `session_not_found` | No matching record |
| 409 | `session_cap_reached` | Beneficiary has no sessions left |
| 429 | `rate_limited` | Too many requests |

## Partner Portal (for your staff, not your API)

Separate from the API entirely: a login at `/partner-portal/login` where a
partner's own staff (not beneficiaries) can see enrolled beneficiaries,
session usage, and webhook delivery status, and self-service their webhook
URL and API key, without writing any code. Mentel invites the first login
per partner (see your admin's Partners page); the partner can change their
password after that. This has its own session cookie and is unrelated to
both the API key and the beneficiary hosted-session token above.

## What this doesn't cover

Pricing, minimum commitments, and volume rates are a commercial
conversation, not part of this API — they're set per partner when the
contract is agreed (that's also where `sessionCap` for the partnership
comes from). This document is the technical half of your reply to a
partner's integration questions; the pricing/packages half is a separate
answer.
