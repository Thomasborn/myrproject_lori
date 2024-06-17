-- AddForeignKey
ALTER TABLE "produksi" ADD CONSTRAINT "produksi_id_reviewer_fkey" FOREIGN KEY ("id_reviewer") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
