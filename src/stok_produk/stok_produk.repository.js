
const prisma = require("../db");

const findStokProduk = async () => {
  const stok_produk = await prisma.stok_produk.findMany();

  return stok_produk;
};

const findStokProdukByDaftarProdukId = async (id) => {
  const stok_produk = await prisma.stok_produk.findFirst({
    where: {
      daftar_produk:{
       id:parseInt(id),

      }
    },
  });
  
  return stok_produk;
};
const findStokProdukByDaftarProdukLemariId = async (daftar_produk_id,lemari_id) => {
  const stok_produk = await prisma.stok_produk.findFirst({
    where: {
      daftar_produk:{
       id:parseInt(daftar_produk_id),

      },
      lemari:{
        id:parseInt(lemari_id)
      }
    },
  });
  
  return stok_produk;
};
const findStokProdukById = async (id) => {
  const stok_produk = await prisma.stok_produk.findUnique({
    where: {
      id,
    },
  });
  
  return stok_produk;
};
const insertStokProdukRepo = async (newstokData) => {
  const {stok_produk,jumlah,daftar_produk_id,lemari_id}=newstokData;
  const insertStokProduk = await prisma.stok_produk.upsert({
    where: {
     id:stok_produk.id
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
      daftar_produk: {
        connect: {
          id: parseInt(daftar_produk_id),
        },
      },
      lemari: {
        connect: {
          id: parseInt(lemari_id),
        },
      },
    },
  });
  return insertStokProduk
}
const updatestokProdukRepo = async (id,updatedstokData) => {
        const existingstok = await prisma.stok_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingstok) {
            return res.status(404).json({ error: "stok_produk not found" });
      }

      // Validate and update the stok_produk data
      const updatedstok = await prisma.stok_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed

          stok: updatedstokData.jumlah || existingstok.jumlah,
          daftar_produk_id: updatedstokData.daftar_produk_id || existingstok.daftar_produk_id,
          lemari_id: parseFloat(updatedstokData.lemari_id) || existingstok.lemari_id,

      },
      });
      return updatedstok
}
const deleteStokProdukByIdRepo = async(id)=>{
  await prisma.stok_produk.delete({
    where: { id: id },
  });
}
module.exports={
   findStokProduk, findStokProdukById,findStokProdukByDaftarProdukId, findStokProdukByDaftarProdukLemariId,insertStokProdukRepo, updatestokProdukRepo, deleteStokProdukByIdRepo
}