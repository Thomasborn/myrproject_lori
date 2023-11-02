const prisma = require("../db");
const { findfungsi, findfungsiById, insertfungsiRepo, updatefungsiRepo, deletefungsiByIdRepo } = require("./fungsi.repository");

const getfungsis = async () => {
  const fungsi = await findfungsi();

  return fungsi;
};


const getfungsiById = async (id) => {
  const fungsi = await findfungsiById(id);

  if (!fungsi) {
    throw Error("fungsi not found");
  }

  return fungsi;
};
const deletefungsiById = async (id) => {
  await getfungsiById(id);
  await deletefungsiByIdRepo(id)
 
};
const insertfungsi = async (newfungsiData)=>{
  const fungsi = await insertfungsiRepo(newfungsiData);

  return fungsi;
  
};
const updatedfungsi = async (id,updatedfungsiData)=>{
  const fungsi = await updatefungsiRepo(id,updatedfungsiData);
  return fungsi;
};
module.exports = {
  getfungsis,
  getfungsiById,
  insertfungsi,
  updatedfungsi,
  deletefungsiById
};
