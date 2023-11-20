
const prisma = require("../db");

const findQcProduk = async () => {
  const qc_produk = await prisma.qc_produk.findMany({
    include: {
      // Include related data from 'qc_produk_produk' and 'kondisi_produk'
      daftar_produk: true,
      user: true,
    },
  });
  
  // Now 'qc_produks' contains the details with related 'qc_produk_produk' and 'kondisi_produk'
  
  return qc_produk;
};

const findQcProdukById = async (id) => {
  const qc_produk = await prisma.qc_produk.findUnique({
    where: {
      id,
    },
  });
  
  return qc_produk;
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