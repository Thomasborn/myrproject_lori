const prisma = require("../db");
const { findProduk, findProdukById, insertProdukRepo, updateProdukRepo, deleteprodukByIdRepo } = require("./pengecekan.repository");

const getProduks = async () => {
  const pengecekan = await findProduk();

  return pengecekan;
};


const getProdukById = async (id) => {
  const pengecekan = await findProdukById(id);

  if (!pengecekan) {
    throw Error("produk not found");
  }

  return pengecekan;
};
const deleteprodukById = async (id) => {
  await getProdukById(id);
  await deleteprodukByIdRepo(id)
 
};
const insertProduk = async (newprodukData)=>{
  const pengecekan = await insertProdukRepo(newprodukData);

  return pengecekan;
  
};
const updatedProduk = async (id,updatedProdukData)=>{
  const pengecekan = await updateProdukRepo(id,updatedProdukData);
  return pengecekan;
};
module.exports = {
  getProduks,
  getProdukById,
  insertProduk,
  updatedProduk,
  deleteprodukById
};
