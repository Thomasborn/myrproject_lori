
const prisma = require("../db");
const findGawangan = async (searchCriteria = {}, page = 1, itemsPerPage = 10) => {
  // Calculate pagination offset
  const offset = (page - 1) * itemsPerPage;

  // Fetch gawangan data based on search criteria and pagination parameters
  const gawanganData = await prisma.gawangan.findMany({
    where: searchCriteria,
    include: {
      outlet: true,
      // detailGawangan: true,
    },
    skip: offset,
    take: itemsPerPage,
  });

  // Fetch total count of gawangan data based on search criteria
  const totalGawangan = await prisma.gawangan.count({
    where: searchCriteria,
  });

  // Reshape the fetched data
  const reshapedData = gawanganData.map(gawangan => ({
    id: gawangan.id,
    idOutlet: gawangan.outlet_id,
    kode: gawangan.kode,
    deskripsi: gawangan.deskripsi ?? null, // Or any other value based on your logic
  }));

  return {
    success: true,
    message: "Data gawangan berhasil diperoleh",
    dataTitle: "Gawangan",
    itemsPerPage: itemsPerPage,
    totalPages: Math.ceil(totalGawangan / itemsPerPage),
    totalData: totalGawangan,
    page: page,
    data: reshapedData
  };
  
};

const findGawanganById = async (id) => {
  const gawangan = await prisma.gawangan.findUnique({
    where: {
      id: id,
    },
    include: {
      outlet: true,
    },
  });

  if (!gawangan) {
    return {
      success: false,
      message: `Data gawangan dengan ID ${id} tidak ditemukan.`,
    };
  }

  const shapedData = {
    id: gawangan.id,
    idOutlet: gawangan.outlet_id,
    kode: gawangan.kode,
    deskripsi: gawangan.outlet.deskripsi ?? null,
  };

  return {
    success: true,
    message: `Data gawangan dengan ID ${id} berhasil diperoleh.`,
    data: shapedData,
  };
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
};const insertGawanganRepo = async (newgawanganData) => {
  const { idOutlet, kode,deskripsi } = newgawanganData;
  
  // Check if a gawangan with the provided kode already exists
  const existingGawangan = await prisma.gawangan.findFirst({
    where: {
      kode: {
        equals: kode,
      },
    },
  });

  if (existingGawangan) {
    // If a gawangan with the provided kode already exists, throw an error
    return {
      success: false,
      message: "Gagal menambahkan gawangan, kode gawangan '" + kode + "' sudah ada",
      data: null
    };
  }
    

  // Perform the insert operation using Prisma
  const insertedGawangan = await prisma.gawangan.create({
    data: {
      outlet_id: parseInt(idOutlet),
      deskripsi,
      kode,
    },
  });
  const data = {
    id: insertedGawangan.id,
    idOutlet: insertedGawangan.outlet_id,
    kode: insertedGawangan.kode,
    deskripsi: insertedGawangan.deskripsi,
  };
  // Return the inserted kode along with a success message
  return {
    success: true,
    message: "Data Gawangan berhasil ditambahkan",
    data : data
  };
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
  const {  kode,deskripsi }=updatedgawanganData; 
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
          deskripsi,
          kode,
        
      },
      });
      const data = {
        id: updatedgawangan.id,
        idOutlet: updatedgawangan.outlet_id,
        kode: updatedgawangan.kode,
        deskripsi: updatedgawangan.deskripsi,
      };
      // Return the inserted kode along with a success message
      return {
        success: true,
        message: "Gawangan berhasil diubah",
        data : data
      };
      
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
const deleteGawanganByIdRepo = async (id) => {
  const existingGawangan = await findGawanganById(id);

  if (existingGawangan.success==false) {
    return {
      success: false,
      message: `Data gawangan dengan ID ${id} tidak ditemukan.`,
    };
  }
  try {
    // Attempt to delete the gawangan entry
    await prisma.gawangan.delete({
      where: { id: id },
    });

    return {
      success: true,
      message: `Data gawangan dengan ID ${id} berhasil dihapus.`,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: `Terjadi kesalahan saat menghapus data gawangan dengan ID ${id}.`,
    };
  }
};


const deleteDetailGawanganByIdRepo = async(id)=>{
  await prisma.detail_gawangan.delete({
    where: { id: id },
  });
}
module.exports={
  findGawangan,findDetailGawangan,findDetailGawanganById, findGawanganById, insertGawanganRepo, insertDetailGawanganRepo, updateDetailGawanganRepo,updateGawanganRepo, deleteGawanganByIdRepo,deleteDetailGawanganByIdRepo,deleteGawanganByIdRepo
}