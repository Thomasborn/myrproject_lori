const prisma = require("../db");
const { findgawangan, findgawanganById, insertgawanganRepo, updategawanganRepo, deletegawanganByIdRepo } = require("./gawangan.repository");

const getgawangans = async () => {
  const gawangan = await findgawangan();

  return gawangan;
};


const getgawanganById = async (id) => {
  const gawangan = await findgawanganById(id);

  if (!gawangan) {
    throw Error("gawangan not found");
  }

  return gawangan;
};
const deletegawanganById = async (id) => {
  await getgawanganById(id);
  await deletegawanganByIdRepo(id)
 
};
const insertgawangan = async (newgawanganData)=>{
  const gawangan = await insertgawanganRepo(newgawanganData);

  return gawangan;
  
};
const updatedgawangan = async (id,updatedgawanganData)=>{
  const gawangan = await updategawanganRepo(id,updatedgawanganData);
  return gawangan;
};
module.exports = {
  getgawangans,
  getgawanganById,
  insertgawangan,
  updatedgawangan,
  deletegawanganById
};
