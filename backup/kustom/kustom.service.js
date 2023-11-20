const prisma = require("../../src/db");
const { findKustom, findKustomById, insertKustomRepo, updateKustomRepo, deleteKustomByIdRepo } = require("./kustom_Kustom.repository");

const getKustoms = async () => {
  const kustom = await findKustom();

  return kustom;
};


const getKustomById = async (id) => {
  const kustom = await findKustomById(id);

  if (!kustom) {
    throw Error("Kustom not found");
  }

  return kustom;
};
const deleteKustomById = async (id) => {
  await getKustomById(id);
  await deleteKustomByIdRepo(id)
 
};
const insertKustom = async (newKustomData)=>{
  const kustom = await insertKustomRepo(newKustomData);

  return kustom;
  
};
const updatedKustom = async (id,updatedKustomData)=>{
  const kustom = await updateKustomRepo(id,updatedKustomData);
  return kustom;
};
module.exports = {
  getKustoms,
  getKustomById,
  insertKustom,
  updatedKustom,
  deleteKustomById
};
