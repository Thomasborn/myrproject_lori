
const prisma = require("../db");

const findStokBahan = async () => {
  const stok_bahan = await prisma.stok_bahan.findMany();

  return stok_bahan;
};

const findStokBahanByDaftarBahanId = async (id) => {
  const stok_bahan = await prisma.stok_bahan.findFirst({
    where: {
      daftar_bahan:{
       id:parseInt(id),

      }
    },
  });
  
  return stok_bahan;
};
const findStokBahanById = async (id) => {
  const stok_bahan = await prisma.stok_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return stok_bahan;
};
const insertstokBahanRepo = async (newstokData) => {
  const {stok_bahan,jumlah,daftar_bahan_id,lemari_id}=newstokData;
  const insertStokBahan = await prisma.stok_bahan.upsert({
    where: {
     id:stok_bahan.id
    },
    update: {
      // Define the fields to update
      stok: {
        increment: +jumlah,
      },
    },
    create: {
      // Define the fields for creating a new record if it doesn't exist
      stok: +jumlah,
      daftar_bahan: {
        connect: {
          id: parseInt(daftar_bahan_id),
        },
      },
      lemari: {
        connect: {
          id: parseInt(lemari_id),
        },
      },
    },
  });
  return insertStokBahan
}
const updatestokBahanRepo = async (id,updatedstokData) => {
        const existingstok = await prisma.stok_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingstok) {
            return res.status(404).json({ error: "stok_bahan not found" });
      }

      // Validate and update the stok_bahan data
      const updatedstok = await prisma.stok_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed

          stok: updatedstokData.jumlah || existingstok.jumlah,
          daftar_bahan_id: updatedstokData.daftar_bahan_id || existingstok.daftar_bahan_id,
          lemari_id: parseFloat(updatedstokData.lemari_id) || existingstok.lemari_id,

      },
      });
      return updatedstok
}
const deletestokBahanByIdRepo = async(id)=>{
  await prisma.stok_bahan.delete({
    where: { id: id },
  });
}
module.exports={
   findStokBahan, findStokBahanById,findStokBahanByDaftarBahanId, insertstokBahanRepo, updatestokBahanRepo, deletestokBahanByIdRepo
}