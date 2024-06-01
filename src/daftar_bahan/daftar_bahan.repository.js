
const prisma = require("../db");
const findBahan = async (kategori, page = 1, pageSize = 10) => {
   try {
    // Ensure page is at least 1
    page = Math.max(page, 1);

    // Calculate pagination offset
    const offset = (page - 1) * pageSize;

    // Construct search criteria including category filtering if provided
    const searchCriteria = kategori ? { kategori } : {};

    // Fetch count of daftar_bahan data based on search criteria
    const totalMaterials = await prisma.daftar_bahan.count({
      where: searchCriteria,
    });

    // Fetch daftar_bahan data based on search criteria and pagination parameters
    const daftarBahan = await prisma.daftar_bahan.findMany({
      where: searchCriteria,
      skip: offset,
      take: pageSize,
    });
    // Fetch restok_bahan data related to each daftar_bahan
    const daftarBahanWithRestok = await Promise.all(daftarBahan.map(async (bahan) => {
      // Find restok_bahan entries related to this daftar_bahan
      const restokEntries = await prisma.restok_bahan.findMany({
        where: {
          daftar_bahan_id: bahan.id,
        },
      });

      // Calculate total stock and average price from restok_bahan entries
      let totalStok = 0;
      let totalHarga = 0;
      restokEntries.forEach((entry) => {
        totalStok += entry.jumlah;
        totalHarga += entry.harga_satuan * entry.jumlah;
      });

      // Calculate average price
      const averageHarga = restokEntries.length > 0 ? totalHarga / totalStok : null;

      // Return transformed daftar_bahan object with stock and average price
      return {
        id: bahan.id,
        kode: bahan.kode,
        nama: bahan.nama,
        kategori: bahan.kategori ?? null,
        stok: totalStok,
        satuan: bahan.satuan,
        harga: averageHarga,
        deskripsi: bahan.deskripsi ?? null,
        foto: bahan.foto ?? null,
      };
    }));

    return {
      success: true,
      message: "Materials fetched successfully",
      data: daftarBahanWithRestok,
      search: searchCriteria,
      totalPages: Math.ceil(totalMaterials / pageSize),
      totalBahan: totalMaterials,
      page: page
    };
  } catch (error) {
    throw new Error("Error fetching materials");
  }
};


const findBahanById = async (id) => {
  // Fetch the daftar_bahan entry by ID
  const daftarBahan = await prisma.daftar_bahan.findUnique({
    where: {
      id,
    },
  });

  if (!daftarBahan) {
    // Handle case where the ingredient with the specified ID is not found
    return null;
  }

  // Fetch restok_bahan entries related to this daftar_bahan
  const restokEntries = await prisma.restok_bahan.findMany({
    where: {
      daftar_bahan_id: id,
    },
  });

  // Calculate total stock and average price from restok_bahan entries
  let totalStok = 0;
  let totalHarga = 0;
  restokEntries.forEach((entry) => {
    totalStok += entry.jumlah;
    totalHarga += entry.harga_satuan * entry.jumlah;
  });

  // Calculate average price
  const averageHarga = restokEntries.length > 0 ? totalHarga / totalStok : null;

  // Construct the response object with the fetched daftar_bahan data and calculated values
  const response = {
    id: daftarBahan.id,
    kode: daftarBahan.kode,
    nama: daftarBahan.nama,
    kategori: daftarBahan.kategori ?? null,
    stok: totalStok,
    satuan: daftarBahan.satuan,
    harga: averageHarga,
    deskripsi: daftarBahan.deskripsi ?? null,
    foto: daftarBahan.foto ?? null,
  };

  return response;
};

const insertBahanRepo = async (newBahanData) => {
  
  const { kode, stok, nama, satuan } = newBahanData;

  const insertDaftarBahan = await prisma.daftar_bahan.create({
    data: {
      kode,
      stok,
      nama,
      satuan,
    },
  });
  return insertDaftarBahan;
}
const updateBahanRepo = async (id,updatedBahanData) => {
        const existingBahan = await prisma.daftar_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingBahan) {
            return res.status(404).json({ error: "daftar_bahan not found" });
      }

      // Validate and update the daftar_bahan data
      const updatedBahan = await prisma.daftar_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedBahanData.kategori || existingBahan.kategori.kategori
        
      },
      });
      return updatedBahan
}
const deleteBahanByIdRepo = async(id)=>{
  await prisma.daftar_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findBahan,
  findBahanById,
  insertBahanRepo,
  updateBahanRepo,
  deleteBahanByIdRepo
}