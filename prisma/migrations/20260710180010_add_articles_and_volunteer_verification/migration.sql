-- CreateTable
CREATE TABLE "volunteer_verifications" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_licensed_professional" BOOLEAN NOT NULL DEFAULT false,
    "license_body" TEXT,
    "license_number" TEXT,
    "license_document_url" TEXT,
    "nin_number" TEXT NOT NULL,
    "nin_document_url" TEXT,
    "cv_document_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,

    CONSTRAINT "volunteer_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "volunteer_verifications_status_idx" ON "volunteer_verifications"("status");

-- CreateIndex
CREATE INDEX "volunteer_verifications_created_at_idx" ON "volunteer_verifications"("created_at");
