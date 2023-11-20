const prisma = require("../db");
const { findKustom,findDetailKustom,findDetailKustomById, findKustomById, insertKustomRepo, insertDetailKustomRepo, updateDetailKustomRepo,updateKustomRepo, deleteKustomByIdRepo,deleteDetailKustomByIdRepo } = require("./kustom.repository");

const getKustom = async () => {
  const kustom = await findKustom();

  return kustom;
};

const getDetailKustom = async ()=>{
  const detailkustom = await findDetailKustom();
  return detailkustom;
};

const getKustomById = async (id) => {
  const kustom = await findKustomById(id);

  if (!kustom) {
    throw Error("kustom not found");
  }

  return kustom;
};

const getDetailKustomById = async (id) => {
  const detailkustom = await findDetailKustomById(id);

  if (!detailkustom) {
    throw Error("detail kustom not found");
  }

  return kustom;
};

const deleteDetailKustomById = async (id) => {
  await getDetailKustomById(id);
  await deleteDetailKustomByIdRepo(id)
 
};

const deleteKustomById = async (id) => {
  await getKustomById(id);
  await deleteDetailKustomByIdRepo(id)
 
};

const insertDetailKustom = async (newkustomData)=>{
  const detailkustom = await insertDetailKustomRepo(newkustomData);

  return detailkustom;
  
};
const updateDetailKustomById = async (id,updatedKustomData)=>{
  const kustom = await updateDetailKustomRepo(id,updatedKustomData);
  return kustom;
};
const insertKustom = async (newkustomData)=>{
  const kustom = await insertKustomRepo(newkustomData);

  return kustom;
  
};
const updatedKustom = async (id,updatedKustomData)=>{
  const kustom = await updateKustomRepo(id,updatedKustomData);
  return kustom;
};
module.exports = {
  getKustom,
  getDetailKustom,
  getKustomById,
  insertKustom,
  insertDetailKustom,
  updatedKustom,
  updateDetailKustomById,
  deleteKustomById,
  deleteDetailKustomById
};
