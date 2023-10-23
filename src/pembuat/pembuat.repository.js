
const prisma = require("../db");

const findProduk = async () => {
  const pembuat = await prisma.pembuat.findMany();

  return pembuat;
};

const findProdukById = async (id) => {
  const pembuat = await prisma.pembuat.findUnique({
    where: {
      id,
    },
  });
  
  return pembuat;
};
const insertProdukRepo = async (newprodukData) => {
  
  const nama_pembuat = newprodukData.nama_pembuat;
  const pembuat = await prisma.pembuat.create({
    data: {
      nama_pembuat,

      },
  });
  return pembuat
}
const updateProdukRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.pembuat.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "pembuat not found" });
      }

      // Validate and update the pembuat data
      const updatedProduk = await prisma.pembuat.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedProdukData.kategori || existingProduk.kategori.kategori
        
      },
      });
      return updatedProduk
}
const deleteprodukByIdRepo = async(id)=>{
  await prisma.pembuat.delete({
    where: { id: id },
  });
}
module.exports={
  findProduk,
  findProdukById,
  insertProdukRepo,
  updateProdukRepo,
  deleteprodukByIdRepo
}