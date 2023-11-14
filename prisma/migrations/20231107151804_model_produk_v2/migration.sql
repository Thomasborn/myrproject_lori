/*
  Warnings:

  - Added the required column `updated_at` to the `akses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `bahan_produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `daftar_bahan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `detail_model_produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `fungsi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `hak_akses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `karyawan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `kategori_produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `model_produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "akses" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bahan_produk" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "daftar_bahan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "detail_model_produk" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "fungsi" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "hak_akses" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "karyawan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "kategori_produk" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "model_produk" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "role" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "restok_bahan" (
    "id" SERIAL NOT NULL,
    "tanggal_pesan" TIMESTAMP(3) NOT NULL,
    "tanggal_terima" TIMESTAMP(3) NOT NULL,
    "harga_satuan" DOUBLE PRECISION NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "daftar_bahan_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "restok_bahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "no_rek" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produksi" (
    "id" SERIAL NOT NULL,
    "produksi" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "detail_model_produk_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "produksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qcproduksi" (
    "id" SERIAL NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "produksi_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "qcproduksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_produk" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "detail_model_produk_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "daftar_produk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restok_bahan" ADD CONSTRAINT "restok_bahan_daftar_bahan_id_fkey" FOREIGN KEY ("daftar_bahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restok_bahan" ADD CONSTRAINT "restok_bahan_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produksi" ADD CONSTRAINT "produksi_detail_model_produk_id_fkey" FOREIGN KEY ("detail_model_produk_id") REFERENCES "detail_model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produksi" ADD CONSTRAINT "produksi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qcproduksi" ADD CONSTRAINT "qcproduksi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qcproduksi" ADD CONSTRAINT "qcproduksi_produksi_id_fkey" FOREIGN KEY ("produksi_id") REFERENCES "produksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daftar_produk" ADD CONSTRAINT "daftar_produk_detail_model_produk_id_fkey" FOREIGN KEY ("detail_model_produk_id") REFERENCES "detail_model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
