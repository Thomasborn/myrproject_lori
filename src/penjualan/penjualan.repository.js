
const prisma = require("../db");

const findPenjualan = async () => {
  const penjualan = await prisma.penjualan.findMany();

  return penjualan;
};

const findPenjualanById = async (id) => {
  const penjualan = await prisma.penjualan.findUnique({
    where: {
      id,
    },
  });
  
  return penjualan;
};

const findDetailPenjualan = async () => {
  const detailPenjualan = await prisma.detail_penjualan.findMany();

  return detailPenjualan;
};

const findDetailPenjualanById = async (id) => {
  const detailPenjualan = await prisma.detail_penjualan.findUnique({
    where: {
      id,
    },
  });
  
  return detailPenjualan;
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