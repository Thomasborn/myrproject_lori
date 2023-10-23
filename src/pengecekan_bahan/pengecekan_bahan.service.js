const prisma = require("../db");
const { findbahan, findbahanById, insertbahanRepo, updatebahanRepo, deletebahanByIdRepo } = require("./pengecekan_bahan.repository");

const getbahans = async () => {
  const pengecekan = await findbahan();

  return pengecekan;
};


const getbahanById = async (id) => {
  const pengecekan = await findbahanById(id);

  if (!pengecekan) {
    throw Error("bahan not found");
  }

  return pengecekan;
};
const deletebahanById = async (id) => {
  await getbahanById(id);
  await deletebahanByIdRepo(id)
 
};
const insertbahan = async (newbahanData)=>{
  const pengecekan = await insertbahanRepo(newbahanData);

  return pengecekan;
  
};
const updatedbahan = async (id,updatedbahanData)=>{
  const pengecekan = await updatebahanRepo(id,updatedbahanData);
  return pengecekan;
};
module.exports = {
  getbahans,
  getbahanById,
  insertbahan,
  updatedbahan,
  deletebahanById
};
