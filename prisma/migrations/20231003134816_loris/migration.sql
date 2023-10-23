-- CreateTable
CREATE TABLE "produk_item" (
    "id" SERIAL NOT NULL,
    "kode_produk" VARCHAR(50) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "nama_produk" VARCHAR(50) NOT NULL,
    "stok" INTEGER NOT NULL,
    "harga_jual" DOUBLE PRECISION NOT NULL,
    "produk_id" INTEGER NOT NULL,

    CONSTRAINT "produk_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produksi" (
    "id" SERIAL NOT NULL,
    "mulai" TIMESTAMP(3) NOT NULL,
    "selesai" TIMESTAMP(3) NOT NULL,
    "kode_produk" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "ukuran" VARCHAR(50) NOT NULL,
    "warna" VARCHAR(50) NOT NULL,
    "pembuat_id" INTEGER NOT NULL,
    "kategori_produk_id" INTEGER NOT NULL,

    CONSTRAINT "produksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_produk" (
    "id" SERIAL NOT NULL,
    "kategori" VARCHAR(50) NOT NULL,

    CONSTRAINT "kategori_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembuat" (
    "id" SERIAL NOT NULL,
    "nama_pembuat" VARCHAR(50) NOT NULL,

    CONSTRAINT "pembuat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "produk_item" ADD CONSTRAINT "produk_item_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produksi" ADD CONSTRAINT "produksi_pembuat_id_fkey" FOREIGN KEY ("pembuat_id") REFERENCES "pembuat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produksi" ADD CONSTRAINT "produksi_kategori_produk_id_fkey" FOREIGN KEY ("kategori_produk_id") REFERENCES "kategori_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
