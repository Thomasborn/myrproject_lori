
const prisma = require("../db");
const finduser = async (searchCriteria = {}, page = 1, pageSize = 10) => {
  try {
    const { nama, email, role, status } = searchCriteria;

    // Build the search filter object
    const where = {
      AND: [
        nama ? { karyawan: { nama: { contains: nama, mode: 'insensitive' } } } : {},
        email ? { email: { contains: email, mode: 'insensitive' } } : {},
        role ? { role: { nama: { contains: role, mode: 'insensitive' } } } : {},
        status !== undefined ? { deleted_at: status === 'Inactive' ? { not: null } : null } : {}
      ]
    };

    // Calculate pagination values
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch users with Prisma, including search criteria and pagination
    const users = await prisma.user.findMany({
      where,
      include: {
        role: {
          include: {
            hak_akses: {
              include: {
                fungsi: true,
                akses: true,
              },
            },
          },
        },
        karyawan: true,
      },
      skip,
      take,
    });

    // Transform the user data to match the desired format
    const transformedUsers = users.map(user => ({
      id: user.id,
      idKaryawan: user.karyawan_id, // Assuming karyawan_id maps to idKaryawan
      nama: user.karyawan?.nama || '', // Assuming karyawan has a nama field
      role: user.role?.nama || '', // Assuming role has a nama field
      email: user.email,
      username: `owner.${user.email.split('@')[0]}`, // Assuming username follows this pattern
      status: user.deleted_at ? "Inactive" : "Aktif", // Assuming status is "Aktif" if not deleted
      abilityRules: user.role?.hak_akses.map(hak_akses => ({
        fungsi: hak_akses.fungsi?.nama || '', // Ensure fungsi is not undefined
        akses: hak_akses.akses?.nama || '', // Ensure akses is not undefined
      })) || [], // Map hak_akses to the desired format
    }));

    // Fetch total count for pagination
    const totalCount = await prisma.user.count({ where });

    return {
      success: true,
      message: "Data pengguna berhasil ditemukan.",
      dataTitle: "Pengguna",
      totalPages: Math.ceil(totalCount / pageSize),
      totalData: totalCount,
      page: page,
      data: transformedUsers
    };
    
  } catch (error) {
    console.error('Error finding users:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mencari data pengguna.',
    };
  }
};
const finduserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        role: {
          include: {
            hak_akses: {
              include: {
                fungsi: true,
                akses: true,
              },
            },
          },
        },
        karyawan: true, // Assuming karyawan model has fields like nama, foto, gender, noHp, alamat
      },
    });

    if (!user) {
      return {
        success: false,
        message: `Pengguna dengan ID ${id} tidak ditemukan.`,
      };
    }

    // Transform the user data to match the desired format
    const transformedUser = {
      id: user.id,
      idKaryawan: user.karyawan_id, // Assuming karyawan_id maps to idKaryawan
      nama: user.karyawan?.nama || '', // Assuming karyawan has a nama field
      role: user.role?.nama || '', // Assuming role has a nama field
      email: user.email,
      username: `owner.${user.email.split('@')[0]}`, // Assuming username follows this pattern
      status: user.deleted_at ? "Inactive" : "Aktif", // Assuming status is "Aktif" if not deleted
      abilityRules: user.role?.hak_akses.map(hak_akses => ({
        fungsi: hak_akses.fungsi.nama,
        akses: hak_akses.akses.nama,
      })) || [], // Map hak_akses to the desired format
      foto: user.karyawan?.foto || null, // Assuming karyawan has a foto field
      gender: user.karyawan?.gender || null, // Assuming karyawan has a gender field
      noHp: user.karyawan?.noHp || null, // Assuming karyawan has a noHp field
      alamat: user.karyawan?.alamat || null, // Assuming karyawan has an alamat field
    };

    return {
      success: true,
      message: `Data pengguna dengan ID ${id} berhasil diperoleh.`,
      data: transformedUser,
    };
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mencari data pengguna.',
    };
  }
};


const insertuserRepo = async (newUserData) => {
  try {
    const { idKaryawan, nama, email, username, status } = newUserData;
    const roleName = newUserData.role;

    // Temukan ID peran berdasarkan nama peran
    const role = await prisma.role.findFirst({
      where: {
        nama: roleName,
      },
    });

    if (!role) {
      throw new Error(`Peran dengan nama ${roleName} tidak ditemukan`);
    }

    // Buat pengguna baru
    const user = await prisma.user.create({
      data: {
        email,
        password: newUserData.password, // Pastikan untuk meng-hash kata sandi
        karyawan_id: idKaryawan,
        role_id: role.id,
      },
    });

    return {
      success: true,
      message: `Pengguna berhasil dibuat dengan ID ${user.id}`,
      data: user,
    };
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      // Tangani kesalahan jika email sudah ada
      return {
        success: false,
        message: 'Email sudah digunakan oleh pengguna lain.',
      };
    }

    console.error("Kesalahan saat membuat pengguna:", error);
    return {
      success: false,
      message: `Gagal membuat pengguna: ${error.message}`,
    };
  }
};



const updateuserRepo = async (userId, updatedUserData) => {
  try {
    const {  role, email, username, status } = updatedUserData;
    const roleName = role;

    // Temukan ID peran berdasarkan nama peran
    const roleRecord = await prisma.role.findFirst({
      where: {
        nama: roleName,
      },
    });

    if (!roleRecord) {
      throw new Error(`Peran dengan nama ${roleName} tidak ditemukan`);
    }

    // Perbarui pengguna
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        // nama,
        role: {
          connect: {
            id: roleRecord.id
          }
        },
        email,
        username,
        status,
      },
    });

    return {
      success: true,
      message: `Pengguna dengan ID ${userId} berhasil diperbarui`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Kesalahan saat memperbarui pengguna:", error);
    return {
      success: false,
      message: `Gagal memperbarui pengguna: ${error.message}`,
    };
  }
};

const deleteuserByIdRepo = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new Error(`Pengguna dengan ID ${id} tidak ditemukan`);
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return {
      success: true,
      message: `Pengguna dengan ID ${id} berhasil dihapus`,
    };
  } catch (error) {
    console.error("Kesalahan saat menghapus pengguna:", error);
    return {
      success: false,
      message: `Gagal menghapus pengguna: ${error.message}`,
    };
  }
};

module.exports={
  finduser,
  finduserById,
  insertuserRepo,
  updateuserRepo,
  deleteuserByIdRepo
}