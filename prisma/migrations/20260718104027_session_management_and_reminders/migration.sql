-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_payment_id_fkey";

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "payment_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "scheduled_sessions" ADD COLUMN     "cancel_reason" TEXT,
ADD COLUMN     "cancelled_by" TEXT,
ADD COLUMN     "reminder_1h_sent_at" TIMESTAMP(3),
ADD COLUMN     "reminder_24h_sent_at" TIMESTAMP(3),
ADD COLUMN     "rescheduled_from" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
