-- AlterTable
ALTER TABLE "produksi" ALTER COLUMN "tanggal_mulai" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "tanggal_selesai" DROP NOT NULL,
ALTER COLUMN "tanggal_selesai" SET DEFAULT CURRENT_TIMESTAMP;