
const prisma = require("../db");
const moment = require('moment-timezone');
const stokBahan = require("../stok_bahan/stok_bahan.service");
const findRestokBahan = async (queryParams) => {
  const { bulanPesan, tahunPesan, bulanTerima, tahunTerima, status, itemsPerPage, page } = queryParams;

  let whereCondition = {
    AND: [
      bulanPesan && tahunPesan && { tanggal_pesan: { gte: new Date(`${tahunPesan}-${bulanPesan}-01`), lt: new Date(`${tahunPesan}-${parseInt(bulanPesan)+1}-01`) } },
      bulanTerima && tahunTerima && { tanggal_terima: { gte: new Date(`${tahunTerima}-${bulanTerima}-01`), lt: new Date(`${tahunTerima}-${parseInt(bulanTerima)+1}-01`) } }
    ].filter(Boolean)
  };

  if (status) {
    whereCondition.AND.push({ status });
  }

  const restok_bahan = await prisma.restok_bahan.findMany({
    where: whereCondition,
    include: {
      supplier: { select: { nama: true } },
      daftar_bahan: { select: { nama: true, satuan: true } }
    },
    take: parseInt(itemsPerPage) || 10,
    skip: (parseInt(page) - 1) * parseInt(itemsPerPage) || 0
  });

  const totalData = await prisma.restok_bahan.count({
    where: whereCondition
  });

  const totalPages = Math.ceil(totalData / (parseInt(itemsPerPage) || 10));

  return {
    success: true,
    message: "Data pengadaan bahan berhasil diperoleh",
    dataTitle: "Pengadaan Bahan",
    itemsPerPage: parseInt(itemsPerPage) || 10,
    totalPages: totalPages,
    totalData: totalData,
    page: parseInt(page) || null,
    data: restok_bahan.map(item => ({
      id: item.id,
      tanggalPesan: item.tanggal_pesan.toLocaleDateString('en-US'),
      estimasiTanggalTerima: item.tanggal_terima ? item.tanggal_terima.toLocaleDateString('en-US') : null,
      pemasok: item.supplier.nama,
      pengguna: item.pengguna,
      tanggalTerima: item.tanggal_terima ? item.tanggal_terima.toLocaleDateString('en-US') : null,
      namaBahan: item.daftar_bahan.nama,
      jumlahBahan: item.jumlah,
      satuanBahan: item.daftar_bahan.satuan,
      status: item.status
    }))
  };
};


const findRestokBahanById = async (id) => {
  const restok_bahan = await prisma.restok_bahan.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      supplier: {
        select: {
          id: true,
          nama: true,
          pic: true,
          alamat: true,
          kontak: true,
          no_rek: true
        }
      },
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          status: true,
          karyawan: {
            select: {
              nama: true,
        
              kontak: true,
       
            }
          },
          role: {
            select: {
              nama: true,
      
            }
          }
        }
      },
      daftar_bahan: {
        select: {
          id: true,
          kode: true,
          nama: true,
          harga: true,
          satuan: true
        }
      }
    }
  });

  if (!restok_bahan) {
    return {
      success: false,
      message: "Data pengadaan bahan dengan ID " + id + " tidak ditemukan"
    };
  }

  return {
    success: true,
    message: "Data pengadaan bahan dengan ID " + id + " berhasil diperoleh",
    data: {  id: restok_bahan.id,
      tanggalPesan: restok_bahan.tanggal_pesan.toLocaleDateString('en-US'),
      estimasiTanggalTerima: restok_bahan.tanggal_estimasi ? restok_bahan.tanggal_estimasi.toLocaleDateString('en-US') : null,
      idPemasok: restok_bahan.supplier.id,
      pemasok: restok_bahan.supplier.nama,
      picPemasok: restok_bahan.supplier.pic,
      alamatPemasok: restok_bahan.supplier.alamat,
      kontakPemasok: restok_bahan.supplier.kontak,
      idPengguna: restok_bahan.user.id,
      pengguna: restok_bahan.user.nama,
      tanggalTerima: restok_bahan.tanggal_terima ? restok_bahan.tanggal_terima.toLocaleDateString('en-US') : null,
      idBahan: restok_bahan.daftar_bahan.id,
      kodeBahan: restok_bahan.daftar_bahan.kode,
      namaBahan: restok_bahan.daftar_bahan.nama,
      hargaBahan: restok_bahan.daftar_bahan.harga,
      jumlahBahan: restok_bahan.jumlah,
      satuanBahan: restok_bahan.daftar_bahan.satuan,
      biayaBahan: restok_bahan.daftar_bahan.harga * restok_bahan.jumlah,
      status: restok_bahan.status,
      catatan: restok_bahan.catatan,
      namaPengguna: restok_bahan.user.karyawan.nama,
      rolePengguna: restok_bahan.user.role.nama,
      kontakPengguna: restok_bahan.user.karyawan.kontak,
    }
  };
};
const insertRestokBahanRepo = async (newRestokBahanData) => {
  const { tanggalPesan, estimasiTanggalTerima, idPemasok, pemasok, idPengguna, pengguna, bahan } = newRestokBahanData;
  const [pesanDay, pesanMonth, pesanYear] = tanggalPesan.split('/');
  // const tanggalPesanDate = new Date(`${pesanYear}-${pesanMonth}-${pesanDay}`);
  const tanggalPesanDate = moment.tz('Asia/Jakarta').format();;
  
  const [estimasiDay, estimasiMonth, estimasiYear] = estimasiTanggalTerima.split('/');
  const estimasiTanggalTerimaDate = new Date(`${estimasiYear}-${estimasiMonth}-${estimasiDay}`);

  // Check if the required user record exists
  const existingUser = await prisma.user.findUnique({
    where: { id: idPengguna }
  });

  if (!existingUser) {
    return {
      success: false,
      status: 404,
      message: "Pengguna dengan id : "+idPengguna+" tidak ditemukan"
    };
    
  }

  const restok_bahanPromises = [];

  for (const item of bahan) {
    restok_bahanPromises.push(prisma.restok_bahan.create({
      data: {
        tanggal_pesan: tanggalPesanDate,
        tanggal_estimasi: estimasiTanggalTerimaDate,
        supplier: {
          connect: { id: idPemasok }
        },
        user: {
          connect: { id: idPengguna }
        },
        daftar_bahan: {
          connect: { id: item.idBahan }
        },
        jumlah: item.jumlahBahan,
        harga_satuan: item.hargaBahan,
        status: "Pengiriman"
      }
    }));
  }

  const restok_bahan = await Promise.all(restok_bahanPromises);

  const responseData = restok_bahan.map((item, index) => ({
    id: item.id,
    tanggalPesan: item.tanggal_pesan.toLocaleDateString('en-US'),
    estimasiTanggalTerima: item.tanggal_estimasi.toLocaleDateString('en-US'),
    idPemasok: idPemasok,
    pemasok: pemasok,
    idPengguna: idPengguna,
    pengguna: pengguna,
    tanggalTerima: null,
    idBahan: bahan[index].idBahan,
    namaBahan: bahan[index].namaBahan,
    jumlahBahan: bahan[index].jumlahBahan,
    hargaBahan: bahan[index].hargaBahan
  }));

  return {
    success: true,
    message: `${responseData.length} Data Pengadaan bahan berhasil ditambahkan`,
    data: responseData
  };
  
};


const updateRestokBahanRepo = async (id, updatedRestokBahanData) => {
  const { catatan, status } = updatedRestokBahanData;

  let updateData = {
    catatan: catatan,
    status: status
  };

  // Check if tanggal_terima is not null or status is 'Diterima'
  if (status === 'Diterima') {
    updateData.tanggal_terima = moment().tz('Asia/Jakarta').format();
  }

  const restokBahan = await prisma.restok_bahan.findUnique({
    where: { id: parseInt(id) },
    select: {
      daftar_bahan_id: true,
      jumlah: true,
      tanggal_terima: true
    }
  });

  if (!restokBahan) {
    return {
      success: false,
      message: `Pengadaan bahan dengan ID ${id} tidak ditemukan.`
    };
  }

  // Check if tanggal_terima is  null or status is 'Diterima'
  if (!restokBahan.tanggal_terima && status === 'Diterima') {
    // Update the stok in daftar_bahan
    await prisma.daftar_bahan.update({
      where: { id: restokBahan.daftar_bahan_id },
      data: {
        stok: {
          increment: restokBahan.jumlah
        }
      }
    });
  }

  try {
    const updatedRestokBahan = await prisma.restok_bahan.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return {
      success: true,
      message: 'Data Pengadaan bahan berhasil diperbarui',
      data: updatedRestokBahan
    };
  } catch (error) {
    console.error('Error updating Pengadaan bahan:', error);
    return {
      success: false,
      message: 'Error updating Pengadaan bahan',
      error: error.message
    };
  }
};
const deleteRestokBahanByIdRepo = async (id) => {
  try {
    const restokBahan = await prisma.restok_bahan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!restokBahan) {
      return {
        success: false,
        message: `Pengadaan bahan dengan ID ${id} tidak ditemukan.`
      };
    }

    if (restokBahan.tanggal_terima) {
      // Jika tanggal_terima sudah ada, maka update stok di daftar_bahan
      await prisma.daftar_bahan.update({
        where: { id: restokBahan.daftar_bahan_id },
        data: {
          stok: {
            decrement: restokBahan.jumlah
          }
        }
      });
    }

    // Hapus restok_bahan
    await prisma.restok_bahan.delete({
      where: { id: parseInt(id) }
    });

    return {
      success: true,
      message: `Pengadaan bahan dengan ID ${id} berhasil dihapus.`
    };
  } catch (error) {
    console.error('Error menghapus Pengadaan bahan:', error);
    return {
      success: false,
      message: 'Error menghapus Pengadaan bahan',
      error: error.message
    };
  }
};

module.exports={
  findRestokBahan,
  findRestokBahanById,
  insertRestokBahanRepo,
  updateRestokBahanRepo,
  deleteRestokBahanByIdRepo
}