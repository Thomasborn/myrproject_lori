const prisma = require("../db");
const { findDaftarProduk, findDaftarProdukById, insertDaftarProdukRepo, updateDaftarProdukRepo, deleteDaftarProdukByIdRepo } = require("./daftar_produk.repository");

const getDaftarProduk = async () => {
  const daftar_produk = await findDaftarProduk();

  return daftar_produk;
};


const getDaftarProdukById = async (id) => {
  const daftar_produk = await findDaftarProdukById(id);

  if (!daftar_produk) {
    throw Error("produk not found");
  }

  return daftar_produk;
};
const deleteDaftarProdukById = async (id) => {
  await getDaftarProdukById(id);
  await deleteDaftarProdukByIdRepo(id)
 
};
const insertDaftarProduk = async (sku,detail_model_produk_id)=>{
  const daftar_produk = await insertDaftarProdukRepo(sku,detail_model_produk_id);

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
