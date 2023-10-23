
const prisma = require("../db");
async function findByUsernameAndPassword(username, password) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
          password, // Replace with the actual user ID or use a different field if necessary
        },
      });
  
    
      return user;
    } catch (error) {
      // Handle the error here, and you can choose to log it
      console.error('Error in findByUsernameAndPassword:', error);
      throw error; // You can rethrow the error to let the caller handle it
    }
}
const findUserByUsername = async (username) => {
    const user = await prisma.user.findFirst({
      where: {
        username,
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
const getHashedPasswordByUsername = async (username) => {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
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
const getForgetPassword = async (username) => {
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
  // Function to create a user
  const createUser = async (username, password) => {
    const existingUser = await findUserByUsername(username);

    if (existingUser) {
      throw new Error('Username sudah ada'); // Throw an error with a custom message
    }
  
    try {
      // Create the new user
      const user = await prisma.user.create({
        data: {
          username,
          password,
          nama_lengkap: '',
          kontak: '',
          email: '',
        },
      });
  
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new Error('Validation error: ' + error.message);
      } else {
        throw error;
      }
    }
  };
module.exports = { findByUsernameAndPassword, createUser,findUserByUsername,getHashedPasswordByUsername,getForgetPassword };
