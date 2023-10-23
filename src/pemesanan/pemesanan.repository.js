
const prisma = require("../db");

const findbahan = async () => {
  const pemesanans = await prisma.detail_pemesanan_bahan.findMany({
    include: {
      // Include related data from 'pemesanan_bahan' and 'kondisi_bahan'
      pemesanan_bahan: true,
      kondisi_bahan: true,
    },
  });
  
  // Now 'pemesanans' contains the details with related 'pemesanan_bahan' and 'kondisi_bahan'
  
  return pemesanans;
};

const findbahanById = async (id) => {
  const pemesanan = await prisma.detail_pemesanan_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return pemesanan;
};
const insertbahanRepo = async (newbahanData) => {
  
  const kode_bahan = newbahanData.kode_bahan;
  const sku = newbahanData.sku;
  const nama_bahan = newbahanData.nama_bahan;
  const stok = parseInt(newbahanData.stok);
  const harga_jual = parseFloat(newbahanData.harga_jual);
  const pemesanan = await prisma.detail_pemesanan_bahan.create({
    data: {
      kode_bahan,
      sku,
      nama_bahan,
      stok,
      harga_jual,
      
    },
  });
  return pemesanan
}
const updatebahanRepo = async (id,updatedbahanData) => {
        const existingbahan = await prisma.detail_pemesanan_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingbahan) {
            return res.status(404).json({ error: "pemesanan not found" });
      }

      // Validate and update the pemesanan data
      const updatedbahan = await prisma.detail_pemesanan_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode_bahan: updatedbahanData.kode_bahan || existingbahan.kode_bahan,
          sku: updatedbahanData.sku || existingbahan.sku,
          nama_bahan: updatedbahanData.nama_bahan || existingbahan.nama_bahan,
          stok: parseInt(updatedbahanData.stok) || existingbahan.stok,
      harga_jual: parseFloat(updatedbahanData.harga_jual) || existingbahan.harga_jual,

      },
      });
      return updatedbahan
}
const deletebahanByIdRepo = async(id)=>{
  await prisma.detail_pemesanan_bahan.delete({
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