const prisma = require("../db");
const { findPenjualan,findDetailPenjualan,findDetailPenjualanById, findPenjualanById, insertPenjualanRepo, insertDetailPenjualanRepo, updateDetailPenjualanRepo,updatePenjualanRepo, deletePenjualanByIdRepo,deleteDetailPenjualanByIdRepo, insertFullPenjualan } = require("./penjualan.repository");

const getPenjualan = async () => {
  const penjualan = await findPenjualan();

  return penjualan;
};

const getDetailPenjualan = async ()=>{
  const detailPenjualan = await findDetailPenjualan();
  return detailPenjualan;
};

const getPenjualanById = async (id) => {
  const penjualan = await findPenjualanById(id);

  if (!penjualan) {
    throw Error("penjualan not found");
  }

  return penjualan;
};

const getDetailPenjualanById = async (id) => {
  const detailPenjualan = await findDetailPenjualanById(id);

  if (!detailPenjualan) {
    throw Error("detail penjualan not found");
  }

  return detailPenjualan;
};

const deleteDetailPenjualanById = async (id) => {
  await getDetailPenjualanById(id);
  await deleteDetailPenjualanByIdRepo(id)
 
};

const deletePenjualanById = async (id) => {
  await getPenjualanById(id);
  await deletePenjualanByIdRepo(id)
 
};

const insertDetailPenjualan = async (newPenjualanData)=>{
  const detailPenjualan = await insertDetailPenjualanRepo(newPenjualanData);

  return detailPenjualan;
  
};
const updateDetailPenjualanById = async (id,updatedPenjualanData)=>{
  const penjualan = await updateDetailPenjualanRepo(id,updatedPenjualanData);
  return penjualan;
};
const insertPenjualan = async (newPenjualanData)=>{
  const penjualan = await insertFullPenjualan(newPenjualanData);

  return penjualan;
  
};
const updatePenjualan = async (id,updatedPenjualanData)=>{
  const penjualan = await updatePenjualanRepo(id,updatedPenjualanData);
  return penjualan;
};
module.exports = {
  getPenjualan,
  getDetailPenjualan,
  getPenjualanById,
  getDetailPenjualanById,
  insertPenjualan,
  insertDetailPenjualan,
  updatePenjualan,
  updateDetailPenjualanById,
  deletePenjualanById,
  deleteDetailPenjualanById
};
