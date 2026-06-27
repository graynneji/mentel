/*
  Warnings:

  - Added the required column `lastActivityAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL;
