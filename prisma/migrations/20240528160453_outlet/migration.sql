-- AlterTable
ALTER TABLE "outlet" ADD COLUMN     "idPic" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "outlet" ADD CONSTRAINT "outlet_idPic_fkey" FOREIGN KEY ("idPic") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
