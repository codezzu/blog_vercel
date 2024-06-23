/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Survey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_surveyId_fkey";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ip" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_ip_key" ON "User"("ip");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
