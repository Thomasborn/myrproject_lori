
const prisma = require("../db");

const findbahan = async () => {
  const pembelian = await prisma.detail_pembelian_produk.findMany({
    include: {
      // Include related data from 'pembelian_produk' and 'kondisi_produk'
      pembelian_produk: true,
      kondisi_produk: true,
    },
  });
  
  // Now 'pembelian' contains the details with related 'pembelian_produk' and 'kondisi_produk'
  
  return pembelian;
};

const findbahanById = async (id) => {
  const pembelian = await prisma.detail_pembelian_produk.findUnique({
    where: {
      id,
    },
  });
  
  return pembelian;
};
const insertbahanRepo = async (newbahanData) => {
  
  const kode_produk = newbahanData.kode_produk;
  const sku = newbahanData.sku;
  const nama_produk = newbahanData.nama_produk;
  const stok = parseInt(newbahanData.stok);
  const harga_jual = parseFloat(newbahanData.harga_jual);
  const pembelian = await prisma.detail_pembelian_produk.create({
    data: {
      kode_produk,
      sku,
      nama_produk,
      stok,
      harga_jual,
      
    },
  });
  return pembelian
}
const updatebahanRepo = async (id,updatedbahanData) => {
        const existingbahan = await prisma.detail_pembelian_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingbahan) {
            return res.status(404).json({ error: "pembelian not found" });
      }

      // Validate and update the pembelian data
      const updatedbahan = await prisma.detail_pembelian_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode_produk: updatedbahanData.kode_produk || existingbahan.kode_produk,
          sku: updatedbahanData.sku || existingbahan.sku,
          nama_produk: updatedbahanData.nama_produk || existingbahan.nama_produk,
          stok: parseInt(updatedbahanData.stok) || existingbahan.stok,
      harga_jual: parseFloat(updatedbahanData.harga_jual) || existingbahan.harga_jual,

      },
      });
      return updatedbahan
}
const deletebahanByIdRepo = async(id)=>{
  await prisma.detail_pembelian_produk.delete({
    where: { id: id },
  });
}
module.exports={
  findbahan,
  findbahanById,
  insertbahanRepo,
  updatebahanRepo,
  deletebahanByIdRepo
}