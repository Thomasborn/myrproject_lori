
const prisma = require("../db");
const bcrypt = require('bcrypt')
const userService = require('./auth.service'); // Import the user repository
async function findByEmailAndPassword(email, password) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
          password, // Replace with the actual user ID or use a different field if necessary
        },
      });
  
    
      return user;
    } catch (error) {
      // Handle the error here, and you can choose to log it
      console.error('Error in findByEmailAndPassword:', error);
      throw error; // You can rethrow the error to let the caller handle it
    }
}
const findUserByemail = async (email) => {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
  
    return user;
  };
  
const insertProduksiRepo = async (newprodukData) => {
   
  const mulai = new Date();
  // You can format "mulai" as needed, e.g., to ISO string
  const mulaiISO = mulai.toISOString();
  // mulai = mulaiISO;
  const selesai = "1970-01-01T00:00:00.000Z";
  const kode_produk = newprodukData.kode_produk;
  const jumlah = parseInt(newprodukData.jumlah);
  const ukuran = (newprodukData.ukuran);
  const biaya = parseFloat(newprodukData.biaya);
  const warna = (newprodukData.warna);
  const pembuat_id = parseInt(newprodukData.pembuat_id);
  const kategori_produk_id = parseInt(newprodukData.kategori_produk_id);
  const produksi = await prisma.produksi.create({
    data: {
       mulai, 
       selesai,
       kode_produk, 
       jumlah,  
       ukuran,  
       warna,  
       biaya,
       pembuat: {
        connect: {
          id: pembuat_id, // Use the ID or other unique identifier
        }},
        kategori_produk:{
          connect:{
            id: kategori_produk_id,
          }
        }
    },
  });
  return produksi
};
const getHashedPasswordByemail = async (email) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      password: true, // Select only the hashedPassword field
    },
  });

  if (user) {
    return user.password;
  }

  return null; // Return null if the user doesn't exist
};
const getForgetPassword = async (email) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
   
  });

  if (user) {
    return user;
  }

  return null; // Return null if the user doesn't exist
};

// Function to hash the user's password
const hashPassword= async (password)=> {
  try {
    // const saltRounds = bcrypt.genSalt(10); // The number of salt rounds (adjust as needed)
    const saltRounds = (10); // The number of salt rounds (adjust as needed)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}
  // Function to create a user
  const createUser = async (dataUser) => {
    const {email,password,karyawan_id}=dataUser;
    //mencari user berdasarkan email yang digunakan
    const existingUser = await findUserByemail(email);
    //melakukan generate hash untuk password yang lebih aman
    const hashedPassword = await hashPassword(password);
    //mengecek apakah email sudah ada
    if (existingUser) {
      throw new Error('email sudah ada'); // Throw an error with a custom message
    }
    
    try {
      // Create the new user
      const user = await prisma.user.create({
        data: {
          email,
          password:hashedPassword,
          karyawan:{
            connect:{
              id:parseInt(karyawan_id)
            }
          }
        },
      });
  
      return user;
    } catch (error) {
      if (error) {
        throw new Error('Validation error: ' + error.message);
      } else {
        throw error;
      }
    }
  };
module.exports = { findByEmailAndPassword, createUser,findUserByemail,getHashedPasswordByemail,getForgetPassword };
