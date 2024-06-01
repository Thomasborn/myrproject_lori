/*
  Warnings:

  - You are about to drop the column `jumlah` on the `detail_model_produk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_produk" ADD COLUMN     "jumlah" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "detail_model_produk" DROP COLUMN "jumlah";
