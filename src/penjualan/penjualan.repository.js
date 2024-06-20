
const prisma = require("../db");
const findPenjualan = async (query) => {
  try {
    let { bulanTransaksi, tahunTransaksi, metodePembayaran, idOutlet, q, itemsPerPage = 10, page = 1 } = query;
    const offset = (page - 1) * itemsPerPage;
    let whereCondition = {};

    // Pastikan bulanTransaksi dan tahunTransaksi dalam format yang benar
    bulanTransaksi = bulanTransaksi ? bulanTransaksi.toString().padStart(2, '0') : null;
    tahunTransaksi = tahunTransaksi ? tahunTransaksi.toString() : null;

    if (tahunTransaksi !== undefined && tahunTransaksi !== null) {
      if (bulanTransaksi !== undefined && bulanTransaksi !== null) {
        const startDate = new Date(`${tahunTransaksi}-${bulanTransaksi}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

        whereCondition.waktu = {
          gte: startDate,
          lt: endDate
        };
      } else {
        const startDate = new Date(`${tahunTransaksi}-01-01`);
        const endDate = new Date(`${parseInt(tahunTransaksi) + 1}-01-01`);

        whereCondition.waktu = {
          gte: startDate,
          lt: endDate
        };
      }
    }

    if (metodePembayaran !== undefined && metodePembayaran !== null) {
      whereCondition.metode_pembayaran = metodePembayaran;
    }

    // Pastikan idOutlet dalam format yang benar sebelum digunakan dalam pencarian
    idOutlet = idOutlet ? parseInt(idOutlet) : null;
    if (idOutlet !== undefined && idOutlet !== null) {
      whereCondition.user = {
        karyawan: {
          outlet_id: idOutlet
        }
      };
    }

    if (q !== undefined && q !== null) {
      whereCondition.OR = [
        { user: { karyawan: { nama: { contains: q, mode: 'insensitive' } } } }
      ];
    }

    const penjualan = await prisma.penjualan.findMany({
      where: whereCondition,
      skip: offset,
      take: parseInt(itemsPerPage),
      include: {
        detail_penjualan: {
          include: {
            produk: true
          }
        },
        user: {
          include: {
            karyawan: {
              include: {
                outlet: true
              }
            }
          }
        }
      }
    });

    const totalData = await prisma.penjualan.count({
      where: whereCondition
    });

    const totalPages = Math.ceil(totalData / itemsPerPage);

    const reshapedResponse = {
      success: true,
      message: "Data penjualan berhasil diperoleh",
      dataTitle: "Penjualan",
      itemsPerPage: itemsPerPage,
      totalPages: totalPages,
      totalData: totalData,
      page: page,
      data: penjualan.map(p => ({
        id: p.id,
        tanggal: p.waktu.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        waktu: p.waktu.toLocaleTimeString('id-ID'),
        metodePembayaran: p.metode_pembayaran,
        idPenggunaSales: p.user_id,
        namaPenggunaSales: p.user.karyawan.nama,
        totalTransaksi: p.total,
        idOutlet: p.user.karyawan.outlet.id,
        namaOutlet: p.user.karyawan.outlet.nama,
        jumlahItem: p.detail_penjualan.length
      }))
    };

    return reshapedResponse;

  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Gagal memperoleh data penjualan"
    };
  }
};



const findPenjualanById = async (id) => {
  try {
    // Fetch the penjualan record by its ID, including related detail_penjualan and daftar_produk
    const penjualan = await prisma.penjualan.findUnique({
      where: { id: id },
      include: {
        detail_penjualan: {
          include: {
            produk: {
              include:{
                model_produk:{
                  include:{
                    kategori:true
                  }
                }
              }
            }
          }
        },
        user: {
          include:{
            karyawan:{
              include:{
                outlet:true
              }
            }
          }
        }
      }
    });

    if (!penjualan) {
      return {
        success: false,
        message: `Data penjualan dengan ID ${id} tidak ditemukan`,
      };
    }

    // Reshape the response
    const reshapedResponse = {
      success: true,
      message: "Data penjualan berhasil diperoleh",
      data: {
        id: penjualan.id,
        tanggal: penjualan.waktu.toLocaleDateString('id-ID'),
        waktu: penjualan.waktu.toLocaleTimeString('id-ID'),
        metodePembayaran: penjualan.metode_pembayaran,
        transaksi: penjualan.detail_penjualan.map(t => ({
          idVarian: t.produk.id,
          kodeProduk: t.produk.model_produk.nama,
          namaProduk: t.produk.model_produk.nama,
          kategoriProduk: t.produk.model_produk.kategori.nama,
          ukuranProduk: t.produk.ukuran,
          hargaProduk: t.produk.harga_jual,
          jumlah: t.jumlah
        })),
        idPenggunaSales: penjualan.user_id,
        namaPenggunaSales: penjualan.user.karyawan.nama,
        totalTransaksi: penjualan.total,
        idOutlet: penjualan.user.karyawan.outlet.id, // Adjust field based on your schema
        namaOutlet: penjualan.user.karyawan.outlet ? penjualan.user.karyawan.outlet.nama : null, // Adjust field based on your schema
        jumlahItem: penjualan.detail_penjualan.length
      }
    };

    return reshapedResponse;
  } catch (error) {
    console.error("Error fetching penjualan detail: ", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const findDetailPenjualan = async () => {
  const detailPenjualan = await prisma.detail_penjualan.findMany();

  return detailPenjualan;
};
const findDetailPenjualanById = async (id) => {
  try {
    // Fetch the penjualan record by its ID, including related detail_penjualan and daftar_produk
    const penjualan = await prisma.penjualan.findUnique({
      where: { id: id },
      include: {
        detail_penjualan: {
          include: {
            produk: true
          }
        },
        user: true // Assuming there is a user relation
      }
    });

    if (!penjualan) {
      return {
        success: false,
        message: `Data penjualan dengan ID ${id} tidak ditemukan`,
      };
    }

    // Reshape the response
    const reshapedResponse = {
      success: true,
      message: "Data penjualan berhasil diperoleh",
      data: {
        id: penjualan.id,
        tanggal: penjualan.waktu.toLocaleDateString('id-ID'),
        waktu: penjualan.waktu.toLocaleTimeString('id-ID'),
        metodePembayaran: penjualan.metode_pembayaran,
        transaksi: penjualan.detail_penjualan.map(t => ({
          idVarian: t.produk.id,
          kodeProduk: t.produk.kode_produk,
          namaProduk: t.produk.nama_produk,
          kategoriProduk: t.produk.kategori_produk,
          ukuranProduk: t.produk.ukuran_produk,
          hargaProduk: t.produk.harga_produk,
          jumlah: t.jumlah
        })),
        idPenggunaSales: penjualan.user_id,
        namaPenggunaSales: penjualan.user.nama,
        totalTransaksi: penjualan.total,
        idOutlet: penjualan.user.outlet_id, // Adjust field based on your schema
        namaOutlet: penjualan.user.outlet ? penjualan.user.outlet.nama : null, // Adjust field based on your schema
        jumlahItem: penjualan.detail_penjualan.length
      }
    };

    return reshapedResponse;
  } catch (error) {
    console.error("Error fetching penjualan detail: ", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
const insertPenjualanRepo = async (newPenjualanData) => {
  try {
    // Destruktur data yang diperlukan dari newPenjualanData
    const {
      idOutlet,
      idPenggunaSales,
      jumlahItem,
      metodePembayaran,
      namaOutlet,
      namaPenggunaSales,
      tanggal,
      totalTransaksi,
      transaksi,
      waktu
    } = newPenjualanData;

    // Gabungkan tanggal dan waktu menjadi satu objek DateTime
    const penjualanDateTime = new Date(`${tanggal.split('/').reverse().join('-')}T${waktu}`);

    // Insert ke tabel penjualan
    const createdPenjualan = await prisma.penjualan.create({
      data: {
        total: totalTransaksi,
        metode_pembayaran: metodePembayaran,
        waktu: penjualanDateTime,
        user_id: idPenggunaSales,
      },
    });

    // Insert ke tabel detail_penjualan
    const detailPenjualanPromises = transaksi.map((item) => {
      return prisma.detail_penjualan.create({
        data: {
          jenis_transaksi: "default_value", // Sesuaikan dengan kebutuhan
          penjualan_id: createdPenjualan.id,
          produk_id: item.idVarian,
        },
      });
    });

    // Tunggu semua entri detail_penjualan selesai dibuat
    await Promise.all(detailPenjualanPromises);

    const response = {
      success: true,
      message: `Data penjualan berhasil ditambahkan dengan ID ${createdPenjualan.id}`,
      data: {
        id: createdPenjualan.id,
        tanggal,
        waktu,
        metodePembayaran,
        transaksi: transaksi.map(item => ({
          idVarian: item.idVarian,
          kodeProduk: item.kodeProduk,
          namaProduk: item.namaProduk,
          kategoriProduk: item.kategoriProduk,
          ukuranProduk: item.ukuranProduk,
          hargaProduk: item.hargaProduk,
          jumlah: item.jumlah
        })),
        idPenggunaSales,
        namaPenggunaSales,
        totalTransaksi,
        idOutlet,
        namaOutlet,
        jumlahItem
      }
    };

    console.log(response);
    return response;
  } catch (error) {
    console.error('Error membuat entri penjualan dan detail_penjualan:', error);
    return {
      success: false,
      message: 'Error membuat entri penjualan dan detail_penjualan',
      error: error.message
    };
  } finally {
    await prisma.$disconnect();
  }
};
const insertDetailPenjualanRepo = async (daftarDetailPenjualan,penjualan) => {
  
  const insertDetailPenjualan = await prisma.detail_penjualan.create({
    data: {
      jenis_transaksi:daftarDetailPenjualan.jenis_transaksi,
      penjualan_id:penjualan.id,
      daftar_produk_id:daftarDetailPenjualan.daftar_produk_id,
    },
  });

  return insertDetailPenjualan;
}
const insertFullPenjualan = async (newPenjualanData) => {
  
  const detailPenjualan= newPenjualanData.detail_penjualan;
  const penjualan = await insertPenjualanRepo(newPenjualanData);

  let insertedDetailPenjualan=[];
  for (const daftarDetailPenjualan of detailPenjualan) {
    
  const insertDetailPenjualan= await insertDetailPenjualanRepo(daftarDetailPenjualan,penjualan);

    insertedDetailPenjualan.push(insertDetailPenjualan);

  }

  return insertedDetailPenjualan;
}
const updatePenjualanRepo = async (id,updatedpenjualanData) => {
        const existingpenjualan = await prisma.penjualan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingpenjualan) {
            return res.status(404).json({ error: "penjualan not found" });
      }

      // Validate and update the penjualan data
      const updatedpenjualan = await prisma.penjualan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedpenjualanData.kategori || existingpenjualan.kategori.kategori
        
      },
      });;
      return updatedpenjualan;
};

const updateDetailPenjualanRepo = async (id,updatedpenjualanData) => {
        const existingDetailPenjualan = await prisma.detail_penjualan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingDetailPenjualan) {
            return ({ error: "detail penjualan not found" });
      }

      // Validate and update the penjualan data
      const updatedDetailPenjualan = await prisma.detail_penjualan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          daftar_produk_id: updatedpenjualanData.daftar_produk_id || existingDetailPenjualan.daftar_produk_id,
          penjualan_id: updatedpenjualanData.penjualan_id || existingDetailPenjualan.penjualan_id
        
      },
      });
      return updatedDetailPenjualan
}
const deletePenjualanByIdRepo = async(id)=>{
  await prisma.penjualan.delete({
    where: { id: id },
  });
}

const deleteDetailPenjualanByIdRepo = async(id)=>{
  await prisma.detail_penjualan.delete({
    where: { id: id },
  });
}
module.exports={
  findPenjualan,findDetailPenjualan,findDetailPenjualanById, findPenjualanById, insertPenjualanRepo, insertDetailPenjualanRepo,insertFullPenjualan, updateDetailPenjualanRepo,updatePenjualanRepo, deletePenjualanByIdRepo,deleteDetailPenjualanByIdRepo
}