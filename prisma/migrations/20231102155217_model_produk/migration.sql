/*
  Warnings:

  - You are about to drop the column `kategori` on the `kategori_produk` table. All the data in the column will be lost.
  - You are about to drop the `pembuat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produk_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produksi` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nama` to the `kategori_produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipe` to the `kategori_produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "produk_item" DROP CONSTRAINT "produk_item_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "produksi" DROP CONSTRAINT "produksi_kategori_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "produksi" DROP CONSTRAINT "produksi_pembuat_id_fkey";

-- AlterTable
ALTER TABLE "kategori_produk" DROP COLUMN "kategori",
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "tipe" TEXT NOT NULL;

-- DropTable
DROP TABLE "pembuat";

-- DropTable
DROP TABLE "produk_item";

-- DropTable
DROP TABLE "produksi";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "karyawan_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "karyawan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "no_rekening" TEXT NOT NULL,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "akses" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "akses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fungsi" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "fungsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hak_akses" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "fungsi_id" INTEGER NOT NULL,
    "akses_id" INTEGER NOT NULL,

    CONSTRAINT "hak_akses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_produk" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "foto" TEXT,
    "kategori_id" INTEGER NOT NULL,

    CONSTRAINT "model_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_model_produk" (
    "id" SERIAL NOT NULL,
    "ukuran" TEXT NOT NULL,
    "biaya_jahit" DOUBLE PRECISION NOT NULL,
    "hpp" DOUBLE PRECISION NOT NULL,
    "harga_jual" DOUBLE PRECISION NOT NULL,
    "model_produk_id" INTEGER NOT NULL,

    CONSTRAINT "detail_model_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bahan_produk" (
    "id" SERIAL NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "detail_model_produk_id" INTEGER NOT NULL,
    "daftar_bahan_id" INTEGER NOT NULL,

    CONSTRAINT "bahan_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_bahan" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "stok" DOUBLE PRECISION NOT NULL,
    "nama" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,

    CONSTRAINT "daftar_bahan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_nik_key" ON "karyawan"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "hak_akses_role_id_fungsi_id_akses_id_key" ON "hak_akses"("role_id", "fungsi_id", "akses_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hak_akses" ADD CONSTRAINT "hak_akses_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hak_akses" ADD CONSTRAINT "hak_akses_fungsi_id_fkey" FOREIGN KEY ("fungsi_id") REFERENCES "fungsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hak_akses" ADD CONSTRAINT "hak_akses_akses_id_fkey" FOREIGN KEY ("akses_id") REFERENCES "akses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_produk" ADD CONSTRAINT "model_produk_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_model_produk" ADD CONSTRAINT "detail_model_produk_model_produk_id_fkey" FOREIGN KEY ("model_produk_id") REFERENCES "model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bahan_produk" ADD CONSTRAINT "bahan_produk_detail_model_produk_id_fkey" FOREIGN KEY ("detail_model_produk_id") REFERENCES "detail_model_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bahan_produk" ADD CONSTRAINT "bahan_produk_daftar_bahan_id_fkey" FOREIGN KEY ("daftar_bahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
