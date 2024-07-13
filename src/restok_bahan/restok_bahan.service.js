const prisma = require("../db");
const { findRestokBahan, findRestokBahanById, insertRestokBahanRepo, updateRestokBahanRepo, deleteRestokBahanByIdRepo } = require("./restok_bahan.repository");

const getRestokBahan = async () => {
  const restok_bahan = await findRestokBahan();

  return restok_bahan;
};


const getRestokBahanById = async (id) => {
  const restok_bahan = await findRestokBahanById(id);

  if (!restok_bahan) {
    throw Error("RestokBahan not found");
  }

  return restok_bahan;
};
const deleteRestokBahanById = async (id) => {
  await getRestokBahanById(id);
  await deleteRestokBahanByIdRepo(id)
 
};
const insertRestokBahan = async (newRestokBahanData)=>{
  const restok_bahan = await insertRestokBahanRepo(newRestokBahanData);

  return restok_bahan;
  
};
const updatedRestokBahan = async (id,updatedRestokBahanData)=>{
  const restok_bahan = await updateRestokBahanRepo(id,updatedRestokBahanData);
  return restok_bahan;
};
module.exports = {
  getRestokBahan,
  getRestokBahanById,
  insertRestokBahan,
  updatedRestokBahan,
  deleteRestokBahanById
};
