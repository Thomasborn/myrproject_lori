
const prisma = require("../db");
const findkaryawan = async (searchCriteria = {}, page = 1, pageSize = 10) => {
  try {
    // Calculate pagination offset
    const offset = (page - 1) * pageSize;

    // Fetch karyawan data based on search criteria and pagination parameters
    const karyawan = await prisma.karyawan.findMany({
      where: searchCriteria,
      skip: offset,
      take: pageSize,
    });

    // Fetch total count of karyawan data based on search criteria
    const totalKaryawan = await prisma.karyawan.count({ where: searchCriteria });

    // Reshape the karyawan data
    const reshapedKaryawan = karyawan.map(employee => ({
      id: employee.id,
      nama: employee.nama,
      gender: employee.jenis_kelamin, // Assuming 'jenis_kelamin' maps to 'gender' in your model
      nik: employee.nik,
      alamat: employee.alamat,
      noHp: employee.kontak, // Assuming 'kontak' maps to 'noHp' in your model
      email: employee.email,
      foto: employee.foto,
      posisi: employee.posisi,
      status: employee.status,
      bank: employee.bank,
      norek: employee.no_rekening, // Assuming 'no_rekening' maps to 'norek' in your model
      akunBank: employee.akun_bank, // Assuming 'akun_bank' maps to 'akunBank' in your model
    }));
    return {
      success: true,
      message: "Data Karyawan berhasil diperoleh",
      dataTitle: "Karyawan",
      totalPages: Math.ceil(totalKaryawan / pageSize),
      totalData: totalKaryawan,
      page: page,
      data: reshapedKaryawan
    };
    
  } catch (error) {
    console.error("Error fetching karyawan:", error);
    throw new Error("Gagal mengambil data karyawan");
  }
};
const findkaryawanById = async (id) => {
  try {
    const karyawan = await prisma.karyawan.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!karyawan) {
      return {
        success: false,
        message: `Karyawan dengan ID ${id} tidak ditemukan.`,
      };
    }

    const shapedData = {
      id: karyawan.id,
      nama: karyawan.nama,
      gender: karyawan.jenis_kelamin, // Assuming 'jenis_kelamin' maps to 'gender' in your model
      nik: karyawan.nik,
      alamat: karyawan.alamat,
      noHp: karyawan.kontak, // Assuming 'kontak' maps to 'noHp' in your model
      tanggal_lahir: karyawan.tanggal_lahir,
      noRekening: karyawan.no_rekening, // Assuming 'no_rekening' maps to 'noRekening' in your model
      foto: karyawan.foto,
      posisi: karyawan.posisi,
      status: karyawan.status,
      bank: karyawan.bank,
      akunBank: karyawan.akun_bank, // Assuming 'akun_bank' maps to 'akunBank' in your model
    };

    return {
      success: true,
      message: `Data karyawan dengan ID ${id} berhasil ditemukan.`,
      data: shapedData,
    };
  } catch (error) {
    console.error("Error finding karyawan:", error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mencari data karyawan.',
    };
  }
};

const insertkaryawanRepo = async (newkaryawanData) => {
  try {
    const {
      id,
      nama,
      nik,
      gender,
      posisi,
      status,
      alamat,
      email,
      nomorHp,
      bank,
      norek,
      akunBank
    } = newkaryawanData;

    const karyawan = await prisma.karyawan.create({
      data: {
        nama,
        nik,
        alamat,
        kontak: nomorHp, // Assuming nomorHp maps to kontak
        tanggal_lahir: new Date(), // Assuming tanggal_lahir is set to current date-time
        jenis_kelamin: gender, // Assuming gender maps to jenis_kelamin
        no_rekening: norek, // Assuming norek maps to no_rekening
        posisi,
        status,
        bank,
        akun_bank: akunBank, // Assuming akunBank maps to akun_bank
      },
    });

    const response = {
      success: true,
      message: `Data karyawan berhasil ditambahkan dengan ID ${karyawan.id}`,
      data: {
        id: karyawan.id,
        nama: karyawan.nama,
        nik: karyawan.nik,
        gender: karyawan.jenis_kelamin, // Reverse mapping for gender
        posisi: karyawan.posisi,
        status: karyawan.status,
        alamat: karyawan.alamat,
        email: email, // Assuming email is provided separately
        nomorHp: karyawan.kontak, // Reverse mapping for kontak
        bank: karyawan.bank,
        norek: karyawan.no_rekening, // Reverse mapping for no_rekening
        akunBank: karyawan.akun_bank // Reverse mapping for akun_bank
      }
    };

    return response;
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('nik')) {
      return {
        success: false,
        message: `NIK '${newkaryawanData.nik}' sudah terdaftar.`,
      };
    } else {
      return {
        success: false,
        message: 'Gagal menambahkan karyawan.',
        error: error.message || "Internal server error"
      };
    }
  }
}

const updatekaryawanRepo = async (karyawanId, updatedData) => {
  try {
    const existingKaryawan = await prisma.karyawan.findUnique({
      where: {
        id: karyawanId,
      },
    });

    if (!existingKaryawan) {
      return {
        success: false,
        message: 'Karyawan tidak ditemukan.',
      };
    }

    const {
      id,
      nama,
      nik,
      gender,
      posisi,
      status,
      alamat,
      email,
      nomorHp,
      bank,
      norek,
      akunBank
    } = updatedData;

    const updatedKaryawan = await prisma.karyawan.update({
      where: {
        id: karyawanId,
      },
      data: {
        nama,
        nik,
        alamat,
        kontak: nomorHp, // Assuming nomorHp maps to kontak
        tanggal_lahir: existingKaryawan.tanggal_lahir, // No update for tanggal_lahir
        jenis_kelamin: gender, // Assuming gender maps to jenis_kelamin
        no_rekening: norek, // Assuming norek maps to no_rekening
        posisi,
        status,
        bank,
        akun_bank: akunBank, // Assuming akunBank maps to akun_bank
      },
    });

    return {
      success: true,
      message: `Data karyawan dengan ID ${karyawanId} berhasil diperbarui.`,
      data: updatedKaryawan,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal memperbarui karyawan.',
      error: error.message || 'Internal server error',
    };
  }
};
const deletekaryawanByIdRepo = async (id) => {
  try {
    // Check if the karyawan exists
    const karyawan = await prisma.karyawan.findUnique({
      where: { id },
    });

    if (!karyawan) {
      return {
        success: false,
        message: 'Karyawan dengan ID: '+id+' tidak ditemukan.',
      };
    }

    // Delete related users first
    await prisma.user.deleteMany({
      where: { karyawan_id: id },
    });

    // Then delete the karyawan
    await prisma.karyawan.delete({
      where: { id },
    });

    return {
      success: true,
      message: `Karyawan dengan ID ${id} berhasil dihapus.`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal menghapus karyawan.',
      error: error.message || 'Internal server error',
    };
  }
};

module.exports={
  findkaryawan,
  findkaryawanById,
  insertkaryawanRepo,
  updatekaryawanRepo,
  deletekaryawanByIdRepo
}