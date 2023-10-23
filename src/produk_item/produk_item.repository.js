
const prisma = require("../db");

const findProduk = async () => {
  const produk_items = await prisma.produk_item.findMany({
    include:{
      produksi:true

    },
  });
  return produk_items;
};

const findProdukById = async (id) => {
  const produk_item = await prisma.produk_item.findUnique({
    where: {
      id,
    },
  });
  
  return produk_item;
};
const insertProdukRepo = async (newprodukData) => {
  
  const kode_produk = newprodukData.kode_produk;
  const sku = newprodukData.sku;
  const nama_produk = newprodukData.nama_produk;
  const stok = parseInt(newprodukData.stok);
  const harga_jual = parseFloat(newprodukData.harga_jual);
  const produksi_id = parseInt(newprodukData.produksi_id);
  const produk_item = await prisma.produk_item.create({
    data: {
      kode_produk,
      sku,
      nama_produk,
      stok,
      harga_jual,
      produksi_id,
     

      
    },
  });
  return produk_item
}
const updateProdukRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.produk_item.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "produk_item not found" });
      }

      // Validate and update the produk_item data
      const updatedProduk = await prisma.produk_item.update({
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
const deleteprodukByIdRepo = async(id)=>{
  await prisma.produk_item.delete({
    where: { id: id },
  });
}
module.exports={
  findProduk,
  findProdukById,
  insertProdukRepo,
  updateProdukRepo,
  deleteprodukByIdRepo
}