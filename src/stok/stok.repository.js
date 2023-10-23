
const prisma = require("../db");

const findstok = async () => {
  const stok_bahan = await prisma.stok_bahan.findMany();

  return stok_bahan;
};

const findstokById = async (id) => {
  const stok_bahan = await prisma.stok_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return stok_bahan;
};
const insertstokRepo = async (newstokData) => {
  
  const kode_bahan = newstokData.kode_bahan;
  const nama_bahan = newstokData.nama_bahan;
  const satuan = newstokData.satuan;
 
  const ukuran = parseFloat(newstokData.ukuran);
  const stok = parseInt(newstokData.stok);
  const stok_bahan = await prisma.stok_bahan.create({
    data: {
      kode_bahan,
      nama_bahan,
      satuan,
      stok,
      ukuran,
      
    },
  });
  return stok_bahan
}
const updatestokRepo = async (id,updatedstokData) => {
        const existingstok = await prisma.stok_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingstok) {
            return res.status(404).json({ error: "stok_bahan not found" });
      }

      // Validate and update the stok_bahan data
      const updatedstok = await prisma.stok_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode_bahan: updatedstokData.kode_bahan || existingstok.kode_bahan,
          nama_bahan: updatedstokData.nama_bahan || existingstok.nama_bahan,
          satuan: updatedstokData.satuan || existingstok.satuan,
          stok: parseInt(updatedstokData.stok) || existingstok.stok,
      ukuran: parseFloat(updatedstokData.ukuran) || existingstok.ukuran,

      },
      });
      return updatedstok
}
const deletestokByIdRepo = async(id)=>{
  await prisma.stok_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findstok,
  findstokById,
  insertstokRepo,
  updatestokRepo,
  deletestokByIdRepo
}