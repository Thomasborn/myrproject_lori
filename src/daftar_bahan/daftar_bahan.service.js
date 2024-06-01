const prisma = require("../db");
const { findBahan, findBahanById, insertBahanRepo, updateBahanRepo, deleteBahanByIdRepo } = require("./daftar_bahan.repository");
const getBahan = async (kategori, page = 1, pageSize = 10) => {
    // Calculate pagination offsets
    const offset = (page - 1) * pageSize;

    // Fetch materials based on category and pagination parameters
    const daftar_bahan = await findBahan(kategori, offset, pageSize);

    return daftar_bahan;

};



const getBahanById = async (id) => {
  const daftar_bahan = await findBahanById(id);

  if (!daftar_bahan) {
    throw Error("Bahan not found");
  }

  return daftar_bahan;
};
const deleteBahanById = async (id) => {
  await getBahanById(id);
  await deleteBahanByIdRepo(id)
 
};
const insertBahan = async (newBahanData)=>{
  const daftar_bahan = await insertBahanRepo(newBahanData);

  return daftar_bahan;
  
};
const updatedBahan = async (id,updatedBahanData)=>{
  const daftar_bahan = await updateBahanRepo(id,updatedBahanData);
  return daftar_bahan;
};
module.exports = {
  getBahan,
  getBahanById,
  insertBahan,
  updatedBahan,
  deleteBahanById
};
