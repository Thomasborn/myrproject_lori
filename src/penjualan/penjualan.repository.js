
const prisma = require("../db");
const findPenjualan = async (bulanTransaksi, tahunTransaksi, metodePembayaran, idOutlet, itemsPerPage = 10, page = 1) => {
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * itemsPerPage;

    // Prepare base where condition
    let whereCondition = {};

    // Check and add conditions based on provided parameters
    if (bulanTransaksi !== undefined && bulanTransaksi !== null) {
      whereCondition = {
        ...whereCondition,
        waktu: {
          gte: new Date(`${tahunTransaksi}-${bulanTransaksi}-01`),
          lt: new Date(`${tahunTransaksi}-${bulanTransaksi}-31`)
        }
      };
    }

    if (tahunTransaksi !== undefined && tahunTransaksi !== null) {
      whereCondition = {
        ...whereCondition,
        waktu: {
          ...(whereCondition.waktu || {}),
          gte: new Date(`${tahunTransaksi}-${bulanTransaksi || '01'}-01`),
          lt: new Date(`${tahunTransaksi}-${bulanTransaksi || '12'}-31`)
        }
      };
    }

    if (metodePembayaran !== undefined && metodePembayaran !== null) {
      whereCondition = {
        ...whereCondition,
        metode_pembayaran: metodePembayaran
      };
    }

    if (idOutlet !== undefined && idOutlet !== null) {
      whereCondition = {
        ...whereCondition,
        user: { outlet_id: idOutlet }
      };
    }

    // Fetch penjualan with filtering and pagination
    const penjualan = await prisma.penjualan.findMany({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined, // Only include where condition if it's not empty
      skip: offset,
      take: itemsPerPage,
      include: {
        detail_penjualan: {
          include: {
            produk:true
          }
        },
        user: {
          include:{
            karyawan:{
              include:{
                outlets:true
              }
            }
          }
        }
      }
    });

    // Fetch total count for pagination metadata
    const totalData = await prisma.penjualan.count({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined // Only include where condition if it's not empty
    });

    const totalPages = Math.ceil(totalData / itemsPerPage);

    // Reshape the response
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
        tanggal: p.waktu.toLocaleDateString('id-ID'),
        waktu: p.waktu.toLocaleTimeString('id-ID'),
        metodePembayaran: p.metode_pembayaran,
        idPenggunaSales: p.user_id,
        namaPenggunaSales: p.user.nama,
        totalTransaksi: p.total,
        idOutlet: idOutlet,
        namaOutlet: p.user.karyawan.outlets.nama,
        jumlahItem: p.detail_penjualan.length
      }))
    };

    return reshapedResponse;

  } catch (error) {
    // Handle errors here
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
                outlets:true
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
        idOutlet: penjualan.user.karyawan.outlets.id, // Adjust field based on your schema
        namaOutlet: penjualan.user.karyawan.outlets ? penjualan.user.karyawan.outlets.nama : null, // Adjust field based on your schema
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
  
  const { total, metode_pembayaran, waktu, user_id}= newPenjualanData;

  // Perform the insert operation using Prisma
  
  const insertedPenjualan = await prisma.penjualan.create({
    data: {
      total,
      waktu,
      metode_pembayaran,
      user_id,
    },
  });
  return insertedPenjualan;
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