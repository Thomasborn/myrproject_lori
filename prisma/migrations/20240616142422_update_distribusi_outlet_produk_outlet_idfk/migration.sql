/*
  Warnings:

  - You are about to drop the column `daftar_produk_id` on the `distribusi` table. All the data in the column will be lost.
  - You are about to drop the column `daftar_produk_id` on the `produk_outlet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[produk_id,outlet_id]` on the table `produk_outlet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `produk_id` to the `distribusi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produk_id` to the `produk_outlet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "distribusi" DROP CONSTRAINT "distribusi_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "produk_outlet" DROP CONSTRAINT "produk_outlet_daftar_produk_id_fkey";

-- DropIndex
DROP INDEX "produk_outlet_daftar_produk_id_outlet_id_key";

-- AlterTable
ALTER TABLE "distribusi" DROP COLUMN "daftar_produk_id",
ADD COLUMN     "produk_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "produk_outlet" DROP COLUMN "daftar_produk_id",
ADD COLUMN     "produk_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "produk_outlet_produk_id_outlet_id_key" ON "produk_outlet"("produk_id", "outlet_id");

-- AddForeignKey
ALTER TABLE "produk_outlet" ADD CONSTRAINT "produk_outlet_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "detail_model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "detail_model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
