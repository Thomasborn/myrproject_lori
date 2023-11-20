
const prisma = require("../db");

const findhak_akses = async () => {
  const hak_akses = await prisma.hak_akses.findMany();

  return hak_akses;
};

const findhak_aksesById = async (id) => {
  const hak_akses = await prisma.hak_akses.findUnique({
    where: {
      id,
    },
  });
  
  return hak_akses;
};

const findHakAksesByRoleId = async (id) => {
  const hak_akses = await prisma.hak_akses.findMany({
    where: {
      role_id:{
        equals: id
      },
    },include:{
      fungsi:true,
      akses:true
    }
  });
  
  return hak_akses;
};
const inserthak_aksesRepo = async (newhak_aksesData) => {
  
  const nama = newhak_aksesData.nama;
  const role_id = parseInt(newhak_aksesData.role_id);
  const fungsi_id = parseInt(newhak_aksesData.fungsi_id);
  const akses_id = parseInt(newhak_aksesData.akses_id);
  const hak_akses = await prisma.hak_akses.create({
    data: {
    role:{
      connect: {
        id:role_id
      }
    },
    fungsi:{
      connect: {
        id:fungsi_id
      }
    },
    akses:{
      connect: {
        id:akses_id
      }
    },
 
      },
  });
  return hak_akses
}
const updatehak_aksesRepo = async (id,updatedhak_aksesData) => {
        const existinghak_akses = await prisma.hak_akses.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existinghak_akses) {
            return res.status(404).json({ error: "hak_akses not found" });
      }

      // Validate and update the hak_akses data
      const updatedhak_akses = await prisma.hak_akses.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
           role_id : newhak_aksesData.role_id    || existinghak_akses.role_id,
           fungsi_id : newhak_aksesData.fungsi_id    || existinghak_akses.fungsi_id,
           akses_id : newhak_aksesData.akses_id    || existinghak_akses.akses_id,
           
        
      },
      });
      return updatedhak_akses
}
const deletehak_aksesByIdRepo = async(id)=>{


  await prisma.hak_akses.delete({
    where: { id: id },
  });
}
module.exports={
  findhak_akses,
  findhak_aksesById,
  findHakAksesByRoleId,
  inserthak_aksesRepo,
  updatehak_aksesRepo,
  deletehak_aksesByIdRepo
}