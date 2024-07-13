const prisma = require("../db");
const { findQcProduk, findQcProdukById, insertQcProdukRepo, updateQcProdukRepo, deleteQcProdukByIdRepo } = require("./qc_produk.repository");

const getQcProduk = async () => {
  const qc_produk = await findQcProduk();

  return qc_produk;
};


const getQcProdukById = async (id) => {
  const qc_produk = await findQcProdukById(id);

  if (!qc_produk) {
    throw Error("produk not found");
  }

  return qc_produk;
};
const deleteQcProdukById = async (id) => {
  await getQcProdukById(id);
  await deleteQcProdukByIdRepo(id)
 
};
const insertQcProduk = async (newprodukData)=>{
  const qc_produk = await insertQcProdukRepo(newprodukData);

  return qc_produk;
  
};
const updatedQcProduk = async (id,updatedQcProdukData)=>{
  const qc_produk = await updateQcProdukRepo(id,updatedQcProdukData);
  return qc_produk;
};
module.exports = {
  getQcProduk,
  getQcProdukById,
  insertQcProduk,
  updatedQcProduk,
  deleteQcProdukById
};
