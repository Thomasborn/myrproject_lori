const prisma = require("../db");
const { findkaryawan, findkaryawanById, insertkaryawanRepo, updatekaryawanRepo, deletekaryawanByIdRepo } = require("./karyawan.repository");

const getkaryawans = async () => {
  const karyawan = await findkaryawan();

  return karyawan;
};


const getkaryawanById = async (id) => {
  const karyawan = await findkaryawanById(id);

  if (!karyawan) {
    throw Error("karyawan not found");
  }

  return karyawan;
};
const deletekaryawanById = async (id) => {
  await getkaryawanById(id);
  await deletekaryawanByIdRepo(id)
 
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
