const prisma = require("../db");
const { findQcBahan, findQcBahanById, insertQcBahanRepo, updateQcBahanRepo, deleteQcBahanByIdRepo } = require("./qc_bahan.repository");

const getQcBahan = async () => {
  const qc_bahan = await findQcBahan();

  return qc_bahan;
};


const getQcBahanById = async (id) => {
  const qc_bahan = await findQcBahanById(id);

  if (!qc_bahan) {
    throw Error("produk not found");
  }

  return qc_bahan;
};
const deleteQcBahanById = async (id) => {
  await getQcBahanById(id);
  await deleteQcBahanByIdRepo(id)
 
};
const insertQcBahan = async (newprodukData)=>{
  const qc_bahan = await insertQcBahanRepo(newprodukData);

  return qc_bahan;
  
};
const updatedQcBahan = async (id,updatedQcBahanData)=>{
  const qc_bahan = await updateQcBahanRepo(id,updatedQcBahanData);
  return qc_bahan;
};
module.exports = {
  getQcBahan,
  getQcBahanById,
  insertQcBahan,
  updatedQcBahan,
  deleteQcBahanById
};
