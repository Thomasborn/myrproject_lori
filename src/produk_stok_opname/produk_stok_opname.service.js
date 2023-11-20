const prisma = require("../db");
const { findProdukStokOpname, findProdukStokOpnameById, insertProdukStokOpnameRepo, updateProdukStokOpnameRepo, deleteProdukStokOpnameByIdRepo } = require("./produk_stok_opname.repository");

const getProdukStokOpnames = async () => {
  const produk_stok_opname = await findProdukStokOpname();

  return produk_stok_opname;
};


const getProdukStokOpnameById = async (id) => {
  const produk_stok_opname = await findProdukStokOpnameById(id);

  if (!produk_stok_opname) {
    throw Error("ProdukStokOpname not found");
  }

  return produk_stok_opname;
};
const deleteProdukStokOpnameById = async (id) => {
  await getProdukStokOpnameById(id);
  await deleteProdukStokOpnameByIdRepo(id)
 
};
const insertProdukStokOpname = async (newProdukStokOpnameData)=>{
  const produk_stok_opname = await insertProdukStokOpnameRepo(newProdukStokOpnameData);

  return produk_stok_opname;
  
};
const updatedProdukStokOpname = async (id,updatedProdukStokOpnameData)=>{
  const produk_stok_opname = await updateProdukStokOpnameRepo(id,updatedProdukStokOpnameData);
  return produk_stok_opname;
};
module.exports = {
  getProdukStokOpnames,
  getProdukStokOpnameById,
  insertProdukStokOpname,
  updatedProdukStokOpname,
  deleteProdukStokOpnameById
};
