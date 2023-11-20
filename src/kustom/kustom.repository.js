
const prisma = require("../db");

const findKustom = async () => {
  const kustom = await prisma.kustom.findMany();

  return kustom;
};

const findKustomById = async (id) => {
  const kustom = await prisma.kustom.findUnique({
    where: {
      id,
    },
  });
  
  return kustom;
};

const findDetailKustom = async () => {
  const detailKustom = await prisma.detail_kustom_bahan.findMany();

  return detailKustom;
};

const findDetailKustomById = async (id) => {
  const detailKustom = await prisma.detail_kustom_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return detailKustom;
};
const insertKustomRepo = async (newkustomData) => {
  
  const { user_id, tanggal_selesai, tanggal_mulai, harga_jasa, daftar_produk_id } = newkustomData;

   // menambahkan row kustom
    const insertedKustom = await prisma.kustom.create({
      data: { user_id, tanggal_selesai, tanggal_mulai, harga_jasa, daftar_produk_id },
    });
  return insertedKustom
};
const insertDetailKustomRepo = async (newkustomData) => {
  
  const{kustom_id,daftar_bahan_id}=newkustomData;
 // menambahkan row kustom
  const insertedDetailKustom = await prisma.detail_kustom_bahan.create({
    data: {
      kustom_id:parseInt(kustom_id),
      daftar_bahan_id:parseInt(daftar_bahan_id),
    },
  });
  return insertedDetailKustom;
}
const updateKustomRepo = async (id,updatedkustomData) => {
        const existingKustom = await prisma.kustom.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingKustom) {
            return res.status(404).json({ error: "kustom not found" });
      }

      // Validate and update the kustom data
      const updatedKustom = await prisma.kustom.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedKustomData.kategori || existingkustom.kategori.kategori
        
      },
      });;
      return updatedKustom;
};

const updateDetailKustomRepo = async (id,updatedkustomData) => {
        const existingDetailkustom = await prisma.detail_kustom_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingDetailkustom) {
            return ({ error: "detail kustom not found" });
      }

      // Validate and update the kustom data
      const updatedDetailKustom = await prisma.detail_kustom_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          daftar_produk_id: updatedkustomData.daftar_produk_id || existingDetailkustom.daftar_produk_id,
          kustom_id: updatedkustomData.kustom_id || existingDetailkustom.kustom_id
        
      },
      });
      return updatedDetailKustom
}
const deleteKustomByIdRepo = async(id)=>{
  await prisma.kustom.delete({
    where: { id: id },
  });
}

const deleteDetailKustomByIdRepo = async(id)=>{
  await prisma.detail_kustom_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findKustom,findDetailKustom,findDetailKustomById, findKustomById, insertKustomRepo, insertDetailKustomRepo, updateDetailKustomRepo,updateKustomRepo, deleteKustomByIdRepo,deleteDetailKustomByIdRepo 
}