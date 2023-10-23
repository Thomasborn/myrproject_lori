const prisma = require("../db");
const { finduser, finduserById, insertuserRepo, updateuserRepo, deleteuserByIdRepo } = require("./user.repository");

const getusers = async () => {
  const user = await finduser();

  return user;
};


const getuserById = async (id) => {
  const user = await finduserById(id);

  if (!user) {
    throw Error("user not found");
  }

  return user;
};
const deleteuserById = async (id) => {
  await getuserById(id);
  await deleteuserByIdRepo(id)
 
};
const insertuser = async (newuserData)=>{
  const user = await insertuserRepo(newuserData);

  return user;
  
};
const updateduser = async (id,updateduserData)=>{
  const user = await updateuserRepo(id,updateduserData);
  return user;
};
module.exports = {
  getusers,
  getuserById,
  insertuser,
  updateduser,
  deleteuserById
};
