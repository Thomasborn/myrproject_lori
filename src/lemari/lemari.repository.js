
const prisma = require("../db");

const findLemari = async () => {
  const lemari = await prisma.lemari.findMany();

  return lemari;
};

const findLemariById = async (id) => {
  const lemari = await prisma.lemari.findUnique({
    where: {
      id,
    },
  });
  
  return lemari;
};
const insertLemariRepo = async (newLemariData) => {
  
  const { nama, alamat, kapasitas, stok, jumlah_barang, outlet_id } = newLemariData;

    const lemari = await prisma.lemari.create({
      data: {
        nama,
        alamat,
        kapasitas,
        stok,
        jumlah_barang,
        outlet: {
          connect: {
            id: outlet_id,
          },
        },
      },
    });

  return lemari
}
const updateLemariRepo = async (id,updatedLemariData) => {
        const existingLemari = await prisma.lemari.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingLemari) {
            return res.status(404).json({ error: "lemari not found" });
      }

      // Validate and update the lemari data
      const updatedLemari = await prisma.lemari.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedLemariData.kategori || existingLemari.kategori.kategori
        
      },
      });
      return updatedLemari
}
const deleteLemariByIdRepo = async(id)=>{
  await prisma.lemari.delete({
    where: { id: id },
  });
}
module.exports={
  findLemari,
  findLemariById,
  insertLemariRepo,
  updateLemariRepo,
  deleteLemariByIdRepo
}