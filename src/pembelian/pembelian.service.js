const prisma = require("../db");
const { findbahan, findbahanById, insertbahanRepo, updatebahanRepo, deletebahanByIdRepo } = require("./pembelian.repository");

const getbahans = async () => {
  const pembelian = await findbahan();

  return pembelian;
};


const getbahanById = async (id) => {
  const pembelian = await findbahanById(id);

  if (!pembelian) {
    throw Error("bahan not found");
  }

  return pembelian;
};
const deletebahanById = async (id) => {
  await getbahanById(id);
  await deletebahanByIdRepo(id)
 
};
const insertbahan = async (newbahanData)=>{
  const pembelian = await insertbahanRepo(newbahanData);

  return pembelian;
  
};
const updatedbahan = async (id,updatedbahanData)=>{
  const pembelian = await updatebahanRepo(id,updatedbahanData);
  return pembelian;
};
module.exports = {
  getbahans,
  getbahanById,
  insertbahan,
  updatedbahan,
  deletebahanById
};
