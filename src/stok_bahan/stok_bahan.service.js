const prisma = require("../db");
const { findStokBahan, findStokBahanById, insertstokBahanRepo, updatestokBahanRepo, deletestokBahanByIdRepo, findStokBahanByDaftarBahanId } = require("./stok_bahan.repository");

const getstokBahan = async () => {
  const stokBahan = await findStokBahan();

  return stokBahan;
};


const getstokBahanByDaftarBahanId = async (id) => {
  const stokBahan = await findStokBahanByDaftarBahanId(id);

  if (!stokBahan) {
    throw Error("stokBahan not found");
  }

  return stokBahan;
};
const getstokBahanById = async (id) => {
  const stokBahan = await findStokBahanById(id);

  if (!stokBahan) {
    throw Error("stokBahan not found");
  }

  return stokBahan;
};
const deletestokBahanById = async (id) => {
  await getstokBahanById(id);
  await deletestokBahanByIdRepo(id)
 
};
const insertstokBahan = async (newstokBahanData)=>{
  const stokBahan = await insertstokBahanRepo(newstokBahanData);

  return stokBahan;
  
};
const updatedstokBahan = async (id,updatedstokBahanData)=>{
  const stokBahan = await updatestokBahanRepo(id,updatedstokBahanData);
  return stokBahan;
};
module.exports = {
  getstokBahan,
  getstokBahanById,
  getstokBahanByDaftarBahanId,
  insertstokBahan,
  updatedstokBahan,
  deletestokBahanById
};
