
const prisma = require("../db");

const findDiskon = async () => {
  const diskon = await prisma.diskon.findMany();

  return diskon;
};

const findDiskonById = async (id) => {
  const diskon = await prisma.diskon.findUnique({
    where: {
      id,
    },
  });
  
  return diskon;
};

const findDetailDiskon = async () => {
  const detaildiskon = await prisma.detail_diskon_bahan.findMany();

  return detaildiskon;
};

const findDetailDiskonById = async (id) => {
  const detaildiskon = await prisma.detail_diskon_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return detaildiskon;
};
const insertDiskonRepo = async (newdiskonData) => {
  
  const { nama, tipe, jumlah, tanggal_selesai, tanggal_mulai } = newdiskonData;

  // Perform the insert operation using Prisma
  const insertedDiskon = await prisma.diskon.create({
    data: { nama, tipe, jumlah, tanggal_selesai, tanggal_mulai },
  });
  return insertedDiskon
};
const insertDetailDiskonRepo = async (newdiskonData) => {
  
  const {
    diskon_id,
    daftar_produk_id,
    penjualan_id,
  } = newdiskonData;

  const insertedDetailDiskon = await prisma.detail_diskon.create({
    data: {
      diskon_id,
      daftar_produk_id,
      penjualan_id,
    },
  });
  return insertedDetailDiskon;
}
const updateDiskonRepo = async (id,updateddiskonData) => {
        const existingdiskon = await prisma.diskon.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingdiskon) {
            return res.status(404).json({ error: "diskon not found" });
      }

      // Validate and update the diskon data
      const updateddiskon = await prisma.diskon.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updateddiskonData.kategori || existingdiskon.kategori.kategori
        
      },
      });;
      return updateddiskon;
};

const updateDetailDiskonRepo = async (id,updateddiskonData) => {
        const existingDetaildiskon = await prisma.detail_diskon_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingDetaildiskon) {
            return ({ error: "detail diskon not found" });
      }

      // Validate and update the diskon data
      const updatedDetaildiskon = await prisma.detail_diskon_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          daftar_produk_id: updateddiskonData.daftar_produk_id || existingDetaildiskon.daftar_produk_id,
          diskon_id: updateddiskonData.diskon_id || existingDetaildiskon.diskon_id
        
      },
      });
      return updatedDetaildiskon
}
const deleteDiskonByIdRepo = async(id)=>{
  await prisma.diskon.delete({
    where: { id: id },
  });
}

const deleteDetailDiskonByIdRepo = async(id)=>{
  await prisma.detail_diskon_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findDiskon,findDetailDiskon,findDetailDiskonById, findDiskonById, insertDiskonRepo, insertDetailDiskonRepo, updateDiskonRepo,updateDetailDiskonRepo, deleteDiskonByIdRepo,deleteDetailDiskonByIdRepo 
}