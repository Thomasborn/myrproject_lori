const prisma = require("../db");
const { findBahanStokOpname, findBahanStokOpnameById, insertBahanStokOpnameRepo, updateBahanStokOpnameRepo, deleteBahanStokOpnameByIdRepo } = require("./bahan_stok_opname.repository");

const getBahanStokOpnames = async () => {
  const bahan_stok_opname = await findBahanStokOpname();

  return bahan_stok_opname;
};


const getBahanStokOpnameById = async (id) => {
  const bahan_stok_opname = await findBahanStokOpnameById(id);

  if (!bahan_stok_opname) {
    throw Error("BahanStokOpname not found");
  }

  return bahan_stok_opname;
};
const deleteBahanStokOpnameById = async (id) => {
  await getBahanStokOpnameById(id);
  await deleteBahanStokOpnameByIdRepo(id)
 
};
const insertBahanStokOpname = async (newBahanStokOpnameData)=>{
  const bahan_stok_opname = await insertBahanStokOpnameRepo(newBahanStokOpnameData);

  return bahan_stok_opname;
  
};
const updatedBahanStokOpname = async (id,updatedBahanStokOpnameData)=>{
  const bahan_stok_opname = await updateBahanStokOpnameRepo(id,updatedBahanStokOpnameData);
  return bahan_stok_opname;
};
module.exports = {
  getBahanStokOpnames,
  getBahanStokOpnameById,
  insertBahanStokOpname,
  updatedBahanStokOpname,
  deleteBahanStokOpnameById
};
