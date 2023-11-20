const prisma = require("../db");
const { findQcProduksi, findQcProduksiById, insertQcProduksiRepo, updateQcProduksiRepo, deleteProduksiByIdRepo } = require("./qc_produksi.repository");

const getQcProduksi = async () => {
  const qc_produksi = await findQcProduksi();

  return qc_produksi;
};


const getQcProduksiById = async (id) => {
  const qc_produksi = await findQcProduksiById(id);

  if (!qc_produksi) {
    throw Error("produk not found");
  }

  return qc_produksi;
};
const deleteQcProduksiById = async (id) => {
  await getQcProduksiById(id);
  await deleteProduksiByIdRepo(id)
 
};
const insertQcProduksi = async (newprodukData)=>{
  const qc_produksi = await insertQcProduksiRepo(newprodukData);

  return qc_produksi;
  
};
const updatedQcProduksi = async (id,updatedQcProduksiData)=>{
  const qc_produksi = await updateQcProduksiRepo(id,updatedQcProduksiData);
  return qc_produksi;
};
module.exports = {
  getQcProduksi,
  getQcProduksiById,
  insertQcProduksi,
  updatedQcProduksi,
  deleteQcProduksiById
};
