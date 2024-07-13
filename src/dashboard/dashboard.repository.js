
const prisma = require("../db");

const findProduk = async () => {
  const kategori_produk = await prisma.kategori_produk.findMany();

  return kategori_produk;
};

const findProdukById = async (id) => {
  const kategori_produk = await prisma.kategori_produk.findUnique({
    where: {
      id,
    },
  });
  
  return kategori_produk;
};
const insertProdukRepo = async (newprodukData) => {
  
  const nama = newprodukData.nama;
  const tipe = newprodukData.tipe;
  const kategori_produk = await prisma.kategori_produk.create({
    data: {
      nama,
      tipe: ""|| tipe,

      },
  });
  return kategori_produk
}
const updateProdukRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.kategori_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "kategori_produk not found" });
      }

      // Validate and update the kategori_produk data
      const updatedProduk = await prisma.kategori_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedProdukData.kategori || existingProduk.kategori.kategori
        
      },
      });
      return updatedProduk
}
const deleteprodukByIdRepo = async(id)=>{
  await prisma.kategori_produk.delete({
    where: { id: id },
  });
}
module.exports={
  findProduk,
  findProdukById,
  insertProdukRepo,
  updateProdukRepo,
  deleteprodukByIdRepo
}