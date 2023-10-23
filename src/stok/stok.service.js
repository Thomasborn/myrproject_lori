const prisma = require("../db");
const { findstok, findstokById, insertstokRepo, updatestokRepo, deletestokByIdRepo } = require("./stok.repository");

const getstoks = async () => {
  const stok = await findstok();

  return stok;
};


const getstokById = async (id) => {
  const stok = await findstokById(id);

  if (!stok) {
    throw Error("stok not found");
  }

  return stok;
};
const deletestokById = async (id) => {
  await getstokById(id);
  await deletestokByIdRepo(id)
 
};
const insertstok = async (newstokData)=>{
  const stok = await insertstokRepo(newstokData);

  return stok;
  
};
const updatedstok = async (id,updatedstokData)=>{
  const stok = await updatestokRepo(id,updatedstokData);
  return stok;
};
module.exports = {
  getstoks,
  getstokById,
  insertstok,
  updatedstok,
  deletestokById
};
