-- AlterTable
ALTER TABLE "qc_produk" ADD COLUMN     "tanggal_selesai" TIMESTAMP(3),
ADD COLUMN     "tanggal_temuan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
