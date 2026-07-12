-- CreateTable
CREATE TABLE "client_accounts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lead_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "client_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_login_tokens" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_account_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "client_login_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lead_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "total_sessions" INTEGER NOT NULL,
    "used_sessions" INTEGER NOT NULL DEFAULT 0,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "package_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "therapist" TEXT,
    "notes" TEXT,

    CONSTRAINT "scheduled_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_messages" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider_id" INTEGER,
    "sender_id" TEXT NOT NULL,
    "recipients" TEXT[],
    "message" TEXT NOT NULL,
    "route" TEXT NOT NULL DEFAULT 'standard',
    "segments" INTEGER,
    "units_billed" INTEGER,
    "cost_billed" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error_message" TEXT,

    CONSTRAINT "sms_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_accounts_lead_id_key" ON "client_accounts"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "client_accounts_email_key" ON "client_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_login_tokens_token_key" ON "client_login_tokens"("token");

-- CreateIndex
CREATE INDEX "client_login_tokens_token_idx" ON "client_login_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "packages_payment_id_key" ON "packages"("payment_id");

-- CreateIndex
CREATE INDEX "packages_lead_id_idx" ON "packages"("lead_id");

-- CreateIndex
CREATE INDEX "packages_status_idx" ON "packages"("status");

-- CreateIndex
CREATE INDEX "scheduled_sessions_package_id_idx" ON "scheduled_sessions"("package_id");

-- CreateIndex
CREATE INDEX "scheduled_sessions_scheduled_at_idx" ON "scheduled_sessions"("scheduled_at");

-- CreateIndex
CREATE INDEX "sms_messages_created_at_idx" ON "sms_messages"("created_at");

-- AddForeignKey
ALTER TABLE "client_accounts" ADD CONSTRAINT "client_accounts_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_sessions" ADD CONSTRAINT "scheduled_sessions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
