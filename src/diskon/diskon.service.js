const prisma = require("../db");
const { findDiskon,findDetailDiskon,findDetailDiskonById, findDiskonById, insertDiskonRepo, insertDetailDiskonRepo, updateDetailDiskonRepo,updateDiskonRepo, deleteDiskonByIdRepo,deleteDetailDiskonByIdRepo } = require("./diskon.repository");

const getDiskon = async () => {
  const diskon = await findDiskon();

  return diskon;
};

const getDetaildiskon = async ()=>{
  const detaildiskon = await findDetailDiskon();
  return detaildiskon;
};

const getDiskonById = async (id) => {
  const diskon = await findDiskonById(id);

  if (!diskon) {
    throw Error("diskon not found");
  }

  return diskon;
};

const getDetaildiskonById = async (id) => {
  const detaildiskon = await findDetailDiskonById(id);

  if (!detaildiskon) {
    throw Error("detail diskon not found");
  }

  return diskon;
};

const deleteDetailDiskonById = async (id) => {
  await getDetaildiskonById(id);
  await deleteDetailDiskonByIdRepo(id)
 
};

const deleteDiskonById = async (id) => {
  await getDiskonById(id);
  await deleteDiskonByIdRepo(id)
 
};

const insertDetailDiskon = async (newdiskonData)=>{
  const detaildiskon = await insertDetailDiskonRepo(newdiskonData);

  return detaildiskon;
  
};
const updateDetailDiskonById = async (id,updateddiskonData)=>{
  const diskon = await updateDetailDiskonRepo(id,updateddiskonData);
  return diskon;
};
const insertDiskon = async (newdiskonData)=>{
  const diskon = await insertDiskonRepo(newdiskonData);

  return diskon;
  
};
const updateDiskon = async (id,updateddiskonData)=>{
  const diskon = await updateDiskonRepo(id,updateddiskonData);
  return diskon;
};
module.exports = {
  getDiskon,
  getDetaildiskon,
  getDiskonById,
  insertDiskon,
  insertDetailDiskon,
  updateDiskon,
  updateDetailDiskonById,
  deleteDiskonById,
  deleteDetailDiskonById
};
