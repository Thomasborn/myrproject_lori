const prisma = require("../db");
const { findModelProduk, findModelProdukById, insertModelProdukRepo, updateModelProdukRepo, deleteModelProdukByIdRepo, findAllModelProduk } = require("./model_produk.repository");

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

  if (!model_produk) {
    throw Error("ModelProduk not found");
  }

  return model_produk;
};
const deleteModelProdukById = async (id) => {
  
  await deleteModelProdukByIdRepo(id)
 
};
const insertModelProduk = async (newModelProdukData)=>{
  const model_produk = await insertModelProdukRepo(newModelProdukData);

  return model_produk;
  
};
const updatedModelProduk = async (id,updatedModelProdukData)=>{
  const model_produk = await updateModelProdukRepo(id,updatedModelProdukData);
  return model_produk;
};
module.exports = {
  getModelProduk,
  getModelProdukById,
  insertModelProduk,
  updatedModelProduk,
  deleteModelProdukById,
  getAllModelProduk
};
