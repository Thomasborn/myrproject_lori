const prisma = require("../db");
const { findkaryawan, findkaryawanById, insertkaryawanRepo, updatekaryawanRepo, deletekaryawanByIdRepo } = require("./karyawan.repository");

const getkaryawans = async (searchCriteria, page, pageSize) => {
  const karyawan = await findkaryawan(searchCriteria, page, pageSize);

  return karyawan;
};


const getkaryawanById = async (id) => {
  const karyawan = await findkaryawanById(id);

  if (!karyawan) {
    throw Error("karyawan tidak ditemukan");
  }

  return karyawan;
};
const deletekaryawanById = async (id) => {
  await getkaryawanById(id);
  const karyawan = await deletekaryawanByIdRepo(id)
 
  return karyawan;
};
const insertkaryawan = async (newkaryawanData)=>{
  const karyawan = await insertkaryawanRepo(newkaryawanData);

  return karyawan;
  
};
const updatedkaryawan = async (id,updatedkaryawanData)=>{
  const karyawan = await updatekaryawanRepo(id,updatedkaryawanData);
  return karyawan;
};
module.exports = {
  getkaryawans,
  getkaryawanById,
  insertkaryawan,
  updatedkaryawan,
  deletekaryawanById
};
