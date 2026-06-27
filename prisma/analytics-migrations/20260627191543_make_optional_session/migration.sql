-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_sessionId_fkey";

-- AlterTable
ALTER TABLE "PageView" ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
