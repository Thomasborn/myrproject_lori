
const prisma = require("../db");
const stokBahan= require("../stok_bahan/stok_bahan.service")
const findBahanStokOpname = async () => {
  const bahan_stok_opname = await prisma.bahan_stok_opnam.findMany();

  return bahan_stok_opname;
};

const findBahanStokOpnameById = async (id) => {
  const bahan_stok_opname = await prisma.bahan_stok_opnam.findUnique({
    where: {
      id,
    },
  });
  
  return bahan_stok_opname;
};
const insertBahanStokOpnameRepo = async (newBahanStokOpnameData) => {
  
  const { daftar_bahan_id, user_id,jumlah,lemari_id } = newBahanStokOpnameData;

  const bahanStokOpnam = await prisma.bahan_stok_opnam.create({
    data: {
      daftar_bahan: {
        connect: {
          id: daftar_bahan_id,
        },
      },
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });
  const stok_bahan = await stokBahan.getstokBahanByDaftarBahanId(daftar_bahan_id);
  const newstokData={stok_bahan,jumlah,daftar_bahan_id,lemari_id};
  const insertStokBahan = await stokBahan.updatedstokBahan(stok_bahan.id,newstokData);
  const result={
    bahanStokOpnam,
    insertStokBahan
  };
  return result;
}
const updateBahanStokOpnameRepo = async (id,updatedBahanStokOpnameData) => {
        const existingBahanStokOpname = await prisma.bahan_stok_opnam.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingBahanStokOpname) {
            return res.status(404).json({ error: "bahan_stok_opname not found" });
      }

      // Validate and update the bahan_stok_opname data
      const updatedBahanStokOpname = await prisma.bahan_stok_opnam.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedBahanStokOpnameData.kategori || existingBahanStokOpname.kategori.kategori
        
      },
      });
      return updatedBahanStokOpname
}
const deleteBahanStokOpnameByIdRepo = async(id)=>{
  await prisma.bahan_stok_opnam.delete({
    where: { id: id },
  });
}
module.exports={
  findBahanStokOpname,
  findBahanStokOpnameById,
  insertBahanStokOpnameRepo,
  updateBahanStokOpnameRepo,
  deleteBahanStokOpnameByIdRepo
}