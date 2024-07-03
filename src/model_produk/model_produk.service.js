const prisma = require("../db");
const { findModelProduk, findFotoProduk,findModelProdukById, insertModelProdukRepo, updateModelProdukRepo,updatedFotoProdukRepo, deleteModelProdukByIdRepo, findAllModelProduk } = require("./model_produk.repository");
const getFotoProduk = async (id) => {
  const fotoProduk = await findFotoProduk(id);

  return fotoProduk;
};
const getModelProduk = async () => {
  const model_produk = await findModelProduk();

  return model_produk;
};
const getAllModelProduk = async () => {
  const model_produk = await findAllModelProduk();

  return model_produk;
};

const getModelProdukById = async (id) => {
  const model_produk = await findModelProdukById(id);

  // if (!model_produk) {
  //   throw Error("ModelProduk not found");
  // }

  return model_produk;
};
const deleteModelProdukById = async (id) => {
  
  await deleteModelProdukByIdRepo(id)
 
};
const insertModelProduk = async (newModelProdukData)=>{
  const model_produk = await insertModelProdukRepo(newModelProdukData);

  return model_produk;
  
};
const updateModelProduk = async (id,updatedModelProdukData)=>{
  const model_produk = await updateModelProdukRepo(id,updatedModelProdukData);
  return model_produk;
};
const updatedFotoProduk = async (fotoProduk,updatedModelProdukData)=>{
  const updatefotoProduk = await updatedFotoProdukRepo(fotoProduk,updatedModelProdukData);
  return updatefotoProduk;
};
module.exports = {
  getModelProduk,
  getFotoProduk,
  getModelProdukById,
  insertModelProduk,
  updateModelProduk,
  updatedFotoProduk,
  deleteModelProdukById,
  getAllModelProduk
};
