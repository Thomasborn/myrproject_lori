const prisma = require("../db");
const { findDaftarProduk, findDaftarProdukById, insertDaftarProdukRepo, updateDaftarProdukRepo, deleteDaftarProdukByIdRepo } = require("./daftar_produk.repository");
const getDaftarProduk = async (searchCriteria, page, itemsPerPage) => {
  try {
    // Fetch all data based on search criteria
    const allDaftarProduk = await findDaftarProduk(searchCriteria,page,itemsPerPage);
    // Return paginated data with pagination details
    return allDaftarProduk;
  } catch (error) {
    throw new Error("Error getting daftar_produk");
  }
};

const getDaftarProdukById = async (id) => {
  const daftar_produk = await findDaftarProdukById(id);

  if (!daftar_produk) {
    throw Error("produk not found");
  }

  return daftar_produk;
};
const deleteDaftarProdukById = async (id) => {
  // await getDaftarProdukById(id);
  const produk= await deleteDaftarProdukByIdRepo(id)
 
  return produk;
};
const insertDaftarProduk = async (data)=>{
  const daftar_produk = await insertDaftarProdukRepo(data);

  return daftar_produk;
  
};
const updatedDaftarProduk = async (id,updatedDaftarProdukData)=>{
  const daftar_produk = await updateDaftarProdukRepo(id,updatedDaftarProdukData);
  return daftar_produk;
};
module.exports = {
  getDaftarProduk,
  getDaftarProdukById,
  insertDaftarProduk,
  updatedDaftarProduk,
  deleteDaftarProdukById
};
