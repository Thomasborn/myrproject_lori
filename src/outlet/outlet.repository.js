
const prisma = require("../db");

const findoutlet = async () => {
  const outlet = await prisma.outlet.findMany();

  return outlet;
};

const findoutletById = async (id) => {
  const outlet = await prisma.outlet.findUnique({
    where: {
      id,
    },
  });
  
  return outlet;
};
const insertoutletRepo = async (newoutletData) => {
  
  const kategori = newoutletData.kategori;
  const outlet = await prisma.outlet.create({
    data: {
      kategori,

      },
  });
  return outlet
}
const updateoutletRepo = async (id,updatedoutletData) => {
        const existingoutlet = await prisma.outlet.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingoutlet) {
            return res.status(404).json({ error: "outlet not found" });
      }

      // Validate and update the outlet data
      const updatedoutlet = await prisma.outlet.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedoutletData.kategori || existingoutlet.kategori.kategori
        
      },
      });
      return updatedoutlet
}
const deleteoutletByIdRepo = async(id)=>{
  await prisma.outlet.delete({
    where: { id: id },
  });
}
module.exports={
  findoutlet,
  findoutletById,
  insertoutletRepo,
  updateoutletRepo,
  deleteoutletByIdRepo
}