const prisma = require("../db");
const { findstokProduk, findStokProdukByDaftarProdukId, insertStokProdukRepo, updatestokProdukRepo, deleteStokProdukByIdRepo,findStokProdukByDaftarProdukLemariId } = require("./stok_produk.repository");

const getStokProduk = async () => {
  const stokProduk = await findstokProduk();

  return stokProduk;
};


const getStokProdukByDaftarProdukId = async (id) => {
  const stokProduk = await findStokProdukByDaftarProdukId(id);

  if (!stokProduk) {
    throw Error("stokProduk not found");
  }

  return stokProduk;
};
const getStokProdukByDaftarProdukLemariId = async (daftar_produk_id,lemari_id) => {
  const stokProduk = await findStokProdukByDaftarProdukLemariId(daftar_produk_id,lemari_id);

  if (!stokProduk) {
    throw Error("stokProduk not found");
  }

  return stokProduk;
};
const getStokProdukById = async (id) => {
  const stokProduk = await findstokProdukById(id);

  if (!stokProduk) {
    throw Error("stokProduk not found");
  }

  return stokProduk;
};
const deleteStokProdukById = async (id) => {
  await getStokProdukById(id);
  await deleteStokProdukByIdRepo(id)
 
};
const insertStokProduk = async (newstokProdukData)=>{
  const stokProduk = await insertStokProdukRepo(newstokProdukData);

  return stokProduk;
  
};
const updatedStokProduk = async (id,updatedStokProdukData)=>{
  const stokProduk = await updatestokProdukRepo(id,updatedStokProdukData);
  return stokProduk;
};
module.exports = {
  getStokProduk,
  getStokProdukById,
  getStokProdukByDaftarProdukId,
  getStokProdukByDaftarProdukLemariId,
  insertStokProduk,
  updatedStokProduk,
  deleteStokProdukById
};
