const prisma = require("../db");
const { findLemari, findLemariById, insertLemariRepo, updateLemariRepo, deleteLemariByIdRepo } = require("./lemari.repository");
const getLemari = async (kode,page = 1, itemsPerPage = 10) => {
    // Call findLemari function with pagination parameters
    const lemari = await findLemari(kode,page, itemsPerPage);

    return lemari;
 
};

const getLemariById = async (id) => {
  const lemari = await findLemariById(id);

  if (!lemari) {
    return "Tidak ada lemari dengan id: " + id;
  }

  return lemari;
};


const deleteLemariById = async (id) => {
  // await getLemariById(id);
  const lemari = await deleteLemariByIdRepo(id)
 
  return lemari;
};
const insertLemari = async (newLemariData)=>{
  const lemari = await insertLemariRepo(newLemariData);

  return lemari;
  
};
const updatedLemari = async (id,updatedLemariData)=>{
  const lemari = await updateLemariRepo(id,updatedLemariData);
  return lemari;
};
module.exports = {
  getLemari,
  getLemariById,
  insertLemari,
  updatedLemari,
  deleteLemariById
};
