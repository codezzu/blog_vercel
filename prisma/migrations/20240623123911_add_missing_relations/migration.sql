/*
  Warnings:

  - You are about to drop the column `ip` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_ip_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ip";
