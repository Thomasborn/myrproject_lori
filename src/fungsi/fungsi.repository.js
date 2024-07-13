
const prisma = require("../db");

const findfungsi = async () => {
  const fungsi = await prisma.fungsi.findMany();

  return fungsi;
};

const findfungsiById = async (id) => {
  const fungsi = await prisma.fungsi.findUnique({
    where: {
      id,
    },
  });
  
  return fungsi;
};
const insertfungsiRepo = async (newfungsiData) => {
  
  const nama = newfungsiData.nama;
  const fungsi = await prisma.fungsi.create({
    data: {
      nama,
 
      },
  });
  return fungsi
}
const updatefungsiRepo = async (id,updatedfungsiData) => {
        const existingfungsi = await prisma.fungsi.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingfungsi) {
            return res.status(404).json({ error: "fungsi not found" });
      }

      // Validate and update the fungsi data
      const updatedfungsi = await prisma.fungsi.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
           nama : newfungsiData.nama    || existingfungsi.nama,
           
        
      },
      });
      return updatedfungsi
}
const deletefungsiByIdRepo = async(id)=>{


  await prisma.fungsi.delete({
    where: { id: id },
  });
}
module.exports={
  findfungsi,
  findfungsiById,
  insertfungsiRepo,
  updatefungsiRepo,
  deletefungsiByIdRepo
}