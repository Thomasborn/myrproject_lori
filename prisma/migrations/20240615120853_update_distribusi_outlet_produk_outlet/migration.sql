-- CreateTable
CREATE TABLE "produk_outlet" (
    "id" SERIAL NOT NULL,
    "daftar_produk_id" INTEGER NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "produk_outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribusi" (
    "id" SERIAL NOT NULL,
    "daftar_produk_id" INTEGER NOT NULL,
    "idPic" INTEGER NOT NULL,
    "asal_outlet_id" INTEGER NOT NULL,
    "tujuan_outlet_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "catatan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "distribusi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "produk_outlet_outlet_id_idx" ON "produk_outlet"("outlet_id");

-- CreateIndex
CREATE UNIQUE INDEX "produk_outlet_daftar_produk_id_outlet_id_key" ON "produk_outlet"("daftar_produk_id", "outlet_id");

-- AddForeignKey
ALTER TABLE "produk_outlet" ADD CONSTRAINT "produk_outlet_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_outlet" ADD CONSTRAINT "produk_outlet_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_idPic_fkey" FOREIGN KEY ("idPic") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_daftar_produk_id_fkey" FOREIGN KEY ("daftar_produk_id") REFERENCES "daftar_produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_asal_outlet_id_fkey" FOREIGN KEY ("asal_outlet_id") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_tujuan_outlet_id_fkey" FOREIGN KEY ("tujuan_outlet_id") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
