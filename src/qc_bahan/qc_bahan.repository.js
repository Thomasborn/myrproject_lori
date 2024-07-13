
const prisma = require("../db");

const findQcBahan = async () => {
  const qc_bahan = await prisma.qc_bahan.findMany({
    include: {
      // Include related data from 'qc_bahan_produk' and 'kondisi_produk'
      daftar_bahan: true,
      user: true,
    },
  });
  
  // Now 'qc_bahans' contains the details wihth related 'qc_bahan_produk' and 'kondisi_produk'
  
  return qc_bahan;
};

const findQcBahanById = async (id) => {
  const qc_bahan = await prisma.qc_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return qc_bahan;
};
const insertQcBahanRepo = async (newprodukData) => {
  
  try {
    const {
      daftar_bahan_id,
      user_id,
      tindakan,
      jumlah,
      catatan,
      status,
      qc_produk_id,
    } = newprodukData;

    // Perform the insert operation using Prisma
    const createdQcBahan = await prisma.qc_bahan.create({
      data: {
        daftar_bahan_id,
        user_id,
        tindakan,
        jumlah,
        catatan,
        status,
        qc_produk_id,
      },
    });

    return createdQcBahan;
  } catch (error) {
    console.error('Error inserting qc_bahan:', error);
    throw error
  }
};




const updateQcBahanRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.qc_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "qc_bahan not found" });
      }

      // Validate and update the qc_bahan data
      const updatedProduk = await prisma.qc_bahan.update({
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
const deleteQcBahanByIdRepo = async(id)=>{
  await prisma.qc_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findQcBahan,
  findQcBahanById,
  insertQcBahanRepo,
  updateQcBahanRepo,
  deleteQcBahanByIdRepo
}