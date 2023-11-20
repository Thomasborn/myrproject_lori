
const prisma = require("../db");

const findBahan = async () => {
  const daftar_bahan = await prisma.daftar_bahan.findMany();

  return daftar_bahan;
};

const findBahanById = async (id) => {
  const daftar_bahan = await prisma.daftar_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return daftar_bahan;
};
const insertBahanRepo = async (newBahanData) => {
  
  const { kode, stok, nama, satuan } = newBahanData;

  const insertDaftarBahan = await prisma.daftar_bahan.create({
    data: {
      kode,
      stok,
      nama,
      satuan,
    },
  });
  return insertDaftarBahan;
}
const updateBahanRepo = async (id,updatedBahanData) => {
        const existingBahan = await prisma.daftar_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingBahan) {
            return res.status(404).json({ error: "daftar_bahan not found" });
      }

      // Validate and update the daftar_bahan data
      const updatedBahan = await prisma.daftar_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedBahanData.kategori || existingBahan.kategori.kategori
        
      },
      });
      return updatedBahan
}
const deleteBahanByIdRepo = async(id)=>{
  await prisma.daftar_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findBahan,
  findBahanById,
  insertBahanRepo,
  updateBahanRepo,
  deleteBahanByIdRepo
}