/*
  Warnings:

  - You are about to drop the `qcproduksi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "qcproduksi" DROP CONSTRAINT "qcproduksi_produksi_id_fkey";

-- DropForeignKey
ALTER TABLE "qcproduksi" DROP CONSTRAINT "qcproduksi_user_id_fkey";

-- DropTable
DROP TABLE "qcproduksi";

-- CreateTable
CREATE TABLE "qc_produksi" (
    "id" SERIAL NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deskripsi" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "produksi_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "qc_produksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perbaikan_produksi" (
    "id" SERIAL NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "qc_produksi_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "perbaikan_produksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_bahan_perbaikan" (
    "id" SERIAL NOT NULL,
    "perbaikan_produksi_id" INTEGER NOT NULL,
    "daftarbahan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "detail_bahan_perbaikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qc_produk" (
    "id" SERIAL NOT NULL,
    "tindakan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "catatan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "daftar_produk_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "qc_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qc_bahan" (
    "id" SERIAL NOT NULL,
    "tindakan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "catatan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "qc_produk_id" INTEGER NOT NULL,
    "daftar_bahan_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "qc_bahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lemari" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "jumlah_barang" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "outlet_id" INTEGER NOT NULL,

    CONSTRAINT "lemari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stok_produk" (
    "id" SERIAL NOT NULL,
    "stok" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "daftar_produk_id" INTEGER NOT NULL,
    "lemari_id" INTEGER NOT NULL,

    CONSTRAINT "stok_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlet" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "no_telp" TEXT NOT NULL,
    "jam_operasional" TEXT NOT NULL,
    "tanggal_buka" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_gawangan" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "gawangan_id" INTEGER NOT NULL,
    "daftar_produk_id" INTEGER NOT NULL,

    CONSTRAINT "detail_gawangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gawangan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gawangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bahan_stok_opnam" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "daftar_bahan_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "bahan_stok_opnam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_stok_opnam" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "daftar_produk_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "produk_stok_opnam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kustom" (
    "id" SERIAL NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "harga_jasa" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "daftar_produk_id" INTEGER NOT NULL,

    CONSTRAINT "kustom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_kustom_bahan" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "kustom_id" INTEGER NOT NULL,
    "daftar_bahan_id" INTEGER NOT NULL,

    CONSTRAINT "detail_kustom_bahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_penjualan" (
    "id" SERIAL NOT NULL,
    "jenis_transaksi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "penjualan_id" INTEGER NOT NULL,
    "daftar_produk_id" INTEGER NOT NULL,

    CONSTRAINT "detail_penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penjualan" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "metode_pembayaran" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_diskon" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "diskon_id" INTEGER NOT NULL,
    "daftar_produk_id" INTEGER,
    "penjualan_id" INTEGER,

    CONSTRAINT "detail_diskon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diskon" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "diskon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "qc_produksi" ADD CONSTRAINT "qc_produksi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_produksi" ADD CONSTRAINT "qc_produksi_produksi_id_fkey" FOREIGN KEY ("produksi_id") REFERENCES "produksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perbaikan_produksi" ADD CONSTRAINT "perbaikan_produksi_qc_produksi_id_fkey" FOREIGN KEY ("qc_produksi_id") REFERENCES "qc_produksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_bahan_perbaikan" ADD CONSTRAINT "detail_bahan_perbaikan_perbaikan_produksi_id_fkey" FOREIGN KEY ("perbaikan_produksi_id") REFERENCES "perbaikan_produksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_bahan_perbaikan" ADD CONSTRAINT "detail_bahan_perbaikan_daftarbahan_id_fkey" FOREIGN KEY ("daftarbahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_produk" ADD CONSTRAINT "qc_produk_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_produk" ADD CONSTRAINT "qc_produk_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_bahan" ADD CONSTRAINT "qc_bahan_daftar_bahan_id_fkey" FOREIGN KEY ("daftar_bahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_bahan" ADD CONSTRAINT "qc_bahan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lemari" ADD CONSTRAINT "lemari_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok_produk" ADD CONSTRAINT "stok_produk_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok_produk" ADD CONSTRAINT "stok_produk_lemari_id_fkey" FOREIGN KEY ("lemari_id") REFERENCES "lemari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_gawangan" ADD CONSTRAINT "detail_gawangan_gawangan_id_fkey" FOREIGN KEY ("gawangan_id") REFERENCES "gawangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_gawangan" ADD CONSTRAINT "detail_gawangan_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gawangan" ADD CONSTRAINT "gawangan_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bahan_stok_opnam" ADD CONSTRAINT "bahan_stok_opnam_daftar_bahan_id_fkey" FOREIGN KEY ("daftar_bahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bahan_stok_opnam" ADD CONSTRAINT "bahan_stok_opnam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_stok_opnam" ADD CONSTRAINT "produk_stok_opnam_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_stok_opnam" ADD CONSTRAINT "produk_stok_opnam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kustom" ADD CONSTRAINT "kustom_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kustom" ADD CONSTRAINT "kustom_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_kustom_bahan" ADD CONSTRAINT "detail_kustom_bahan_kustom_id_fkey" FOREIGN KEY ("kustom_id") REFERENCES "kustom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_kustom_bahan" ADD CONSTRAINT "detail_kustom_bahan_daftar_bahan_id_fkey" FOREIGN KEY ("daftar_bahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_penjualan" ADD CONSTRAINT "detail_penjualan_penjualan_id_fkey" FOREIGN KEY ("penjualan_id") REFERENCES "penjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_penjualan" ADD CONSTRAINT "detail_penjualan_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penjualan" ADD CONSTRAINT "penjualan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_diskon" ADD CONSTRAINT "detail_diskon_diskon_id_fkey" FOREIGN KEY ("diskon_id") REFERENCES "diskon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_diskon" ADD CONSTRAINT "detail_diskon_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_diskon" ADD CONSTRAINT "detail_diskon_penjualan_id_fkey" FOREIGN KEY ("penjualan_id") REFERENCES "penjualan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
