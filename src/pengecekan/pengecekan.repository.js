
const prisma = require("../db");

const findProduk = async () => {
  const pengecekans = await prisma.detail_pengecekan_produk.findMany({
    include: {
      // Include related data from 'pengecekan_produk' and 'kondisi_produk'
      pengecekan_produk: true,
      kondisi_produk: true,
    },
  });
  //
  // Now 'pengecekans' contains the details with related 'pengecekan_produk' and 'kondisi_produk'
  
  return pengecekans;
};

const findProdukById = async (id) => {
  const pengecekan = await prisma.detail_pengecekan_produk.findUnique({
    where: {
      id,
    },
  });
  
  return pengecekan;
};
const insertProdukRepo = async (newprodukData) => {
  
  // const pengecekan_produk_id = newprodukData.pengecekan_produk_id;
  // const pengecekanProduk = {
  //   nama_pic: newprodukData.nama_pic, // Replace with the actual PIC name
  //   tanggal: newprodukData.tanggal, // Replace with the actual date
  // };
  
  // const kondisi = newprodukData.kondisi;
  // const produk_item_id = newprodukData.produk_item_id;
  // const kondisi_produk_id = newprodukData.kondisi_produk_id;
  // const jumlah = parseInt(newprodukData.jumlah);

  // const kondisi_produk = await prisma.kondisi_produk.create({
  //   data:{
  //     kondisi,
  //   }
  // });
  // const pengecekan_produk = await prisma.pengecekan_produk.create({
  //   data:{
  //     pengecekanProduk,
  //   }
  // });
  // const pengecekan = await prisma.detail_pengecekan_produk.create({
  //   data: {
  //     pengecekan_produk_id: pengecekan_produk_id||pengecekan_produk.id,
  //     produk_item_id,
  //     kondisi_produk_id: kondisi_produk_id || kondisi_produk.id,
  //     jumlah,
   
      
  //   },
  // });
  // return pengecekan
  const pengecekan_produk_id = parseInt(newprodukData.pengecekan_produk_id);
const pengecekanProduk = {
  nama_pic: newprodukData.nama_pic,
  tanggal: newprodukData.tanggal,
};
const kondisi = newprodukData.kondisi;
const produk_item_id = parseInt(newprodukData.produk_item_id);
const kondisi_produk_id = parseInt(newprodukData.kondisi_produk_id);
const jumlah = parseInt(newprodukData.jumlah);

let createdKondisiProduk;
let createdPengecekanProduk;

if (kondisi_produk_id == null || isNaN(kondisi_produk_id)) {
  const existingKondisiProduk = await prisma.kondisi_produk.findFirst({
    where: {
      kondisi: {
        equals: kondisi,
      },
    },
  });
  createdKondisiProduk= existingKondisiProduk;
  if (!existingKondisiProduk) {
  const kondisi_produk = await prisma.kondisi_produk.create({
    data: {
      kondisi,
    },
  });
  createdKondisiProduk = kondisi_produk;
}
}

if (pengecekan_produk_id == null || isNaN(pengecekan_produk_id)) {
  const pengecekan_produk = await prisma.pengecekan_produk.create({
    data: pengecekanProduk,
  });
  createdPengecekanProduk = pengecekan_produk;
}

const pengecekan = await prisma.detail_pengecekan_produk.create({
  data: {
    pengecekan_produk: {
      connect: {
        id: createdPengecekanProduk?.id||pengecekan_produk_id,
      },
    },
    produk_item: {
      connect: {
        id: produk_item_id || createdProdukItem?.id,
      },
    },
    kondisi_produk: {
      connect: {
        id: createdKondisiProduk?.id||kondisi_produk_id ,
      },
    },
    jumlah,
  },
});

return pengecekan;
}




const updateProdukRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.detail_pengecekan_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "pengecekan not found" });
      }

      // Validate and update the pengecekan data
      const updatedProduk = await prisma.detail_pengecekan_produk.update({
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
  await prisma.detail_pengecekan_produk.delete({
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
