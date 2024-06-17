/*
  Warnings:

  - You are about to drop the column `tanggl` on the `distribusi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "distribusi" DROP COLUMN "tanggl",
ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
