/*
  Warnings:

  - You are about to drop the column `nama` on the `gawangan` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `lemari` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gawangan" DROP COLUMN "nama",
ADD COLUMN     "deksripsi" TEXT,
ADD COLUMN     "kode" TEXT;

-- AlterTable
ALTER TABLE "lemari" DROP COLUMN "nama",
ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "kode" TEXT;
