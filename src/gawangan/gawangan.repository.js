
const prisma = require("../db");

const findgawangan = async () => {
  const gawangan = await prisma.gawangan.findMany();

  return gawangan;
};

const findgawanganById = async (id) => {
  const gawangan = await prisma.gawangan.findUnique({
    where: {
      id,
    },
  });
  
  return gawangan;
};
const insertgawanganRepo = async (newgawanganData) => {
  
  const kategori = newgawanganData.kategori;
  const gawangan = await prisma.gawangan.create({
    data: {
      kategori,

      },
  });
  return gawangan
}
const updategawanganRepo = async (id,updatedgawanganData) => {
        const existinggawangan = await prisma.gawangan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existinggawangan) {
            return res.status(404).json({ error: "gawangan not found" });
      }

      // Validate and update the gawangan data
      const updatedgawangan = await prisma.gawangan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedgawanganData.kategori || existinggawangan.kategori.kategori
        
      },
      });
      return updatedgawangan
}
const deletegawanganByIdRepo = async(id)=>{
  await prisma.gawangan.delete({
    where: { id: id },
  });
}
module.exports={
  findgawangan,
  findgawanganById,
  insertgawanganRepo,
  updategawanganRepo,
  deletegawanganByIdRepo
}