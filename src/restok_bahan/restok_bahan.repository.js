
const prisma = require("../db");
const stokBahan = require("../stok_bahan/stok_bahan.service");

const findRestokBahan = async () => {
  const restok_bahan = await prisma.restok_bahan.findMany();

  return restok_bahan;
};

const findRestokBahanById = async (id) => {
  const restok_bahan = await prisma.restok_bahan.findUnique({
    where: {
      id,
    },
  });
  
  return restok_bahan;
};
const insertRestokBahanRepo = async (newRestokBahanData) => {
  
  const {
    tanggal_pesan,
    tanggal_terima,
    harga_satuan,
    jumlah,
    daftar_bahan_id,
    supplier_id,
    lemari_id
  } = newRestokBahanData;

  const insertRestokBahan = await prisma.restok_bahan.create({
    data: {
      tanggal_pesan,
      tanggal_terima,
      harga_satuan,
      jumlah,
      daftar_bahan_id,
      supplier_id,
    },
  });
  const stok_bahan = await stokBahan.getstokBahanByDaftarBahanId(daftar_bahan_id);
  const newstokData={stok_bahan,jumlah,daftar_bahan_id,lemari_id};
  const insertStokBahan = await stokBahan.insertstokBahan(newstokData);
  const result={
    insertRestokBahan,
    insertStokBahan
  };

  return result;
};
const updateRestokBahanRepo = async (id,updatedRestokBahanData) => {
        const existingRestokBahan = await prisma.restok_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingRestokBahan) {
            return res.status(404).json({ error: "restok_bahan not found" });
      }

      // Validate and update the restok_bahan data
      const updatedRestokBahan = await prisma.restok_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedRestokBahanData.kategori || existingRestokBahan.kategori.kategori
        
      },
      });
      return updatedRestokBahan
}
const deleteRestokBahanByIdRepo = async(id)=>{
  await prisma.restok_bahan.delete({
    where: { id: id },
  });
};
module.exports={
  findRestokBahan,
  findRestokBahanById,
  insertRestokBahanRepo,
  updateRestokBahanRepo,
  deleteRestokBahanByIdRepo
}