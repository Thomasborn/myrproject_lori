const prisma = require("../db");
const { findLemari, findLemariById, insertLemariRepo, updateLemariRepo, deleteLemariByIdRepo } = require("./lemari.repository");

const getLemari = async () => {
  const lemari = await findLemari();

  return lemari;
};


const getLemariById = async (id) => {
  const lemari = await findLemariById(id);

  if (!lemari) {
    throw Error("Lemari not found");
  }

  return lemari;
};
const deleteLemariById = async (id) => {
  await getLemariById(id);
  await deleteLemariByIdRepo(id)
 
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
