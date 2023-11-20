
const prisma = require("../db");

const findDaftarProduk = async () => {
  const daftar_produk = await prisma.daftar_produk.findMany();

  return daftar_produk;
};

const findDaftarProdukById = async (id) => {
  const daftar_produk = await prisma.daftar_produk.findUnique({
    where: {
      id,
    },
  });
  
  return daftar_produk;
};
const findDaftarProdukBySku = async (sku) => {
  const daftar_produk = await prisma.daftar_produk.findUnique({
    where: {
      sku:sku,
    },
  });
  
  return daftar_produk;
};
const insertDaftarProdukRepo = async (sku,detail_model_produk_id) => {
  
  
  const daftar_produk = await prisma.daftar_produk.create({
    data: {
      sku,
      detail_model_produk: {
        connect: {
          id: parseInt(detail_model_produk_id),
        },
      },
    },
  });
  return daftar_produk
}
const updateDaftarProdukRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.daftar_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "daftar_produk not found" });
      }

      // Validate and update the daftar_produk data
      const updatedProduk = await prisma.daftar_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedProdukData.kategori || existingProduk.kategori.kategori
        
      },
      });
      return updatedProduk
}
const deleteDaftarProdukByIdRepo = async(id)=>{
  await prisma.daftar_produk.delete({
    where: { id: id },
  });
}
module.exports={
  findDaftarProduk,
  findDaftarProdukById,
  findDaftarProdukBySku,
  insertDaftarProdukRepo,
  updateDaftarProdukRepo,
  deleteDaftarProdukByIdRepo
}