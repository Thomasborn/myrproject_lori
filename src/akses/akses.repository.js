
const prisma = require("../db");

const findakses = async () => {
  const akses = await prisma.akses.findMany();

  return akses;
};

const findaksesById = async (id) => {
  const akses = await prisma.akses.findUnique({
    where: {
      id,
    },
  });
  
  return akses;
};
const insertaksesRepo = async (newaksesData) => {
  
  const nama = newaksesData.nama;
  const akses = await prisma.akses.create({
    data: {
      nama,
 
      },
  });
  return akses
}
const updateaksesRepo = async (id,updatedaksesData) => {
        const existingakses = await prisma.akses.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingakses) {
            return res.status(404).json({ error: "akses not found" });
      }

      // Validate and update the akses data
      const updatedakses = await prisma.akses.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
           nama : newaksesData.nama    || existingakses.nama,
           
        
      },
      });
      return updatedakses
}
const deleteaksesByIdRepo = async(id)=>{


  await prisma.akses.delete({
    where: { id: id },
  });
}
module.exports={
  findakses,
  findaksesById,
  insertaksesRepo,
  updateaksesRepo,
  deleteaksesByIdRepo
}