const prisma = require("../db");

const { findProduk, findProduksiById, insertProduksiRepo, updateProduksiRepo, deleteproduksiByIdRepo } = require("./produksi.repository");
const getProduksi = async (query) => {
  const produksi = await findProduk(query);

  return produksi;
};


const getProduksiById = async (id) => {
  const produksi = await findProduksiById(id);

  if (!produksi) {
    throw Error("produk not found");
  }

  return produksi;
};
const deleteproduksiById = async (id) => {
const produksi=  await deleteproduksiByIdRepo(id)
 return produksi;
};
const insertProduksi = async (newprodukData)=>{
  const produksi = await insertProduksiRepo(newprodukData);

  return produksi;
  
};
const updatedProduksi = async (id,updatedProdukData)=>{
  const produksi = await updateProduksiRepo(id,updatedProdukData);
  return produksi;
};
module.exports = {
  getProduksi,
  getProduksiById,
  insertProduksi,
  updatedProduksi,
  deleteproduksiById
};
