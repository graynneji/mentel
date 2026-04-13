-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "industry" TEXT,
    "size_range" TEXT,
    "country" TEXT NOT NULL DEFAULT 'NG',
    "contact_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "hr_email" TEXT NOT NULL,
    "hr_password_hash" TEXT NOT NULL,
    "access_code" TEXT NOT NULL,
    "last_login" TIMESTAMP(3),
    "plan" TEXT NOT NULL DEFAULT 'starter',
    "plan_seats" INTEGER NOT NULL DEFAULT 50,
    "session_cap" INTEGER NOT NULL DEFAULT 6,
    "plan_start_at" TIMESTAMP(3),
    "plan_renew_at" TIMESTAMP(3),
    "billing_status" TEXT NOT NULL DEFAULT 'active',
    "allow_anonymous" BOOLEAN NOT NULL DEFAULT true,
    "focus_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "custom_domains" JSONB,
    "status" TEXT NOT NULL DEFAULT 'trial',

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_employees" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_hash" TEXT,
    "department" TEXT,
    "job_title" TEXT,
    "employee_ref" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "risk_band" TEXT,
    "overall_score" INTEGER,
    "last_assessment_at" TIMESTAMP(3),
    "improvement_pct" DOUBLE PRECISION,
    "sessions_used" INTEGER NOT NULL DEFAULT 0,
    "sessions_remaining" INTEGER,

    CONSTRAINT "company_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eap_assessments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employee_id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "stress_score" INTEGER,
    "anxiety_score" INTEGER,
    "depression_score" INTEGER,
    "burnout_score" INTEGER,
    "sleep_score" INTEGER,
    "relationship_score" INTEGER,
    "self_esteem_score" INTEGER,
    "substance_score" INTEGER,
    "total_score" INTEGER NOT NULL,
    "risk_band" TEXT NOT NULL,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relationship_status" TEXT,
    "has_children" BOOLEAN,
    "recommendations" JSONB DEFAULT '[]',
    "therapist_notes" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "eap_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eap_sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "conducted_at" TIMESTAMP(3),
    "duration_min" INTEGER NOT NULL DEFAULT 50,
    "therapist" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "modality" TEXT NOT NULL DEFAULT 'video',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "mood_pre" INTEGER,
    "mood_post" INTEGER,
    "progress_notes" TEXT,
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "eap_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "companies_hr_email_key" ON "companies"("hr_email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_access_code_key" ON "companies"("access_code");

-- CreateIndex
CREATE INDEX "companies_status_idx" ON "companies"("status");

-- CreateIndex
CREATE INDEX "companies_hr_email_idx" ON "companies"("hr_email");

-- CreateIndex
CREATE INDEX "companies_access_code_idx" ON "companies"("access_code");

-- CreateIndex
CREATE INDEX "company_employees_company_id_idx" ON "company_employees"("company_id");

-- CreateIndex
CREATE INDEX "company_employees_email_hash_idx" ON "company_employees"("email_hash");

-- CreateIndex
CREATE INDEX "company_employees_risk_band_idx" ON "company_employees"("risk_band");

-- CreateIndex
CREATE INDEX "company_employees_status_idx" ON "company_employees"("status");

-- CreateIndex
CREATE INDEX "eap_assessments_employee_id_idx" ON "eap_assessments"("employee_id");

-- CreateIndex
CREATE INDEX "eap_assessments_created_at_idx" ON "eap_assessments"("created_at");

-- CreateIndex
CREATE INDEX "eap_assessments_risk_band_idx" ON "eap_assessments"("risk_band");

-- CreateIndex
CREATE INDEX "eap_sessions_company_id_idx" ON "eap_sessions"("company_id");

-- CreateIndex
CREATE INDEX "eap_sessions_employee_id_idx" ON "eap_sessions"("employee_id");

-- CreateIndex
CREATE INDEX "eap_sessions_status_idx" ON "eap_sessions"("status");

-- CreateIndex
CREATE INDEX "eap_sessions_scheduled_at_idx" ON "eap_sessions"("scheduled_at");

-- AddForeignKey
ALTER TABLE "company_employees" ADD CONSTRAINT "company_employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap_assessments" ADD CONSTRAINT "eap_assessments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "company_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap_sessions" ADD CONSTRAINT "eap_sessions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap_sessions" ADD CONSTRAINT "eap_sessions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "company_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
