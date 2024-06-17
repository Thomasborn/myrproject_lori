/*
  Warnings:

  - You are about to drop the column `produksi` on the `produksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "produksi" DROP COLUMN "produksi",
ADD COLUMN     "catatan" TEXT;
