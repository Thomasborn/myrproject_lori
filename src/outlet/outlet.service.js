const prisma = require("../db");
const { findoutlet, findoutletById, insertoutletRepo, updateoutletRepo, deleteoutletByIdRepo } = require("./outlet.repository");

const getoutlets = async () => {
  const outlet = await findoutlet();

  return outlet;
};


const getoutletById = async (id) => {
  const outlet = await findoutletById(id);

  if (!outlet) {
    throw Error("outlet not found");
  }

  return outlet;
};
const deleteoutletById = async (id) => {
  await getoutletById(id);
  await deleteoutletByIdRepo(id)
 
};
const insertoutlet = async (newoutletData)=>{
  const outlet = await insertoutletRepo(newoutletData);

  return outlet;
  
};
const updatedoutlet = async (id,updatedoutletData)=>{
  const outlet = await updateoutletRepo(id,updatedoutletData);
  return outlet;
};
module.exports = {
  getoutlets,
  getoutletById,
  insertoutlet,
  updatedoutlet,
  deleteoutletById
};
