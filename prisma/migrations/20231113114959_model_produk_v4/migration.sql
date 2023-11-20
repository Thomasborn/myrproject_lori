/*
  Warnings:

  - You are about to drop the column `modelProdukId` on the `foto_produk` table. All the data in the column will be lost.
  - Added the required column `model_produk_id` to the `foto_produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "foto_produk" DROP CONSTRAINT "foto_produk_modelProdukId_fkey";

-- AlterTable
ALTER TABLE "foto_produk" DROP COLUMN "modelProdukId",
ADD COLUMN     "model_produk_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "foto_produk" ADD CONSTRAINT "foto_produk_model_produk_id_fkey" FOREIGN KEY ("model_produk_id") REFERENCES "model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
