/*
  Warnings:

  - You are about to drop the column `daftar_produk_id` on the `detail_penjualan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_diskon" DROP CONSTRAINT "detail_diskon_penjualan_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_penjualan" DROP CONSTRAINT "detail_penjualan_daftar_produk_id_fkey";

-- AlterTable
ALTER TABLE "detail_penjualan" DROP COLUMN "daftar_produk_id",
ADD COLUMN     "produk_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "detail_penjualan" ADD CONSTRAINT "detail_penjualan_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "detail_model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
