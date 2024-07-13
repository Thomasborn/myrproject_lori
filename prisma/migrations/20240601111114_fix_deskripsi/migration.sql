/*
  Warnings:

  - You are about to drop the column `deksripsi` on the `gawangan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gawangan" DROP COLUMN "deksripsi",
ADD COLUMN     "deskripsi" TEXT;
