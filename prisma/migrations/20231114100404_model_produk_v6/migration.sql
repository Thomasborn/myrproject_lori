-- AlterTable
ALTER TABLE "perbaikan_produksi" ALTER COLUMN "tanggal_mulai" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "tanggal_selesai" DROP NOT NULL;
