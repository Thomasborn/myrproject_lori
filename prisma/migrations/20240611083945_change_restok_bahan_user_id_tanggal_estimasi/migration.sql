-- AlterTable
ALTER TABLE "restok_bahan" ADD COLUMN     "tanggal_estimasi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "restok_bahan" ADD CONSTRAINT "restok_bahan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
