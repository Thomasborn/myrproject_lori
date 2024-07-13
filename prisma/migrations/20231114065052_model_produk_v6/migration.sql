/*
  Warnings:

  - Added the required column `jumlah` to the `perbaikan_produksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah_aman` to the `qc_produksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah_rusak` to the `qc_produksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perbaikan_produksi" ADD COLUMN     "jumlah" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "qc_produksi" ADD COLUMN     "jumlah_aman" INTEGER NOT NULL,
ADD COLUMN     "jumlah_rusak" INTEGER NOT NULL;
