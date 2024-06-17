-- DropForeignKey
ALTER TABLE "qc_produksi" DROP CONSTRAINT "qc_produksi_produksi_id_fkey";

-- AlterTable
ALTER TABLE "produksi" ADD COLUMN     "id_reviewer" INTEGER;
