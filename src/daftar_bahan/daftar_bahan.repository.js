
const prisma = require("../db");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
        // deskripsi: bahan.deskripsi ?? null,
        foto: bahan.foto ?? null
      };      
    }));

    return {
      success: true,
      message: "Data Bahan berhasil diperoleh",
      dataTitle: "Bahan",
      totalPages: Math.ceil(totalMaterials / pageSize),
      totalData: totalMaterials,
      page: page,
      data: daftarBahanWithRestok,
      search: searchCriteria
    };
    
  } catch (error) {
    throw new Error("Error fetching materials");
  }
};


const findBahanById = async (id) => {
  // Fetch the daftar_bahan entry by ID
  const daftarBahan = await prisma.daftar_bahan.findUnique({
    where: {
      id: id,
    },
  });

  if (!daftarBahan) {
    // Handle case where the ingredient with the specified ID is not found
    return {
      success: false,
      message: `Data bahan dengan ID ${id} tidak ditemukan.`,
    };
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

  return {
    success: true,
    message: `Data bahan berhasil ditemukan dengan ID ${id}.`,
    data: response,
  };
};
const saveFoto = (file) => {
  
  let filename = file.filename ? file.filename : uuidv4() + path.extname(file.originalname);
  const targetDir = path.join(__dirname, 'public/images/bahan');
  let targetPath = path.join(targetDir, filename);

  // Ensure the directory exists
  if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
  }

  // Ensure filename uniqueness
  let count = 1;
  while (fs.existsSync(targetPath)) {
      filename = `${uuidv4()}_${count}${path.extname(file.originalname)}`;
      targetPath = path.join(targetDir, filename);
      count++;
  }

  // Move the file to the target directory
  fs.copyFileSync(file.path, targetPath);

  const imageUrl = '/public/images/bahan/' + filename;
  return imageUrl;
};

const insertBahanRepo = async (newBahanData, file) => {
  const { kode, stok, nama, satuan } = newBahanData;

  // Save the file
  const fotoUrl = saveFoto(file);

  // Create data object for Prisma
  const data = {
      kode,
      stok:parseInt(stok),
      nama,
      satuan,
      foto: fotoUrl // assuming 'foto' is the field in your Prisma model for storing the image URL
  };

  // Insert data into Prisma
  const insertDaftarBahan = await prisma.daftar_bahan.create({
      data: data
  });

  return {
      success: true,
      message: `Data bahan berhasil ditambahkan dengan ID ${insertDaftarBahan.id}`,
      data: insertDaftarBahan
  };
};


const deleteFoto = (fotoUrl) => {
  const targetPath = path.join(__dirname, fotoUrl);

  // Check if the file exists and delete it
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
};

const updateBahanRepo = async (id, updatedBahanData, file) => {
  const { kode, stok, nama, satuan } = updatedBahanData;

  // Fetch the existing record to check for an existing photo
  const existingBahan = await prisma.daftar_bahan.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!existingBahan) {
    return {
      success: false,
      message: `Data bahan dengan ID ${id} tidak ditemukan.`,
    };
  }

  // Save the new file if provided
  let fotoUrl;
  if (file) {
    if (existingBahan.foto) {
      // Delete the existing photo
      deleteFoto(existingBahan.foto);
    }
    fotoUrl = saveFoto(file);
  }

  // Create data object for Prisma
  const data = {
    kode,
    stok: parseInt(stok),
    nama,
    satuan,
  };

  // Add foto to the data object if a new file was provided
  if (fotoUrl) {
    data.foto = fotoUrl;
  }

  // Update data in Prisma
  const updatedDaftarBahan = await prisma.daftar_bahan.update({
    where: {
      id: parseInt(id),
    },
    data: data,
  });

  return {
    success: true,
    message: `Data bahan berhasil diperbarui dengan ID ${updatedDaftarBahan.id}`,
    data: updatedDaftarBahan,
  };
};


// Function to delete a bahan by ID
const deleteBahanByIdRepo = async (id) => {
  // Fetch the entry by ID
  const bahan = await findBahanById(id);

  if (bahan.success==false) {
    return {
      success: false,
      message: `Data bahan dengan ID ${id} tidak ditemukan.`,
    };
  }

  // Delete the associated file if it exists
  if (bahan.foto) {
    deleteFoto(bahan.foto);
  }

  // Delete the entry from the database
  await prisma.daftar_bahan.delete({
    where: { id: id },
  });

  return {
    success: bahan,
    message: `Data bahan dengan ID ${id} berhasil dihapus.`,
  };
};
module.exports={
  findBahan,
  findBahanById,
  insertBahanRepo,
  updateBahanRepo,
  deleteBahanByIdRepo
}