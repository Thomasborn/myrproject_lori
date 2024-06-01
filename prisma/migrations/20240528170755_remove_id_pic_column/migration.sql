-- DropForeignKey
ALTER TABLE "outlet" DROP CONSTRAINT "outlet_idPic_fkey";

-- AlterTable
ALTER TABLE "outlet" ALTER COLUMN "idPic" DROP NOT NULL,
ALTER COLUMN "idPic" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "outlet" ADD CONSTRAINT "outlet_idPic_fkey" FOREIGN KEY ("idPic") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
