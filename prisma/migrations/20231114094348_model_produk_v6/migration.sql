/*
  Warnings:

  - Added the required column `jumlah` to the `detail_bahan_perbaikan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detail_bahan_perbaikan" ADD COLUMN     "jumlah" INTEGER NOT NULL;
