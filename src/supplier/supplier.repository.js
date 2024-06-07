
const prisma = require("../db");
const findsupplier = async (searchCriteria, page = 1, itemsPerPage = 10) => {
  // Calculate pagination offset
  const offset = (page - 1) * itemsPerPage;

  // Fetch suppliers based on search criteria and pagination parameters
  const suppliers = await prisma.supplier.findMany({
    where: {
      nama: {
        contains: searchCriteria // Assuming you meant to use 'contains' for partial matching
      }
    },
    skip: offset,
    take: itemsPerPage,
  });
  

  // Fetch total count of suppliers based on search criteria
  const totalSuppliers = await prisma.supplier.count({
    where: {
      nama: {
        contains: searchCriteria // Assuming you meant to use 'contains' for partial matching
      }
    },
  });

  // Reshape the fetched data
  const reshapedData = suppliers.map(supplier => ({
    id: supplier.id,
    nama: supplier.nama,
    alamat: supplier.alamat,
    pic: supplier.pic,
    kontak: supplier.kontak,
  }));

  return {
    success: true,
    message: "Data supplier berhasil diperoleh",
    dataTitle: "Supplier",
    itemsPerPage:itemsPerPage,
    totalPages: Math.ceil(totalSuppliers / itemsPerPage),
    totalData: totalSuppliers,
    page: page,
    data: reshapedData
  };
};

const findsupplierById = async (id) => {
  // Ambil data supplier berdasarkan id
  const supplier = await prisma.supplier.findUnique({
    where: {
      id,
    },
  });

  // Jika supplier tidak ditemukan, kembalikan respons yang sesuai
  if (!supplier) {
    return {
      success: false,
      message: `Supplier dengan ID ${id} tidak ditemukan`,
      data: null,
    };
  }

  // Bentuk ulang data yang diambil
  const reshapedData = {
    id: supplier.id,
    nama: supplier.nama,
    alamat: supplier.alamat,
    pic: supplier.pic,
    kontak: supplier.kontak,
  };

  return {
    success: true,
    message: `Data supplier dengan ID ${id} berhasil diperoleh`,
    data: reshapedData,
  };
};

// /

const insertsupplierRepo = async (newSupplierData) => {
  try {
    // Tambahkan supplier baru ke dalam database
    const newSupplier = await prisma.supplier.create({
      data: newSupplierData,
    });

    // Bentuk ulang data yang baru ditambahkan
    const reshapedData = {
      id: newSupplier.id,
      nama: newSupplier.nama,
      alamat: newSupplier.alamat,
      pic: newSupplier.pic,
      kontak: newSupplier.kontak,
    };

    return {
      success: true,
      message: `Data supplier baru berhasil ditambahkan dengan ID ${newSupplier.id}`,
      data: reshapedData,
    };
  } catch (error) {
    // Tangani kesalahan jika terjadi
    return {
      success: false,
      message: `Terjadi kesalahan: ${error.message}`,
      data: null,
    };
  }
};

const updatesupplierRepo = async (id, updateData) => {
  try {
    // Perbarui data supplier berdasarkan id
    const updatedSupplier = await prisma.supplier.update({
      where: {
        id,
      },
      data: updateData,
    });

    // Bentuk ulang data yang diperbarui
    const reshapedData = {
      id: updatedSupplier.id,
      nama: updatedSupplier.nama,
      alamat: updatedSupplier.alamat,
      pic: updatedSupplier.pic,
      kontak: updatedSupplier.kontak,
    };

    return {
      success: true,
      message: `Data supplier dengan ID ${id} berhasil diperbarui`,
      data: reshapedData,
    };
  } catch (error) {
    // Jika supplier tidak ditemukan atau ada kesalahan lain, kembalikan respons kesalahan
    if (error.code === 'P2025') { // Kode kesalahan untuk item yang tidak ditemukan
      return {
        success: false,
        message: `Supplier dengan ID ${id} tidak ditemukan`,
        data: null,
      };
    }
    // Tangani kesalahan lainnya
    return {
      success: false,
      message: `Terjadi kesalahan: ${error.message}`,
      data: null,
    };
  }
};

const deletesupplierByIdRepo = async (id) => {
  try {
    // Hapus data supplier berdasarkan id
    await prisma.supplier.delete({
      where: { id },
    });

    return {
      success: true,
      message: `Data supplier dengan ID ${id} berhasil dihapus`,
    };
  } catch (error) {
    // Jika supplier tidak ditemukan atau ada kesalahan lain, kembalikan respons kesalahan
    if (error.code === 'P2025') { // Kode kesalahan untuk item yang tidak ditemukan
      return {
        success: false,
        message: `Supplier dengan ID ${id} tidak ditemukan`,
      };
    }
    // Tangani kesalahan lainnya
    return {
      success: false,
      message: `Terjadi kesalahan: ${error.message}`,
    };
  }
};

module.exports={
  findsupplier,
  findsupplierById,
  insertsupplierRepo,
  updatesupplierRepo,
  deletesupplierByIdRepo
}