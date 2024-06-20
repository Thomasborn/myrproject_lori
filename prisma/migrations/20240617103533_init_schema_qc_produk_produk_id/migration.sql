/*
  Warnings:

  - You are about to drop the column `daftar_produk_id` on the `qc_produk` table. All the data in the column will be lost.
  - Added the required column `produk_id` to the `qc_produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "qc_produk" DROP CONSTRAINT "qc_produk_daftar_produk_id_fkey";

-- AlterTable
ALTER TABLE "qc_produk" DROP COLUMN "daftar_produk_id",
ADD COLUMN     "produk_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "qc_produk" ADD CONSTRAINT "qc_produk_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk_outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
