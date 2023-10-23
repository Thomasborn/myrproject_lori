const prisma = require("../db");
const { findsupplier, findsupplierById, insertsupplierRepo, updatesupplierRepo, deletesupplierByIdRepo } = require("./supplier.repository");

const getsuppliers = async () => {
  const supplier = await findsupplier();

  return supplier;
};


const getsupplierById = async (id) => {
  const supplier = await findsupplierById(id);

  if (!supplier) {
    throw Error("supplier not found");
  }

  return supplier;
};
const deletesupplierById = async (id) => {
  await getsupplierById(id);
  await deletesupplierByIdRepo(id)
 
};
const insertsupplier = async (newsupplierData)=>{
  const supplier = await insertsupplierRepo(newsupplierData);

  return supplier;
  
};
const updatedsupplier = async (id,updatedsupplierData)=>{
  const supplier = await updatesupplierRepo(id,updatedsupplierData);
  return supplier;
};
module.exports = {
  getsuppliers,
  getsupplierById,
  insertsupplier,
  updatedsupplier,
  deletesupplierById
};
