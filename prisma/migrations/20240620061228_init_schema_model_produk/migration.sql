/*
  Warnings:

  - You are about to drop the column `variasi` on the `model_produk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "model_produk" DROP COLUMN "variasi";

-- AlterTable
ALTER TABLE "restok_bahan" ALTER COLUMN "tanggal_pesan" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "tanggal_estimasi" DROP DEFAULT;
