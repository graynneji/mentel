-- CreateTable
CREATE TABLE "clone_alerts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detected_host" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,

    CONSTRAINT "clone_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clone_alerts_detected_host_idx" ON "clone_alerts"("detected_host");

-- CreateIndex
CREATE INDEX "clone_alerts_created_at_idx" ON "clone_alerts"("created_at");
