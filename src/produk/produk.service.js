const prisma = require("../db");
const { findDaftarProduk, findDaftarProdukById, insertDaftarProdukRepo, updateDaftarProdukRepo, deleteDaftarProdukByIdRepo } = require("./produk.repository");
const getDaftarProduk = async (q,kategori,outletId,  page, itemsPerPage) => {
    // Fetch all data based on search criteria
    const allDaftarProduk = await findDaftarProduk(q,outletId, kategori,page,itemsPerPage);
    // Return paginated data with pagination details
    return allDaftarProduk;

};

const getDaftarProdukById = async (id) => {
  const produk = await findDaftarProdukById(id);

  if (!produk) {
    return res.status(404).send({
      success: false,
      message: "Produk ID:"+id+"tidak ditemukan",
      data: null
    });
  }

  return produk;
};
const deleteDaftarProdukById = async (id) => {
  // await getDaftarProdukById(id);
  const produk= await deleteDaftarProdukByIdRepo(id)
 
  return produk;
};
const insertDaftarProduk = async (data)=>{
  const produk = await insertDaftarProdukRepo(data);

  return produk;
  
};
const updatedDaftarProduk = async (id,updatedDaftarProdukData)=>{
  const produk = await updateDaftarProdukRepo(id,updatedDaftarProdukData);
  return produk;
};
module.exports = {
  getDaftarProduk,
  getDaftarProdukById,
  insertDaftarProduk,
  updatedDaftarProduk,
  deleteDaftarProdukById
};
