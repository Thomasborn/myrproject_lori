
const prisma = require("../../src/db");

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
const insertKustomRepo = async (newKustomData) => {
  
  const nama = newKustomData.nama;
  const tipe = newKustomData.tipe;
  const kustom = await prisma.kustom.create({
    data: {
      nama,
      tipe: ""|| tipe,

      },
  });
  return kustom
}
const updateKustomRepo = async (id,updatedKustomData) => {
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
          kategori: updatedKustomData.kategori || existingKustom.kategori.kategori
        
      },
      });
      return updatedKustom
}
const deleteKustomByIdRepo = async(id)=>{
  await prisma.kustom.delete({
    where: { id: id },
  });
}
module.exports={
  findKustom,
  findKustomById,
  insertKustomRepo,
  updateKustomRepo,
  deleteKustomByIdRepo
}