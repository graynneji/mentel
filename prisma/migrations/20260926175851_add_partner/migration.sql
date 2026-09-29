-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_revoked_at" TIMESTAMP(3),
    "webhook_url" TEXT,
    "webhook_secret" TEXT,
    "session_cap" INTEGER NOT NULL DEFAULT 6,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_beneficiaries" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "partner_id" TEXT NOT NULL,
    "external_ref" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_hash" TEXT,
    "phone" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "sessions_used" INTEGER NOT NULL DEFAULT 0,
    "risk_band" TEXT,
    "overall_score" INTEGER,
    "baseline_score" INTEGER,
    "baseline_assessment_id" TEXT,
    "last_assessment_at" TIMESTAMP(3),

    CONSTRAINT "partner_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_assessments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "beneficiary_id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "stress_score" INTEGER,
    "anxiety_score" INTEGER,
    "depression_score" INTEGER,
    "burnout_score" INTEGER,
    "sleep_score" INTEGER,
    "relationship_score" INTEGER,
    "self_esteem_score" INTEGER,
    "total_score" INTEGER NOT NULL,
    "risk_band" TEXT NOT NULL,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" JSONB DEFAULT '[]',

    CONSTRAINT "partner_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "partner_id" TEXT NOT NULL,
    "beneficiary_id" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "therapist" TEXT,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "modality" TEXT NOT NULL DEFAULT 'video',
    "status" TEXT NOT NULL DEFAULT 'logged',
    "cal_booking_uid" TEXT,
    "notes" TEXT,

    CONSTRAINT "partner_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_webhook_events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partner_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "response_status" INTEGER,
    "last_error" TEXT,

    CONSTRAINT "partner_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "partners_key_prefix_key" ON "partners"("key_prefix");

-- CreateIndex
CREATE INDEX "partners_status_idx" ON "partners"("status");

-- CreateIndex
CREATE INDEX "partners_key_prefix_idx" ON "partners"("key_prefix");

-- CreateIndex
CREATE INDEX "partner_beneficiaries_partner_id_idx" ON "partner_beneficiaries"("partner_id");

-- CreateIndex
CREATE INDEX "partner_beneficiaries_risk_band_idx" ON "partner_beneficiaries"("risk_band");

-- CreateIndex
CREATE INDEX "partner_beneficiaries_status_idx" ON "partner_beneficiaries"("status");

-- CreateIndex
CREATE UNIQUE INDEX "partner_beneficiaries_partner_id_external_ref_key" ON "partner_beneficiaries"("partner_id", "external_ref");

-- CreateIndex
CREATE INDEX "partner_assessments_beneficiary_id_idx" ON "partner_assessments"("beneficiary_id");

-- CreateIndex
CREATE INDEX "partner_assessments_risk_band_idx" ON "partner_assessments"("risk_band");

-- CreateIndex
CREATE INDEX "partner_assessments_created_at_idx" ON "partner_assessments"("created_at");

-- CreateIndex
CREATE INDEX "partner_sessions_partner_id_idx" ON "partner_sessions"("partner_id");

-- CreateIndex
CREATE INDEX "partner_sessions_beneficiary_id_idx" ON "partner_sessions"("beneficiary_id");

-- CreateIndex
CREATE INDEX "partner_sessions_status_idx" ON "partner_sessions"("status");

-- CreateIndex
CREATE INDEX "partner_webhook_events_partner_id_idx" ON "partner_webhook_events"("partner_id");

-- CreateIndex
CREATE INDEX "partner_webhook_events_status_idx" ON "partner_webhook_events"("status");

-- AddForeignKey
ALTER TABLE "partner_beneficiaries" ADD CONSTRAINT "partner_beneficiaries_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_assessments" ADD CONSTRAINT "partner_assessments_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "partner_beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_sessions" ADD CONSTRAINT "partner_sessions_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_sessions" ADD CONSTRAINT "partner_sessions_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "partner_beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_webhook_events" ADD CONSTRAINT "partner_webhook_events_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
