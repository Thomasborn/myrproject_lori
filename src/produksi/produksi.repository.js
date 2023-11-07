
const prisma = require("../db");

const findProduk = async () => {
  const produksi = await prisma.produksi.findMany({
    include: {
      // detail_model_produk: true,
      detail_model_produk: {
        include: {
          // ukuran: true,
          
          model_produk: true,
          // Add more specific fields here
        }},
      user: true
    }
  // });
  });

  return produksi;
};

const findProduksiById = async (id) => {
  const produksi = await prisma.produksi.findUnique({
    where: {
      id,
    },
  });
  
  return produksi;
};
const insertProduksiRepo = async (newprodukData) => {
  

    const {
      produksi,
      tanggal_mulai,
      tanggal_selesai,
      jumlah,
      detail_model_produk_id,
      user_id,
    } = newprodukData;

    const createdProduksi = await prisma.produksi.create({
      data: {
        produksi,
        tanggal_mulai,
        tanggal_selesai,
        jumlah,
        detail_model_produk_id,
        user_id,
      },
    });

  return createdProduksi
}
const updateProduksiRepo = async (id,updatedProduksiData) => {
        const existingProduksi = await prisma.produksi.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduksi) {
            return res.status(404).json({ error: "produksi not found" });
      }

      // Validate and update the produksi data
      const updatedProduksi = await prisma.produksi.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode_produk: updatedProduksiData.kode_produk || existingProduksi.kode_produk,
          sku: updatedProduksiData.sku || existingProduksi.sku,
          nama_produk: updatedProduksiData.nama_produk || existingProduksi.nama_produk,
          stok: parseInt(updatedProduksiData.stok) || existingProduksi.stok,
      harga_jual: parseFloat(updatedProduksiData.harga_jual) || existingProduksi.harga_jual,

      },
      });
      return updatedProduksi
}
const deleteproduksiByIdRepo = async(id)=>{
  await prisma.produksi.delete({
    where: { id: id },
  });
}
module.exports={
  findProduk,
  findProduksiById,
  insertProduksiRepo,
  updateProduksiRepo,
  deleteproduksiByIdRepo
}