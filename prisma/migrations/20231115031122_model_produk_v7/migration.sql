-- CreateTable
CREATE TABLE "stok_bahan" (
    "id" SERIAL NOT NULL,
    "daftar_bahan_id" INTEGER NOT NULL,
    "lemari_id" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,

    CONSTRAINT "stok_bahan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stok_bahan" ADD CONSTRAINT "stok_bahan_daftar_bahan_id_fkey" FOREIGN KEY ("daftar_bahan_id") REFERENCES "daftar_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok_bahan" ADD CONSTRAINT "stok_bahan_lemari_id_fkey" FOREIGN KEY ("lemari_id") REFERENCES "lemari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
