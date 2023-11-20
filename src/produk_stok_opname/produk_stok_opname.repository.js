
const prisma = require("../db");
const stokProduk= require("../stok_produk/stok_produk.service")
const findProdukStokOpname = async () => {
  const produk_stok_opname = await prisma.produk_stok_opnam.findMany();

  return produk_stok_opname;
};

const findProdukStokOpnameById = async (id) => {
  const produk_stok_opname = await prisma.produk_stok_opnam.findUnique({
    where: {
      id,
    },
  });
  
  return produk_stok_opname;
};
const insertProdukStokOpnameRepo = async (newProdukStokOpnameData) => {
  
  const { daftar_produk_id, user_id,jumlah,lemari_id } = newProdukStokOpnameData;

  const ProdukStokOpnam = await prisma.produk_stok_opnam.create({
    data: {
      daftar_produk: {
        connect: {
          id: daftar_produk_id,
        },
      },
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });
  //Mencari stok berdasarkan stok id
  const stokProdukById = await stokProduk.getStokProdukByDaftarProdukId(daftar_produk_id);
  const newstokData={stok_Produk,jumlah,daftar_produk_id,lemari_id};
  //Mencari stok berdasarkan daftar produk id dan lemari
  const stokProdukByProdukLemari = await stokProduk.getStokProdukByDaftarProdukId(daftar_produk_id,lemari_id);
  const insertStokProduk = await stokProduk.updatedStokProduk(stokProdukById.id,newstokData);
  const result={
    ProdukStokOpnam,
    insertStokProduk
  };
  return result;
}
const updateProdukStokOpnameRepo = async (id,updatedProdukStokOpnameData) => {
        const existingProdukStokOpname = await prisma.produk_stok_opnam.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProdukStokOpname) {
            return res.status(404).json({ error: "produk_stok_opname not found" });
      }

      // Validate and update the produk_stok_opname data
      const updatedProdukStokOpname = await prisma.produk_stok_opnam.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedProdukStokOpnameData.kategori || existingProdukStokOpname.kategori.kategori
        
      },
      });
      return updatedProdukStokOpname
}
const deleteProdukStokOpnameByIdRepo = async(id)=>{
  await prisma.produk_stok_opnam.delete({
    where: { id: id },
  });
}
module.exports={
  findProdukStokOpname,
  findProdukStokOpnameById,
  insertProdukStokOpnameRepo,
  updateProdukStokOpnameRepo,
  deleteProdukStokOpnameByIdRepo
}