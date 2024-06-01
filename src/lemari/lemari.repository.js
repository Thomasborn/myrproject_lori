
const prisma = require("../db");
const findLemari = async (kode, page = 1, pageSize = 10) => {
  try {
    // Calculate pagination offset
    const offset = (page - 1) * pageSize;

    // Construct search criteria including kode filtering if provided
    const searchCriteria = kode ? { nama: { contains: kode.toString() } } : {};

    // Fetch count of lemari data based on search criteria
    const totalLemari = await prisma.lemari.count({
      where: searchCriteria,
    });

    // Fetch lemari data with outlet information based on pagination parameters and search criteria
    const lemariWithOutlet = await prisma.lemari.findMany({
      include: {
        outlet: true,
      },
      where: searchCriteria,
      skip: offset,
      take: pageSize,
    });

    // Reshape the data
    const reshapedLemari = lemariWithOutlet.map(lemari => ({
      id: lemari.id,
      kode: lemari.kode,
      kapasitas: lemari.kapasitas,
      idOutlet: lemari.outlet_id,
      outlet: lemari.outlet ? lemari.outlet.nama : null,
      kodeOutlet: lemari.outlet ? lemari.outlet.kode : null,
    }));

    return {
      success: true,
      message: "Lemari fetched successfully",
      data: reshapedLemari,
      search: searchCriteria,
      totalPages: Math.ceil(totalLemari / pageSize),
      totalLemari: totalLemari,
      page: page
    };

  } catch (error) {
    console.error("Error fetching lemari:", error);
    throw new Error("Error fetching lemari");
  }
};


const findLemariById = async (id) => {
  const lemariWithOutlet = await prisma.lemari.findUnique({
    where: {
      id,
    },
    include: {
      outlet: true,
    },
  });

  if (!lemariWithOutlet) {
    return null; // Handle case where the cabinet with the specified ID is not found
  }

  // Reshape the data
  const reshapedLemari = {
    id: lemariWithOutlet.id,
    kode: lemariWithOutlet.kode,
    kapasitas: lemariWithOutlet.kapasitas,
    idOutlet: lemariWithOutlet.outlet_id,
    outlet: lemariWithOutlet.outlet.nama, // Assuming the outlet model has a 'nama' field
    kodeOutlet: lemariWithOutlet.outlet.kode??null, // Assuming the outlet model has a 'kode' field
  };

  return reshapedLemari;
};

const insertLemariRepo = async (newLemariData) => {
  
  const { kode, alamat, kapasitas, stok, jumlah_barang, outlet_id } = newLemariData;

    const lemari = await prisma.lemari.create({
      data: {
        kode,
        alamat,
        kapasitas,
        stok,
        jumlah_barang,
        outlet: {
          connect: {
            id: outlet_id,
          },
        },
      },
    });

  return lemari
}
const updateLemariRepo = async (id,updatedLemariData) => {
        const existingLemari = await prisma.lemari.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingLemari) {
            return ({ error: "lemari not found" });
      }

      // Validate and update the lemari data
      const updatedLemari = await prisma.lemari.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode: updatedLemariData.kode || existingLemari.kode,
          kapasitas: updatedLemariData.kapasitas 
        
      },
      });
      return updatedLemari
}
const deleteLemariByIdRepo = async(id)=>{
  await prisma.lemari.delete({
    where: { id: id },
  });
}
module.exports={
  findLemari,
  findLemariById,
  insertLemariRepo,
  updateLemariRepo,
  deleteLemariByIdRepo
}