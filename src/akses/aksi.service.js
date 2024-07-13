const prisma = require("../db");
const { findakses, findaksesById, insertaksesRepo, updateaksesRepo, deleteaksesByIdRepo } = require("./akses.repository");

const getaksess = async () => {
  const akses = await findakses();

  return akses;
};


const getaksesById = async (id) => {
  const akses = await findaksesById(id);

  if (!akses) {
    throw Error("akses not found");
  }

  return akses;
};
const deleteaksesById = async (id) => {
  await getaksesById(id);
  await deleteaksesByIdRepo(id)
 
};
const insertakses = async (newaksesData)=>{
  const akses = await insertaksesRepo(newaksesData);

  return akses;
  
};
const updatedakses = async (id,updatedaksesData)=>{
  const akses = await updateaksesRepo(id,updatedaksesData);
  return akses;
};
module.exports = {
  getaksess,
  getaksesById,
  insertakses,
  updatedakses,
  deleteaksesById
};
