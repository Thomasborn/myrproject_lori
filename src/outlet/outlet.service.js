const prisma = require("../db");
const { findoutlet, findoutletById, insertoutletRepo, updateoutletRepo, deleteoutletByIdRepo } = require("./outlet.repository");
const getoutlets = async (searchCriteria = {}, page = 1, pageSize = 10) => {
  const outlets = await findoutlet(searchCriteria, page, pageSize);
  return outlets;
};



const getoutletById = async (id) => {
  const outlet = await findoutletById(id);

  if (!outlet) {
    throw Error("outlet not found");
  }

  return outlet;
};
const deleteoutletById = async (id) => {
  // await getoutletById(id);
  const outlet = await deleteoutletByIdRepo(id)
 return outlet;
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
