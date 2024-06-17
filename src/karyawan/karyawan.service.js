const prisma = require("../db");
const { findkaryawan, findkaryawanById, insertKaryawanRepo, updatekaryawanRepo, deleteKaryawanByIdRepo } = require("./karyawan.repository");

const getKaryawan = async (q, posisi, status, gender, sortBy,  page, itemsPerPage) => {
  const karyawan = await findkaryawan(q, posisi, status, gender, sortBy,  page, itemsPerPage);

  return karyawan;
};


const getKaryawanById = async (id) => {
  const karyawan = await findkaryawanById(id);

  if (!karyawan) {
    throw Error("karyawan tidak ditemukan");
  }

  return karyawan;
};
const deleteKaryawanById = async (id) => {
  await getkaryawanById(id);
  const karyawan = await deleteKaryawanByIdRepo(id)
 
  return karyawan;
};
const insertKaryawan = async (newkaryawanData)=>{
  const karyawan = await insertKaryawanRepo(newkaryawanData);

  return karyawan;
  
};
const updatedKaryawan = async (id,updatedKaryawanData)=>{
  const karyawan = await updatekaryawanRepo(id,updatedKaryawanData);
  return karyawan;
};
module.exports = {
  getKaryawan,
  getKaryawanById,
  insertKaryawan,
  updatedKaryawan,
  deleteKaryawanById
};
