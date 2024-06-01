
const prisma = require("../db");
const finduser = async () => {
  const users = await prisma.user.findMany({
    include: {
      role: {
        include: {
          hak_akses: {
            include: {
              fungsi: true,
              akses: true
            }
          }
        }
      },
      karyawan: true
    }
  });

  // Transform the user data to match the desired format
  const transformedUsers = users.map(user => ({
    id: user.id,
    idKaryawan: user.karyawan_id, // Assuming karyawan_id maps to idKaryawan
    nama: user.karyawan?.nama, // Assuming karyawan has a nama field
    role: user.role?.nama, // Assuming role has a nama field
    email: user.email,
    username: `owner.${user.email.split('@')[0]}`, // Assuming username follows this pattern
    status: user.deleted_at ? "Inactive" : "Aktif", // Assuming status is "Aktif" if not deleted
    abilityRules: user.role?.hak_akses.map(hak_akses => ({
      fungsi: hak_akses.fungsi.nama,
      akses: hak_akses.akses.nama
    })) || [] // Map hak_akses to the desired format
  }));

  return transformedUsers;
};

const finduserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: {
        include: {
          hak_akses: {
            include: {
              fungsi: true,
              akses: true
            }
          }
        }
      },
      karyawan: true // Assuming karyawan model has fields like nama, foto, gender, noHp, alamat
    }
  });

  if (!user) {
    return null;
  }

  // Transform the user data to match the desired format
  const transformedUser = {
    id: user.id,
    idKaryawan: user.karyawan_id, // Assuming karyawan_id maps to idKaryawan
    nama: user.karyawan?.nama, // Assuming karyawan has a nama field
    role: user.role?.nama, // Assuming role has a nama field
    email: user.email,
    username: `owner.${user.email.split('@')[0]}`, // Assuming username follows this pattern
    status: user.deleted_at ? "Inactive" : "Aktif", // Assuming status is "Aktif" if not deleted
    abilityRules: user.role?.hak_akses.map(hak_akses => ({
      fungsi: hak_akses.fungsi.nama,
      akses: hak_akses.akses.nama
    })) || [], // Map hak_akses to the desired format
    foto: user.karyawan?.foto || null, // Assuming karyawan has a foto field
    gender: user.karyawan?.gender || null, // Assuming karyawan has a gender field
    noHp: user.karyawan?.noHp || null, // Assuming karyawan has a noHp field
    alamat: user.karyawan?.alamat || null // Assuming karyawan has an alamat field
  };

  return transformedUser;
};

const insertuserRepo = async (newuserData) => {
  
  const email = newuserData.email;
  const password = newuserData.password;
  const karyawan_id = newuserData.karyawan_id;
  const user = await prisma.user.create({
    data: {
      email,
      password,
      karyawan_id,

      },
  });
  return user
}
const updateuserRepo = async (id,updateduserData) => {
        const existinguser = await prisma.user.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existinguser) {
            return res.status(404).json({ error: "user not found" });
      }

      // Validate and update the user data
      const updateduser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updateduserData.kategori || existinguser.kategori.kategori
        
      },
      });
      return updateduser
}
const deleteuserByIdRepo = async(id)=>{
  await prisma.user.delete({
    where: { id: id },
  });
}
module.exports={
  finduser,
  finduserById,
  insertuserRepo,
  updateuserRepo,
  deleteuserByIdRepo
}