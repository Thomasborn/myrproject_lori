const { PrismaClient, PrismaClientKnownRequestError } = require('@prisma/client');
const prisma = require("../db");
const {
  insertModelProduk,
  getDaftarProdukById
} = require("../daftar_produk/daftar_produk.service");
const findProduk = async (query) => {
  const { q, bulanMulai, tahunMulai, bulanSelesai, tahunSelesai, status, itemsPerPage, page } = query;

  // Construct the start date for the range
  const startDate = bulanMulai && tahunMulai ? new Date(`${tahunMulai}-${bulanMulai}-01`) : null;
  // Construct the end date for the range
  const endDate = bulanSelesai && tahunSelesai ? new Date(`${tahunSelesai}-${bulanSelesai}-01`) : null;
  if (endDate) endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
  if (endDate) endDate.setDate(0); // Get the last date of the month

  const whereConditions = {
    ...(status && { status }),
    ...(startDate && {
      tanggal_mulai: {
        gte: startDate,
      },
    }),
    ...(endDate && {
      tanggal_selesai: {
        lte: endDate,
      },
    }),
    ...(q && {
      user: {
        karyawan: {
          nama: {
            contains: q,
            mode: 'insensitive',
          },
        },
      },
    }),
  };

  const produksi = await prisma.produksi.findMany({
    where: whereConditions,
    include: {
      detail_model_produk: {
        include: {
          model_produk: true,
        },
      },
      user: {
        include: {
          karyawan: true,
        },
      },
    },
    take: parseInt(itemsPerPage, 10),
    skip: parseInt(itemsPerPage, 10) * (parseInt(page, 10) - 1),
  });

  const totalData = await prisma.produksi.count({
    where: whereConditions,
  });

  const totalPages = Math.ceil(totalData / parseInt(itemsPerPage, 10));

  const reshapedData = produksi.map((item) => ({
    id: item.id,
    tanggalMulai: item.tanggal_mulai.toLocaleDateString(),
    tanggalSelesai: item.tanggal_selesai ? item.tanggal_selesai.toLocaleDateString() : null,
    ukuran: item.detail_model_produk.ukuran || 'Unknown', // Adjust based on your data structure
    jumlah: item.jumlah,
    status: item.status,
    produk: item.detail_model_produk.model_produk.nama || 'Unknown', // Adjust based on your data structure
    namaPenggunaPenjahit: item.user.karyawan.nama, // Ensure this path is correct
  }));

  return {
    success: true,
    message: 'Data produksi berhasil diperoleh',
    dataTitle: 'Produksi',
    itemsPerPage: parseInt(itemsPerPage, 10),
    totalPages,
    totalData,
    page: page.toString(),
    data: reshapedData,
  };
};

const findProduksiById = async (id) => {
  const produksi = await prisma.produksi.findFirst({
    where: { id },
    include: {
      detail_model_produk: {
        include: {
          model_produk: true,
        },
      },
      user: {
        include: {
          karyawan: true,
        },
      },
    },
  });

  if (!produksi) {
    return {
      success: false,
      message: `Data produksi dengan ID ${id} tidak ditemukan`,
      data: null,
    };
  }

  const bahanProduk = await prisma.bahan_produk.findMany({
    where: { detail_model_produk_id: produksi.detail_model_produk_id },
    include: { daftar_bahan: true },
  });

  const reshapedData = {
    id: produksi.id,
    tanggalMulai: produksi.tanggal_mulai.toLocaleDateString(),
    tanggalSelesai: produksi.tanggal_selesai ? produksi.tanggal_selesai.toLocaleDateString() : null,
    idProduk: produksi.detail_model_produk.id,
    ukuran: produksi.detail_model_produk.ukuran || 'Unknown',
    jumlah: produksi.jumlah,
    status: produksi.status,
    catatan: produksi.catatan || null,
    idPenggunaPenjahit: produksi.user.id,
    idPenggunaReviewer: produksi.id_reviewer || null,
    produk: produksi.detail_model_produk.model_produk.nama || 'Unknown',
    namaPenggunaPenjahit: produksi.user.karyawan.nama,
    kodeProduk: produksi.detail_model_produk.model_produk.kode,
    namaProduk: produksi.detail_model_produk.model_produk.nama || 'Unknown',
    kategoriProduk: produksi.detail_model_produk.model_produk.kategori || 'Unknown',
    bahan: bahanProduk.map((bahan) => ({
      id: bahan.id,
      jumlahPakai: bahan.jumlah,
      kode: bahan.daftar_bahan.kode,
      nama: bahan.daftar_bahan.nama,
      kategori: bahan.daftar_bahan.kategori,
      satuan: bahan.daftar_bahan.satuan,
    })),
    biayaJahit: produksi.biaya_jahit || 0,
    rolePenggunaPenjahit: produksi.user.karyawan.role || 'Unknown',
    kontakPenggunaPenjahit: produksi.user.karyawan.kontak || 'Unknown',
  };

  return {
    success: true,
    message: `Data produksi dengan ID ${id} berhasil diperoleh`,
    data: reshapedData,
  };
};

const insertProduksiRepo = async (newProdukData) => {
  const { tanggalMulai, idProduk, produk, ukuran, jumlah, catatan, idPenggunaPenjahit, namaPenggunaPenjahit } = newProdukData;
  const [day, month, year] = tanggalMulai.split('/');
  const formattedDate = new Date(`${year}-${month}-${day}`);
  const createdProduksi = await prisma.produksi.create({
    data: {
      tanggal_mulai: formattedDate,
      status: "pengerjaan",
      detail_model_produk: { connect: { id: idProduk } },
      user: { connect: { id: idPenggunaPenjahit } },
      jumlah,
      catatan,
    },
    include: {
      detail_model_produk: {
        include: {
          model_produk: true,
        },
      },
      user: {
        include: {
          karyawan: true,
        },
      },
    },
  });
  
  // const daftar_produk = await getDaftarProdukById(createdProduksi.detail_model_produk.id);
  const reshapedData = {
    id: createdProduksi.id,
    tanggalMulai: createdProduksi.tanggal_mulai.toLocaleDateString(),
    idProduk: createdProduksi.detail_model_produk.id,
    produk: createdProduksi.detail_model_produk.model_produk.nama,
    ukuran: ukuran || createdProduksi.detail_model_produk.model_produk.ukuran,
    jumlah: createdProduksi.jumlah,
    catatan: createdProduksi.catatan || null,
    idPenggunaPenjahit: createdProduksi.user.id,
    namaPenggunaPenjahit: createdProduksi.user.karyawan.nama,
  };

  return {
    success: true,
    message: `Data produksi bahan berhasil ditambahkan dengan ID ${createdProduksi.id}`,
    data: reshapedData,
  };
};

const updateStokBahanProduksi = async (bahanId, jumlah, type) => {
  if (type === 'deduction') {
    return await prisma.daftar_bahan.update({
      where: { id: bahanId },
      data: { stok: { decrement: jumlah } }
    });
  } else if (type === 'addition') {
    return await prisma.daftar_bahan.update({
      where: { id: bahanId },
      data: { stok: { increment: jumlah } }
    });
  }
};
// Function to generate a unique SKU
const generateSKU = (detailModelProdukId, jumlah) => {
  return `SKU-${detailModelProdukId}-${jumlah}-${Date.now()}`;
};
const updateProduksiRepo = async (id, updatedProduksiData) => {
  let transaction;
  try {
    // Fetch the current status of the record
    const existingProduksi = await prisma.produksi.findUnique({
      where: { id: id },
      include: {
        detail_model_produk: {
          include: {
            bahan_produk: {
              include: {
                daftar_bahan: true // Assuming varian has a relation to bahan
              }
            }
          }
        },
        user: true,
        reviewer: true
      }
    });

    if (!existingProduksi) {
      return {
        success: false,
        message: `Data produksi dengan ID ${id} tidak ditemukan`,
      };
    }
    if (existingProduksi.status === 'selesai') {
      return {
        success: false,
        message: 'Data produksi dengan status SELESAI tidak dapat diperbarui.',
      };
    }
    const existingStatus = existingProduksi.status;
    const newStatus = updatedProduksiData.status;

    // Prepare the data for update, including only the specified fields
    const data = {};
    if (newStatus !== undefined) data.status = newStatus;
    if (updatedProduksiData.catatan !== undefined) data.catatan = updatedProduksiData.catatan;
    if (updatedProduksiData.idPenggunaReviewer !== undefined) data.id_reviewer = updatedProduksiData.idPenggunaReviewer;

    // Begin a transaction to ensure data consistency
    transaction = await prisma.$transaction(async (tx) => {
      // Perform the update operation
      const updatedProduksi = await tx.produksi.update({
        where: { id: id },
        data: data,
        include: {
          detail_model_produk: true
        }
      });

      // Check status changes and update stocks accordingly
      if (existingStatus !== newStatus) {
        if (existingStatus === 'batal') {
          // Decrease stock in daftar_bahan
          await updateStokBahanProduksi(existingProduksi.detail_model_produk.varian.bahan.id, existingProduksi.jumlah, 'deduction');
        }
        if (newStatus === 'selesai') {
          // Increase stock in produk_outlet with id outlet = 1
          await tx.produk_outlet.updateMany({
            where: {
              outlet_id: 1,
              produk_id: existingProduksi.detail_model_produk.id
            },
            data: {
              jumlah: { increment: existingProduksi.jumlah }
            }
          });

          // Create entry in daftar_produk
           // Create entry in daftar_produk
           await tx.daftar_produk.create({
            data: {
              detail_model_produk_id: existingProduksi.detail_model_produk.id,
              jumlah: existingProduksi.jumlah,
              sku: generateSKU(existingProduksi.detail_model_produk.id, existingProduksi.jumlah),
              // Add other necessary fields for daftar_produk
            }
          });
        } else if (newStatus === 'batal') {
          // Increase stock in daftar_bahan
          await updateStokBahanProduksi(existingProduksi.detail_model_produk.varian.bahan.id, existingProduksi.jumlah, 'addition');
        }
      }

      return updatedProduksi;
    });

    // Reshape the response
    const reshapedResponse = {
      success: true,
      message: `Data produksi dengan ID ${id} berhasil diperbarui`,
      data: {
        id: existingProduksi.id,
        tanggalMulai: existingProduksi.tanggal_mulai.toLocaleDateString('id-ID'), // Format the date as DD/MM/YYYY
        tanggalSelesai: existingProduksi.tanggal_selesai ? existingProduksi.tanggal_selesai.toLocaleDateString('id-ID') : null,
        idVarian: existingProduksi.detail_model_produk_id,
        ukuran: existingProduksi.detail_model_produk.ukuran, // Assuming 'ukuran' is a field in detail_model_produk
        jumlah: existingProduksi.jumlah,
        status: updatedProduksiData.status,
        catatan: updatedProduksiData.catatan,
        idPenggunaPenjahit: existingProduksi.user_id,
        idPenggunaReviewer: existingProduksi.id_reviewer,
        produk: existingProduksi.detail_model_produk.nama, // Assuming 'nama' is a field in detail_model_produk representing the product name
        namaPenggunaPenjahit: existingProduksi.user.nama // Assuming 'nama' is a field in user representing the name of the tailor
      }
    };

    return reshapedResponse;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return {
        success: false,
        message: `Data produksi dengan ID ${id} tidak ditemukan`,
      };
    } else {
      console.error("Error updating produksi record: ", error);
      throw error;
    }
  } finally {
    if (transaction) {
      await prisma.$disconnect();
    }
  }
};
const deleteproduksiByIdRepo = async (id) => {
  try {
    // Fetch the existing produksi record
    const existingProduksi = await prisma.produksi.findUnique({
      where: { id: id },
    });

    if (!existingProduksi) {
      return {
        success: false,
        message: `Data produksi dengan ID ${id} tidak ditemukan`,
      };
    }

    // Check if the status is 'batal'
    if (existingProduksi.status !== 'batal') {
      return {
        success: false,
        message: 'Hanya data produksi dengan status BATAL yang dapat dihapus.',
      };
    }

    // Proceed with deletion
    await prisma.produksi.delete({
      where: { id: id },
    });

    return {
      success: true,
      message: `Data produksi dengan ID ${id} berhasil dihapus`,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return {
        success: false,
        message: `Data produksi dengan ID ${id} tidak ditemukan`,
      };
    } else {
      console.error("Error deleting produksi record: ", error);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
};
module.exports={
  findProduk,
  findProduksiById,
  insertProduksiRepo,
  updateProduksiRepo,
  deleteproduksiByIdRepo
}