/*
  Warnings:

  - You are about to drop the column `jumlah` on the `daftar_produk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_produk" DROP COLUMN "jumlah";

-- AlterTable
ALTER TABLE "detail_model_produk" ADD COLUMN     "jumlah" INTEGER NOT NULL DEFAULT 0;
