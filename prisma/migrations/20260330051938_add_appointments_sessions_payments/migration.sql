-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "source" TEXT DEFAULT 'organic',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "therapist" TEXT;

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lead_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "duration_min" INTEGER NOT NULL DEFAULT 50,
    "therapist" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'initial',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lead_id" TEXT NOT NULL,
    "appointment_id" TEXT,
    "conducted_at" TIMESTAMP(3) NOT NULL,
    "therapist" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "duration_min" INTEGER NOT NULL DEFAULT 50,
    "notes" TEXT,
    "mood" INTEGER,
    "progress" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lead_id" TEXT NOT NULL,
    "session_id" TEXT,
    "amount_kobo" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "method" TEXT NOT NULL DEFAULT 'transfer',
    "reference" TEXT,
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointments_lead_id_idx" ON "appointments"("lead_id");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "appointments_scheduled_at_idx" ON "appointments"("scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_appointment_id_key" ON "sessions"("appointment_id");

-- CreateIndex
CREATE INDEX "sessions_lead_id_idx" ON "sessions"("lead_id");

-- CreateIndex
CREATE INDEX "sessions_conducted_at_idx" ON "sessions"("conducted_at");

-- CreateIndex
CREATE UNIQUE INDEX "payments_session_id_key" ON "payments"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");

-- CreateIndex
CREATE INDEX "payments_lead_id_idx" ON "payments"("lead_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_paid_at_idx" ON "payments"("paid_at");

-- CreateIndex
CREATE INDEX "leads_source_idx" ON "leads"("source");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
