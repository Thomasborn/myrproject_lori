const prisma = require("../db");
const { finduser, finduserById, insertUserRepo, updateuserRepo, deleteUserByIdRepo } = require("./user.repository");

const getUsers = async (q, role, status, page, itemsPerPage) => {
  const user = await finduser(q, role, status,page, itemsPerPage);

  return user;
};


const getUserById = async (id) => {
  const user = await finduserById(id);

  if (!user) {
    throw Error("user not found");
  }

  return user;
};
const deleteUserById = async (id) => {
 const pengguna = await deleteUserByIdRepo(id)
 return pengguna;
};
const insertUser = async (newuserData)=>{
  const user = await insertUserRepo(newuserData);

  return user;
  
};
const updatedUser = async (id,updatedUserData)=>{
  const user = await updateuserRepo(id,updatedUserData);
  return user;
};
module.exports = {
  getUsers,
  getUserById,
  insertUser,
  updatedUser,
  deleteUserById
};
