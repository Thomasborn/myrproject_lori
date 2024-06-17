const prisma = require("../db");
const { findoutlet, findoutletById, insertoutletRepo, updateoutletRepo, deleteoutletByIdRepo } = require("./outlet.repository");
const getOutlet = async (q, page = 1, itemsPerPage = 10) => {
  const outlets = await findoutlet(q, page, itemsPerPage);
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
  getOutlet,
  getoutletById,
  insertoutlet,
  updatedoutlet,
  deleteoutletById
};
