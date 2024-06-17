
const prisma = require("../db");
const findQcProduk = async (query) => {
  const {
    q,
    bulanTemuan,
    tahunTemuan,
    bulanSelesai,
    tahunSelesai,
    status,
    itemsPerPage,
    page,
  } = query;

  const take = parseInt(itemsPerPage) || 10;
  const skip = ((parseInt(page) || 1) - 1) * take;

  const where = {
    AND: [
      bulanTemuan && tahunTemuan
        ? { tanggal_temuan: { gte: new Date(tahunTemuan, bulanTemuan - 1, 1) } }
        : {},
      bulanSelesai && tahunSelesai
        ? { tanggal_selesai: { lte: new Date(tahunSelesai, bulanSelesai, 0) } }
        : {},
      status ? { status: status } : {},
      q ? { user: { karyawan: { nama: { contains: q, mode: 'insensitive' } } } } : {},
    ],
  };

  const qc_produk = await prisma.qc_produk.findMany({
    where,
    include: {
      daftar_produk: true,
      user: {
        include: {
          karyawan: true,
        },
      },
    },
    take,
    skip,
  });

  const totalData = await prisma.qc_produk.count({ where });

  const reshapedData = qc_produk.map((qc) => ({
    id: qc.id,
    tanggalTemuan: qc.tanggal_temuan ? qc.tanggal_temuan.toLocaleDateString() : null,
    tanggalSelesai: qc.tanggal_selesai ? qc.tanggal_selesai.toLocaleDateString() : null,
    idProduk: qc.daftar_produk.id,
    kodeProduk: qc.daftar_produk.kode,
    namaProduk: qc.daftar_produk.nama,
    kategoriProduk: qc.daftar_produk.kategori,
    ukuranProduk: qc.daftar_produk.ukuran,
    jumlah: qc.jumlah,
    tindakan: qc.tindakan,
    status: qc.status,
    catatan: qc.catatan,
    idPenggunaQc: qc.user.id,
    namaPenggunaQc: qc.user.karyawan ? qc.user.karyawan.nama : null,
  }));

  return {
    success: true,
    message: "Data QC produk berhasil diperoleh",
    dataTitle: "QC Bahan",
    itemsPerPage: take,
    totalPages: Math.ceil(totalData / take),
    totalData,
    page: page || "1",
    data: reshapedData,
  };
};
const findQcProdukById = async (id) => {
  const qc_produk = await prisma.qc_produk.findUnique({
    where: { id },
    include: {
      daftar_produk: true,
      user: {
        include: {
          karyawan: true,
        },
      },
    },
  });

  if (!qc_produk) {
    return {
      success: false,
      message: `Data QC produk dengan ID ${id} tidak ditemukan`,
      data: null,
    };
  }

  const reshapedData = {
    id: qc_produk.id,
    tanggalTemuan: qc_produk.tanggal_temuan ? qc_produk.tanggal_temuan.toLocaleDateString() : null,
    tanggalSelesai: qc_produk.tanggal_selesai ? qc_produk.tanggal_selesai.toLocaleDateString() : null,
    idOutlet: qc_produk.daftar_produk.id, // Assuming 'daftar_produk' has 'id' as outlet ID
    namaOutlet: qc_produk.daftar_produk.nama, // Assuming 'daftar_produk' has 'nama' as outlet name
    idVarian: qc_produk.daftar_produk.id, // Assuming 'daftar_produk' has 'id' as variant ID
    kodeProduk: qc_produk.daftar_produk.kode,
    namaProduk: qc_produk.daftar_produk.nama,
    kategoriProduk: qc_produk.daftar_produk.kategori,
    ukuranProduk: qc_produk.daftar_produk.ukuran,
    jumlah: qc_produk.jumlah,
    tindakan: qc_produk.tindakan,
    status: qc_produk.status,
    catatan: qc_produk.catatan,
    idPenggunaQc: qc_produk.user.id,
    namaPenggunaQc: qc_produk.user.karyawan ? qc_produk.user.karyawan.nama : null,
    rolePenggunaQc: qc_produk.user.karyawan ? qc_produk.user.karyawan.role : null,
    kontakPenggunaQc: qc_produk.user.karyawan ? qc_produk.user.karyawan.kontak : null,
  };

  return {
    success: true,
    message: `Data QC produk dengan ID ${id} berhasil diperoleh`,
    data: reshapedData,
  };
};
const insertQcProdukRepo = async (newprodukData) => {
  
  try {
    const { daftar_produk_id, user_id, tindakan, jumlah, catatan, status } = newprodukData;

    // Insert data into qc_produk
    const createdQcProduk = await prisma.qc_produk.create({
      data: {
        daftar_produk: {
          connect: {
            id: parseInt(daftar_produk_id),
          },
        },
        user: {
          connect: {
            id: parseInt(user_id),
          },
        },
        tindakan,
        jumlah: parseInt(jumlah),
        catatan,
        status,
      },
    });

    return createdQcProduk;
  } catch (error) {
    console.error('Error inserting qc_produk:', error);
    throw error
  }
};




const updateQcProdukRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.qc_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "qc_produk not found" });
      }

      // Validate and update the qc_produk data
      const updatedProduk = await prisma.qc_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode_produk: updatedProdukData.kode_produk || existingProduk.kode_produk,
          sku: updatedProdukData.sku || existingProduk.sku,
          nama_produk: updatedProdukData.nama_produk || existingProduk.nama_produk,
          stok: parseInt(updatedProdukData.stok) || existingProduk.stok,
      harga_jual: parseFloat(updatedProdukData.harga_jual) || existingProduk.harga_jual,

      },
      });
      return updatedProduk
}
const deleteQcProdukByIdRepo = async(id)=>{
  await prisma.qc_produk.delete({
    where: { id: id },
  });
}
module.exports={
  findQcProduk,
  findQcProdukById,
  insertQcProdukRepo,
  updateQcProdukRepo,
  deleteQcProdukByIdRepo
}