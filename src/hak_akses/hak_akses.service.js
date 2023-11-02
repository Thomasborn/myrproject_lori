const prisma = require("../db");
const { findhak_akses, findhak_aksesById, inserthak_aksesRepo, updatehak_aksesRepo, deletehak_aksesByIdRepo } = require("./hak_akses.repository");

const gethak_akses = async () => {
  const hak_akses = await findhak_akses();

  return hak_akses;
};


const gethak_aksesById = async (id) => {
  const hak_akses = await findhak_aksesById(id);

  if (!hak_akses) {
    throw Error("hak_akses not found");
  }

  return hak_akses;
};
const deletehak_aksesById = async (id) => {
  await gethak_aksesById(id);
  await deletehak_aksesByIdRepo(id)
 
};
const inserthak_akses = async (newhak_aksesData)=>{
  const hak_akses = await inserthak_aksesRepo(newhak_aksesData);

  return hak_akses;
  
};
const updatedhak_akses = async (id,updatedhak_aksesData)=>{
  const hak_akses = await updatehak_aksesRepo(id,updatedhak_aksesData);
  return hak_akses;
};
module.exports = {
  gethak_akses,
  gethak_aksesById,
  inserthak_akses,
  updatedhak_akses,
  deletehak_aksesById
};
