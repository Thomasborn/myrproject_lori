
const prisma = require("../db");

const findProduk = async () => {
  const produksi = await prisma.produksi.findMany({
    include:{
      kategori_produk:true,pembuat:true
    }
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
  
  const mulai = new Date();
  // You can format "mulai" as needed, e.g., to ISO string
  const mulaiISO = mulai.toISOString();
  // mulai = mulaiISO;
  const selesai = "1970-01-01T00:00:00.000Z";
  const kode_produk = newprodukData.kode_produk;
  const jumlah = parseInt(newprodukData.jumlah);
  const ukuran = (newprodukData.ukuran);
  const biaya = parseFloat(newprodukData.biaya);
  const warna = (newprodukData.warna);
  const pembuat_id = parseInt(newprodukData.pembuat_id);
  const kategori_produk_id = parseInt(newprodukData.kategori_produk_id);
  const produksi = await prisma.produksi.create({
    data: {
       mulai, 
       selesai,
       kode_produk, 
       jumlah,  
       ukuran,  
       warna,  
       biaya,
       pembuat: {
        connect: {
          id: pembuat_id, // Use the ID or other unique identifier
        }},
        kategori_produk:{
          connect:{
            id: kategori_produk_id,
          }
        }
    },
  });
  return produksi
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