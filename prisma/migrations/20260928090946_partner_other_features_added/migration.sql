-- CreateTable
CREATE TABLE "partner_idempotency_keys" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partner_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL,
    "response_body" JSONB NOT NULL,

    CONSTRAINT "partner_idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "partner_idempotency_keys_partner_id_idx" ON "partner_idempotency_keys"("partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_idempotency_keys_partner_id_key_key" ON "partner_idempotency_keys"("partner_id", "key");

-- AddForeignKey
ALTER TABLE "partner_idempotency_keys" ADD CONSTRAINT "partner_idempotency_keys_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
