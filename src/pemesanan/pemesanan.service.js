const prisma = require("../db");
const { findbahan, findbahanById, insertbahanRepo, updatebahanRepo, deletebahanByIdRepo } = require("./pemesanan.repository");

const getbahans = async () => {
  const pemesanan = await findbahan();

  return pemesanan;
};


const getbahanById = async (id) => {
  const pemesanan = await findbahanById(id);

  if (!pemesanan) {
    throw Error("bahan not found");
  }

  return pemesanan;
};
const deletebahanById = async (id) => {
  await getbahanById(id);
  await deletebahanByIdRepo(id)
 
};
const insertbahan = async (newbahanData)=>{
  const pemesanan = await insertbahanRepo(newbahanData);

  return pemesanan;
  
};
const updatedbahan = async (id,updatedbahanData)=>{
  const pemesanan = await updatebahanRepo(id,updatedbahanData);
  return pemesanan;
};
module.exports = {
  getbahans,
  getbahanById,
  insertbahan,
  updatedbahan,
  deletebahanById
};
