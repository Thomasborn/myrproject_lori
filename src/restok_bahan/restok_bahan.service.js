const prisma = require("../db");
const { findRestokBahan, findRestokBahanById, insertRestokBahanRepo, updateRestokBahanRepo, deleteRestokBahanByIdRepo } = require("./restok_bahan.repository");
const getRestokBahan = async (queryParams) => {
  const restok_bahan = await findRestokBahan(queryParams);
  return restok_bahan;
};


const getRestokBahanById = async (id) => {
  const restok_bahan = await findRestokBahanById(id);

  if (!restok_bahan) {
    throw Error("RestokBahan not found");
  }

  return restok_bahan;
};
const deleteRestokBahanById = async (id) => {
  try {
    // Optionally, if you want to validate the restok_bahan's existence before deletion,
    // you can uncomment the line below and handle the case where it doesn't exist.
    // await getRestokBahanById(id);

    const restok_bahan = await deleteRestokBahanByIdRepo(id);
    if (restok_bahan.success) {
      return { success: true, message: restok_bahan.message };
    } else {
      return { success: false, message: restok_bahan.message };
    }
  } catch (error) {
    console.error('Error deleting restok_bahan:', error);
    return { success: false, message: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' };
  }
};
const insertRestokBahan = async (newRestokBahanData)=>{
  const restok_bahan = await insertRestokBahanRepo(newRestokBahanData);

  return restok_bahan;
  
};
const updatedRestokBahan = async (id,updatedRestokBahanData)=>{
  const restok_bahan = await updateRestokBahanRepo(id,updatedRestokBahanData);
  return restok_bahan;
};
module.exports = {
  getRestokBahan,
  getRestokBahanById,
  insertRestokBahan,
  updatedRestokBahan,
  deleteRestokBahanById
};
