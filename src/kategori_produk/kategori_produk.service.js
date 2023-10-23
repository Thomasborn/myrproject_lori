const prisma = require("../db");
const { findProduk, findProdukById, insertProdukRepo, updateProdukRepo, deleteprodukByIdRepo } = require("./kategori_produk.repository");

const getProduks = async () => {
  const kategori_produk = await findProduk();

  return kategori_produk;
};


const getProdukById = async (id) => {
  const kategori_produk = await findProdukById(id);

  if (!kategori_produk) {
    throw Error("produk not found");
  }

  return kategori_produk;
};
const deleteprodukById = async (id) => {
  await getProdukById(id);
  await deleteprodukByIdRepo(id)
 
};
const insertProduk = async (newprodukData)=>{
  const kategori_produk = await insertProdukRepo(newprodukData);

  return kategori_produk;
  
};
const updatedProduk = async (id,updatedProdukData)=>{
  const kategori_produk = await updateProdukRepo(id,updatedProdukData);
  return kategori_produk;
};
module.exports = {
  getProduks,
  getProdukById,
  insertProduk,
  updatedProduk,
  deleteprodukById
};
