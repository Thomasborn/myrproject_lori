/*
  Warnings:

  - You are about to drop the column `foto` on the `model_produk` table. All the data in the column will be lost.
  - Added the required column `variasi` to the `model_produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_produk" DROP COLUMN "foto",
ADD COLUMN     "variasi" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "foto_produk" (
    "id" SERIAL NOT NULL,
    "filepath" TEXT NOT NULL,
    "modelProdukId" INTEGER NOT NULL,

    CONSTRAINT "foto_produk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "foto_produk" ADD CONSTRAINT "foto_produk_modelProdukId_fkey" FOREIGN KEY ("modelProdukId") REFERENCES "model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
