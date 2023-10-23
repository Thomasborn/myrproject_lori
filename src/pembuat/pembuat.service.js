const prisma = require("../db");
const { findProduk, findProdukById, insertProdukRepo, updateProdukRepo, deleteprodukByIdRepo } = require("./pembuat.repository");

const getProduks = async () => {
  const pembuat = await findProduk();

  return pembuat;
};


const getProdukById = async (id) => {
  const pembuat = await findProdukById(id);

  if (!pembuat) {
    throw Error("produk not found");
  }

  return pembuat;
};
const deleteprodukById = async (id) => {
  await getProdukById(id);
  await deleteprodukByIdRepo(id)
 
};
const insertProduk = async (newprodukData)=>{
  const pembuat = await insertProdukRepo(newprodukData);

  return pembuat;
  
};
const updatedProduk = async (id,updatedProdukData)=>{
  const pembuat = await updateProdukRepo(id,updatedProdukData);
  return pembuat;
};
module.exports = {
  getProduks,
  getProdukById,
  insertProduk,
  updatedProduk,
  deleteprodukById
};
