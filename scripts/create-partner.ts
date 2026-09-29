// scripts/create-partner.ts
//
// Provisions a new Partner and prints its API key ONCE (it is stored only
// as a bcrypt hash — this is the only time it will ever be shown). Run
// with: npx tsx scripts/create-partner.ts
//
// To rotate a key later, run this again with the same slug — it's a
// separate --rotate flow deliberately, not automatic, so a partner integration
// never breaks silently.

// import { db } from "@/lib/db";
import "dotenv/config";

import { db } from "../lib/db";
import { generateApiKey, hashApiKey } from "../lib/partner/auth";
// import { generateApiKey, hashApiKey } from "@/lib/partner/auth";
import readline from "readline";
import crypto from "crypto";

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

async function main() {
  const name = await ask('Partner name (e.g. "WellaHealth"): ');
  const slug = (await ask('Slug (e.g. "wellahealth"): ')).trim().toLowerCase();
  const contactName = await ask("Contact name: ");
  const contactEmail = await ask("Contact email: ");
  const sessionCapRaw = await ask(
    "Sessions included per beneficiary (e.g. 6): ",
  );
  const webhookUrl = await ask(
    "Crisis webhook URL (optional, press enter to skip): ",
  );

  const { fullKey, keyPrefix } = generateApiKey();
  const keyHash = await hashApiKey(fullKey);
  const webhookSecret = webhookUrl.trim()
    ? crypto.randomBytes(32).toString("hex")
    : null;

  const partner = await db.partner.create({
    data: {
      name: name.trim(),
      slug,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      sessionCap: Number(sessionCapRaw) || 6,
      keyPrefix,
      keyHash,
      webhookUrl: webhookUrl.trim() || null,
      webhookSecret,
    },
  });

  console.log("\n✅ Partner created:", partner.id);
  console.log("\n── Give the partner this (shown once, not recoverable) ──");
  console.log("API key:       ", fullKey);
  if (webhookSecret) {
    console.log(
      "Webhook secret:",
      webhookSecret,
      "(for verifying X-Mentel-Signature)",
    );
  }
  console.log("\nBase URL:       https://trymentel.com/api/partner/v1");
  console.log("Docs:           docs/partner-api/README.md\n");

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
