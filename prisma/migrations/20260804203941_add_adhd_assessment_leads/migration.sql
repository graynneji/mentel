-- CreateTable
CREATE TABLE "adhd_assessment_leads" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "answers" JSONB NOT NULL,
    "overall_percent" INTEGER NOT NULL,
    "overall_band" TEXT NOT NULL,
    "tx_ref" TEXT,
    "plan_key" TEXT,
    "amount_cents" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'lead',
    "paid_at" TIMESTAMP(3),
    "report_sent_at" TIMESTAMP(3),

    CONSTRAINT "adhd_assessment_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adhd_assessment_leads_tx_ref_key" ON "adhd_assessment_leads"("tx_ref");

-- CreateIndex
CREATE INDEX "adhd_assessment_leads_email_idx" ON "adhd_assessment_leads"("email");

-- CreateIndex
CREATE INDEX "adhd_assessment_leads_tx_ref_idx" ON "adhd_assessment_leads"("tx_ref");

-- CreateIndex
CREATE INDEX "adhd_assessment_leads_status_idx" ON "adhd_assessment_leads"("status");

-- CreateIndex
CREATE INDEX "adhd_assessment_leads_created_at_idx" ON "adhd_assessment_leads"("created_at");
