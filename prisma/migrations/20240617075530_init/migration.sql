/*
  Warnings:

  - You are about to drop the column `jumlah_barang` on the `lemari` table. All the data in the column will be lost.
  - You are about to drop the column `stok` on the `lemari` table. All the data in the column will be lost.
  - You are about to drop the column `qc_produk_id` on the `qc_bahan` table. All the data in the column will be lost.
  - You are about to drop the `bahan_stok_opnam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detail_bahan_perbaikan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detail_diskon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detail_gawangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detail_kustom_bahan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diskon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kustom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perbaikan_produksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produk_stok_opnam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `qc_produksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stok_bahan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stok_produk` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `produk_outlet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bahan_stok_opnam" DROP CONSTRAINT "bahan_stok_opnam_daftar_bahan_id_fkey";

-- DropForeignKey
ALTER TABLE "bahan_stok_opnam" DROP CONSTRAINT "bahan_stok_opnam_user_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_bahan_perbaikan" DROP CONSTRAINT "detail_bahan_perbaikan_daftarbahan_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_bahan_perbaikan" DROP CONSTRAINT "detail_bahan_perbaikan_perbaikan_produksi_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_diskon" DROP CONSTRAINT "detail_diskon_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_diskon" DROP CONSTRAINT "detail_diskon_diskon_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_gawangan" DROP CONSTRAINT "detail_gawangan_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_gawangan" DROP CONSTRAINT "detail_gawangan_gawangan_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_kustom_bahan" DROP CONSTRAINT "detail_kustom_bahan_daftar_bahan_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_kustom_bahan" DROP CONSTRAINT "detail_kustom_bahan_kustom_id_fkey";

-- DropForeignKey
ALTER TABLE "kustom" DROP CONSTRAINT "kustom_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "kustom" DROP CONSTRAINT "kustom_user_id_fkey";

-- DropForeignKey
ALTER TABLE "perbaikan_produksi" DROP CONSTRAINT "perbaikan_produksi_qc_produksi_id_fkey";

-- DropForeignKey
ALTER TABLE "produk_stok_opnam" DROP CONSTRAINT "produk_stok_opnam_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "produk_stok_opnam" DROP CONSTRAINT "produk_stok_opnam_user_id_fkey";

-- DropForeignKey
ALTER TABLE "qc_produk" DROP CONSTRAINT "qc_produk_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "qc_produksi" DROP CONSTRAINT "qc_produksi_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stok_bahan" DROP CONSTRAINT "stok_bahan_daftar_bahan_id_fkey";

-- DropForeignKey
ALTER TABLE "stok_bahan" DROP CONSTRAINT "stok_bahan_lemari_id_fkey";

-- DropForeignKey
ALTER TABLE "stok_produk" DROP CONSTRAINT "stok_produk_daftar_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "stok_produk" DROP CONSTRAINT "stok_produk_lemari_id_fkey";

-- AlterTable
ALTER TABLE "distribusi" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "gawangan" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "karyawan" ADD COLUMN     "outlet_id" INTEGER;

-- AlterTable
ALTER TABLE "lemari" DROP COLUMN "jumlah_barang",
DROP COLUMN "stok";

-- AlterTable
ALTER TABLE "outlet" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "produk_outlet" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "qc_bahan" DROP COLUMN "qc_produk_id";

-- DropTable
DROP TABLE "bahan_stok_opnam";

-- DropTable
DROP TABLE "detail_bahan_perbaikan";

-- DropTable
DROP TABLE "detail_diskon";

-- DropTable
DROP TABLE "detail_gawangan";

-- DropTable
DROP TABLE "detail_kustom_bahan";

-- DropTable
DROP TABLE "diskon";

-- DropTable
DROP TABLE "kustom";

-- DropTable
DROP TABLE "perbaikan_produksi";

-- DropTable
DROP TABLE "produk_stok_opnam";

-- DropTable
DROP TABLE "qc_produksi";

-- DropTable
DROP TABLE "stok_bahan";

-- DropTable
DROP TABLE "stok_produk";

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_produk" ADD CONSTRAINT "qc_produk_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "produk_outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
