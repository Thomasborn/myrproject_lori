
const prisma = require("../db");
const findoutlet = async (searchCriteria = {}, page = 1, pageSize = 10) => {
  try {
    // Calculate pagination offset
    const offset = (page - 1) * pageSize;

    // Fetch outlets data based on search criteria and pagination parameters
    const outlets = await prisma.outlet.findMany({
      where: searchCriteria,
      include: {
        karyawan: {
          select: {
            nama: true,
            kontak: true
          }
        }
      },
      skip: offset,
      take: pageSize
    });

    // Fetch total count of outlets data based on search criteria
    const totalOutlets = await prisma.outlet.count({
      where: searchCriteria
    });

    // Reshape the fetched data
    const reshapedOutlets = outlets.map(outlet => ({
      id: outlet.id,
      nama: outlet.nama,
      kode: outlet.kode,
      alamat: outlet.alamat,
      idKaryawanPic: outlet.karyawan ? outlet.karyawan.id : null,
      pic: outlet.karyawan ? outlet.karyawan.nama : null,
      kontakPic: outlet.karyawan ? outlet.karyawan.kontak : null,
      keterangan: outlet.deskripsi // Assuming 'keterangan' maps to 'deskripsi' in your model
    }));

    return {
      success: true,
      message: "Data Outlet berhasil diperoleh",
      dataTitle: "Outlet",
      totalPages: Math.ceil(totalOutlets / pageSize),
      totalData: totalOutlets,
      page: page,
      data: reshapedOutlets
    };
    
  } catch (error) {
    console.error("Error fetching outlets:", error);
    throw new Error("Gagal mengambil data outlet");
  }
};

const findoutletById = async (id) => {
  try {
    const outlet = await prisma.outlet.findUnique({
      where: {
        id: id,
      },
      include: {
        karyawan: {
          select: {
            id: true, // Ensure to select id
            nama: true,
            kontak: true,
          },
        },
      },
    });

    if (!outlet) {
      return {
        success: false,
        message: `Data outlet dengan ID ${id} tidak ditemukan.`,
      };
    }

    const shapedData = {
      id: outlet.id,
      nama: outlet.nama,
      kode: outlet.kode,
      alamat: outlet.alamat,
      idKaryawanPic: outlet.karyawan ? outlet.karyawan.id : null,
      pic: outlet.karyawan ? outlet.karyawan.nama : null,
      kontakPic: outlet.karyawan ? outlet.karyawan.kontak : null,
      keterangan: outlet.deskripsi, // Assuming 'keterangan' maps to 'deskripsi' in your model
    };

    return {
      success: true,
      message: `Data outlet dengan ID ${id} berhasil ditemukan.`,
      data: shapedData,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mencari data outlet.',
    };
  }
};
const reshapeOutletData = (outletData) => {
  return {
    id: outletData.id,
    kode: outletData.kode??null,
    nama: outletData.nama || null,
    alamat: outletData.alamat || null,
    keterangan: outletData.keterangan || null,
    idKaryawanPic: outletData.karyawan ? outletData.karyawan.id : null,
    pic: outletData.karyawan ? outletData.karyawan.nama : null,
    kontakPic: outletData.karyawan ? outletData.karyawan.kontak : null,
  };
};
const insertoutletRepo = async (newoutletData) => {
  try {
    const { kode, nama, alamat, keterangan, idKaryawanPic,kontakPic } = newoutletData;

    const insertedOutlet = await prisma.outlet.create({ 
      data: {
        kode,
        nama,
        alamat,
        deskripsi: keterangan,
        idPic:idKaryawanPic,
        no_telp:kontakPic
      }
    });

    const outlet = await findoutletById(insertedOutlet.id);
    // const reshapedData = reshapeOutletData(outlet);

    return {
      success: true,
      message: `Data outlet berhasil ditambahkan dengan ID ${insertedOutlet.id}`,
      data: outlet.data,
    };
  } catch (error) {
    console.error("Error inserting outlet:", error);
    throw new Error("Gagal menambahkan data outlet");
  }
};
const updateoutletRepo = async (id, updatedOutletData) => {
  try {
    const { kode, nama, alamat, keterangan, idKaryawanPic, kontakPic } = updatedOutletData;

    // Check if the outlet exists
    const existingOutlet = await prisma.outlet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingOutlet) {
      return {
        success: false,
        message: `Outlet dengan ID ${id} tidak ditemukan.`,
      };
    }

    // Perform the update operation using Prisma
    const updatedOutlet = await prisma.outlet.update({
      where: { id: parseInt(id) },
      data: {
        kode,
        nama,
        alamat,
        deskripsi: keterangan,
        karyawan: {
          connect: { id: idKaryawanPic },
        },
      },
    });

    // Fetch the updated outlet
    const outlet = await findoutletById(updatedOutlet.id);

    return {
      success: true,
      message: `Data outlet dengan ID ${updatedOutlet.id} berhasil diperbarui.`,
      data: outlet.data,
    };
  } catch (error) {
    console.error("Error updating outlet:", error);
    return {
      success: false,
      message: "Gagal memperbarui data outlet.",
    };
  }
};




// const updateoutletRepo = async (id,updatedoutletData) => {
//         const existingoutlet = await prisma.outlet.findUnique({
//           where: { id: parseInt(id) },
//         });
        
//         if (!existingoutlet) {
//             return res.status(404).json({ error: "outlet not found" });
//       }

//       // Validate and update the outlet data
//       const updatedoutlet = await prisma.outlet.update({
//       where: { id: parseInt(id) },
//       data: {
//           // Add validation and update fields as needed
//           kategori: updatedoutletData.kategori || existingoutlet.kategori.kategori
        
//       },
//       });
//       return updatedoutlet
// }
const deleteoutletByIdRepo = async (id) => {
  try {
    // Check if the outlet exists
    const existingOutlet = await prisma.outlet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingOutlet) {
      return {
        success: false,
        message: `Outlet dengan ID ${id} tidak ditemukan.`,
      };
    }

    // Perform the deletion
    await prisma.outlet.delete({
      where: { id: parseInt(id) },
    });

    return {
      success: true,
      message: `Data outlet dengan ID ${id} berhasil dihapus.`,
    };
  } catch (error) {
    console.error("Error deleting outlet:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus data outlet.",
    };
  }
};

module.exports={
  findoutlet,
  findoutletById,
  insertoutletRepo,
  updateoutletRepo,
  deleteoutletByIdRepo
}