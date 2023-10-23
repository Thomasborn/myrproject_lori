
const prisma = require("../db");

const finduser = async () => {
  const user = await prisma.user.findMany();

  return user;
};

const finduserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  
  return user;
};
const insertuserRepo = async (newuserData) => {
  
  const kategori = newuserData.kategori;
  const user = await prisma.user.create({
    data: {
      kategori,

      },
  });
  return user
}
const updateuserRepo = async (id,updateduserData) => {
        const existinguser = await prisma.user.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existinguser) {
            return res.status(404).json({ error: "user not found" });
      }

      // Validate and update the user data
      const updateduser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updateduserData.kategori || existinguser.kategori.kategori
        
      },
      });
      return updateduser
}
const deleteuserByIdRepo = async(id)=>{
  await prisma.user.delete({
    where: { id: id },
  });
}
module.exports={
  finduser,
  finduserById,
  insertuserRepo,
  updateuserRepo,
  deleteuserByIdRepo
}