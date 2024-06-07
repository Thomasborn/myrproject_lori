const prisma = require("../db");
const { findGawangan,findDetailGawangan,findDetailGawanganById, findGawanganById, insertGawanganRepo, insertDetailGawanganRepo, updateDetailGawanganRepo,updateGawanganRepo, deletegawanganByIdRepo,deleteDetailGawanganByIdRepo,deleteGawanganByIdRepo } = require("./gawangan.repository");
const getGawangan = async (searchCriteria = {}, page = 1, itemsPerPage = 10) => {
  const gawangan = await findGawangan(searchCriteria, page, itemsPerPage);

  return gawangan;
};


const getDetailGawangan = async ()=>{
  const detailGawangan = await findDetailGawangan();
  return detailGawangan;
};

const getgawanganById = async (id) => {
  const gawangan = await findGawanganById(id);

  if (!gawangan) {
    throw Error("gawangan not found");
  }

  return gawangan;
};

const getDetailGawanganById = async (id) => {
  const detailGawangan = await findDetailGawanganById(id);

  if (!detailGawangan) {
    throw Error("detail gawangan not found");
  }

  return gawangan;
};

const deteleteDetailGawanganById = async (id) => {
  await getDetailGawanganById(id);
  await deleteGawanganByIdRepo(id)
 
};

const deletegawanganById = async (id) => {
  await getgawanganById(id);
 const gawangan= await deleteGawanganByIdRepo(id)
 return gawangan;
};

const insertDetailGawangan = async (newgawanganData)=>{
  const detailGawangan = await insertDetailGawanganRepo(newgawanganData);

  return detailGawangan;
  
};
const updatedDetailGawangan = async (id,updatedgawanganData)=>{
  const gawangan = await updateDetailGawanganRepo(id,updatedgawanganData);
  return gawangan;
};
const insertgawangan = async (newgawanganData)=>{
  const gawangan = await insertGawanganRepo(newgawanganData);

  return gawangan;
  
};
const updatedgawangan = async (id,updatedgawanganData)=>{
  const gawangan = await updateGawanganRepo(id,updatedgawanganData);
  return gawangan;
};
module.exports = {
  getGawangan,
  getDetailGawangan,
  getgawanganById,
  insertgawangan,
  insertDetailGawangan,
  updatedgawangan,
  updatedDetailGawangan,
  deletegawanganById,
  deteleteDetailGawanganById
};
