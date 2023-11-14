-- AlterTable
ALTER TABLE "produksi" ALTER COLUMN "tanggal_selesai" DROP DEFAULT;

-- AlterTable
ALTER TABLE "qcproduksi" ALTER COLUMN "waktu" SET DEFAULT CURRENT_TIMESTAMP;
