
const prisma = require("../db");

const findGawangan = async () => {
  const gawangan = await prisma.gawangan.findMany();

  return gawangan;
};

const findGawanganById = async (id) => {
  const gawangan = await prisma.gawangan.findUnique({
    where: {
      id,
    },
  });
  
  return gawangan;
};

const findDetailGawangan = async () => {
  const detailGawangan = await prisma.detail_gawangan.findMany();

  return detailGawangan;
};

const findDetailGawanganById = async (id) => {
  const detailGawangan = await prisma.detail_gawangan.findUnique({
    where: {
      id,
    },
  });
  
  return detailGawangan;
};
const insertGawanganRepo = async (newgawanganData) => {
  
  const { outlet_id, nama } = newgawanganData;
 const existingGawangan = await prisma.gawangan.findFirst({
  where: {
    nama: {
      equals: nama,
    },
  },
});;

  if (existingGawangan) {
    // If gawangan exists, update it
   throw new Error("Gawangan sudah ada");
  }
  // Perform the insert operation using Prisma
  const insertedGawangan = await prisma.gawangan.create({
    data: {
      outlet_id:parseInt(outlet_id),
      nama,
    },
  });
  return insertedGawangan
};
const insertDetailGawanganRepo = async (newgawanganData) => {
  
  const{gawangan_id,daftar_produk_id}=newgawanganData;
  // Perform the insert operation using Prisma
  const insertedDetailGawangan = await prisma.detail_gawangan.create({
    data: {
      gawangan_id:parseInt(gawangan_id),
      daftar_produk_id:parseInt(daftar_produk_id),
    },
  });
  return insertedDetailGawangan;
}
const updateGawanganRepo = async (id,updatedgawanganData) => {
        const existinggawangan = await prisma.gawangan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existinggawangan) {
            return res.status(404).json({ error: "gawangan not found" });
      }

      // Validate and update the gawangan data
      const updatedgawangan = await prisma.gawangan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedgawanganData.kategori || existinggawangan.kategori.kategori
        
      },
      });
      return updatedgawangan
};

const updateDetailGawanganRepo = async (id,updatedgawanganData) => {
        const existingDetailGawangan = await prisma.detail_gawangan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingDetailGawangan) {
            return ({ error: "detail gawangan not found" });
      }

      // Validate and update the gawangan data
      const updatedDetailGawangan = await prisma.detail_gawangan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          daftar_produk_id: updatedgawanganData.daftar_produk_id || existingDetailGawangan.daftar_produk_id,
          gawangan_id: updatedgawanganData.gawangan_id || existingDetailGawangan.gawangan_id
        
      },
      });
      return updatedDetailGawangan
}
const deleteGawanganByIdRepo = async(id)=>{
  await prisma.gawangan.delete({
    where: { id: id },
  });
}

const deleteDetailGawanganByIdRepo = async(id)=>{
  await prisma.detail_gawangan.delete({
    where: { id: id },
  });
}
module.exports={
  findGawangan,findDetailGawangan,findDetailGawanganById, findGawanganById, insertGawanganRepo, insertDetailGawanganRepo, updateDetailGawanganRepo,updateGawanganRepo, deleteGawanganByIdRepo,deleteDetailGawanganByIdRepo
}