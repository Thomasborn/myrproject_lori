const prisma = require("../db");
const { findProduk, findProdukById, insertProdukRepo, updateProdukRepo, deleteprodukByIdRepo } = require("./produk_item.repository");

const getProduks = async () => {
  const produk_Item = await findProduk();

  return produk_Item;
};


const getProdukById = async (id) => {
  const produk_Item = await findProdukById(id);

  if (!produk_Item) {
    throw Error("produk not found");
  }

  return produk_Item;
};
const deleteprodukById = async (id) => {
  await getProdukById(id);
  await deleteprodukByIdRepo(id)
 
};
const insertProduk = async (newprodukData)=>{
  const produk_Item = await insertProdukRepo(newprodukData);

  return produk_Item;
  
};
const updatedProduk = async (id,updatedProdukData)=>{
  const produk_Item = await updateProdukRepo(id,updatedProdukData);
  return produk_Item;
};
module.exports = {
  getProduks,
  getProdukById,
  insertProduk,
  updatedProduk,
  deleteprodukById
};
