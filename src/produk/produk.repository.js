
const prisma = require("../db");

const {
  insertModelProduk
} = require("../model_produk/model_produk.service");
const findDetailModelProdukList = async (q = {}, page = 1, itemsPerPage = 10) => {
  // Fetch detail_model_produk data based on search criteria and pagination parameters
  const detail_model_produk = await prisma.detail_model_produk.findMany({
    where: q,
    include: {
      model_produk: {
        include: {
          kategori: true,
          foto_produk: true
        }
      }
    },
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage
  });

  // Calculate hargaJualMax and hargaJualMin after fetching the data
  const hargaJuals = detail_model_produk.map(item => item.harga_jual).filter(hargaJual => hargaJual !== null);
  const hargaJualMax = hargaJuals.length > 0 ? Math.max(...hargaJuals) : null;
  const hargaJualMin = hargaJuals.length > 0 ? Math.min(...hargaJuals) : null;

  // Extracting required fields
  const extractedData = detail_model_produk.map(item => ({
    // deskripsi: item.model_produk.deskripsi,
    foto: item.model_produk.foto_produk.map(foto => foto.filepath),
    hargaJualMax,
    hargaJualMin,
    id: item.id,
    kategori: item.model_produk.kategori.nama,
    kode: item.model_produk.kode,
    nama: item.model_produk.nama,
    stok: item.jumlah ?? 0
  }));

  // Fetch total count of detail_model_produk for pagination
  const totalProduk = await prisma.detail_model_produk.count({
    where: q
  });

  const totalPages = Math.ceil(totalProduk / itemsPerPage);

  return {
    success: true,
    message: "Data Produk berhasil diperoleh",
    dataTitle: "Produk",
    itemsPerPage: itemsPerPage,
    totalPages: totalPages,
    totalData: totalProduk,
    page: page,
    data: extractedData
  };
};
const findDaftarProduk = async ( q, kategori,outletId, page = 1, itemsPerPage = 10) => {
  try {
    let whereClause = {
      outlet_id: outletId,
    };

    if (q) {
      whereClause = {
        ...whereClause,
        produk: {
          detail_model_produk: {
            OR: [
              {
                model_produk: {
                  nama_produk: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              },
              {
                model_produk: {
                  kode: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        },
      };
    }

    if (kategori) {
      whereClause = {
        ...whereClause,
        produk: {
          detail_model_produk: {
            model_produk: {
              kategori: {
                nama: kategori,
              },
            },
          },
        },
      };
    }

    const totalData = await prisma.produk_outlet.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalData / itemsPerPage);

    const produkOutletList = await prisma.produk_outlet.findMany({
      where: whereClause,
      include: {
        detail_model_produk: {
          include: {
            model_produk: {
              include: {
                kategori: true,
                foto_produk: true,
              },
            },
          },
        },
        outlet: true,
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    if (produkOutletList.length === 0) {
      return {
        success: false,
        message: "Tidak ada produk yang ditemukan untuk outlet yang ditentukan",
      };
    }

    const transformedDataList = produkOutletList.map(produkOutlet => {
      const { detail_model_produk, outlet } = produkOutlet;
      const { model_produk } = detail_model_produk;
    
      const varian = {
        ukuran: detail_model_produk.ukuran,
        harga: detail_model_produk.harga_jual,
        stok: produkOutlet.jumlah,
      };
    
      const stok = varian.stok;
      const hargaJualMin = varian.harga;
      const hargaJualMax = varian.harga;
    
      return {
        stok,
        hargaJualMin,
        hargaJualMax,
        id: model_produk.id,
        nama: model_produk.nama_produk,
        kode: model_produk.kode,
        kategori: model_produk.kategori.nama,
        foto: model_produk.foto_produk.map(foto => foto.filepath),
        varian: [varian],
      };
    });
    

    return {
      success: true,
      message: "Data produk berhasil diperoleh",
      dataTitle: "Produk",
      itemsPerPage,
      totalPages,
      totalData,
      page: page.toString(),
      data: transformedDataList,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil data produk",
      error: error.message,
    };
  }
};



const findDaftarProdukById = async (productId) => {
  try {
    const produkOutlet = await prisma.produk_outlet.findFirst({
      where: {
        produk_id: productId,
        // outlet_id: outletId,
      },
      include: {
        detail_model_produk: {
          include: {
            model_produk: {
              include: {
                kategori: true,
                foto_produk: true,
              },
            },
          },
        },
        outlet: true,
      },
    });

    if (!produkOutlet) {
      return {
        success: false,
        message: "Produk tidak ditemukan untuk outlet yang ditentukan",
      };
    }

    const { detail_model_produk, outlet } = produkOutlet;
    const { model_produk } = detail_model_produk;

    const varian = {
      ukuran: detail_model_produk.ukuran,
      harga: detail_model_produk.harga_jual,
      stok: produkOutlet.jumlah,
    };

    const stok = varian.stok;
    const hargaJualMin = varian.harga;
    const hargaJualMax = varian.harga;

    const transformedData = {
      stok,
      hargaJualMin,
      hargaJualMax,
      id: model_produk.id,
      nama: model_produk.nama_produk,
      kode: model_produk.kode,
      kategori: model_produk.kategori.nama,
      foto: model_produk.foto_produk.map(foto => foto.filepath),
      varian: [varian],
    };

    return {
      success: true,
      message: "Data produk berhasil diperoleh",
      dataTitle: "Produk",
      data: transformedData,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil data produk",
      error: error.message,
    };
  }
};

  
  
  
const findDaftarProdukBySku = async (sku) => {
  const daftar_produk = await prisma.daftar_produk.findUnique({
    where: {
      sku:sku,
    },
  });
  
  return daftar_produk;
};

const getModelProdukByKode = async (kode) => {
  return await prisma.model_produk.findFirst({
    where: {
      kode: kode,
    },
  });
};

const insertDaftarProdukRepo = async (data) => {
  // Insert model_produk and detail_model_produk
      let model_produk_id;
  
      // Check if model_produk with given kode exists
      const existingModel = await getModelProdukByKode(data.kode);
  
      if (existingModel) {
        // If model_produk exists, use its id
        model_produk_id = existingModel.id;
      } else {
        // If model_produk doesn't exist, insert a new one
        const insert_model = await insertModelProduk(data);
        model_produk_id = insert_model.id;
      }
  
      // Insert detail_model_produk using the obtained model_produk_id
      const insert_detail_model = await prisma.detail_model_produk.create({
        data: {
          ukuran: data.ukuran,
          biaya_jahit: data.biaya_jahit,
          hpp: data.hpp,
          harga_jual: data.harga_jual,
          model_produk_id: model_produk_id,
          jumlah: data.jumlah || 0,
        },
      });
  // const insert_model = await insertModelProduk(data);


  // Fetch the inserted data along with related information
  const insertedData = await prisma.detail_model_produk.findUnique({
    where: { id: insert_model.detail_model_produk.id },
    include: {
      model_produk: {
        include: {
          kategori: true,
          foto_produk: true,
        },
      },
      bahan_produk: {
        include: {
          daftar_bahan: true,
        },
      },
    },
  });

  
  // Format the response
  const response = {
    id: insertedData.id,
    kode: insertedData.model_produk.kode,
    nama: insertedData.model_produk.nama,
    kategori: insertedData.model_produk.kategori.nama,
    foto: insertedData.model_produk.foto_produk.map(foto => foto.filepath),
    deskripsi: insertedData.model_produk.deskripsi,
    varian: [
      {
        ukuran: insertedData.ukuran,
        biayaJahit: insertedData.biaya_jahit,
        hargaJual: insertedData.harga_jual,
        stok: insertedData.jumlah,
        bahan: insertedData.bahan_produk.map(bahan => ({
          id: bahan.daftar_bahan.id,
          jumlahPakai: bahan.jumlah,
        })),
      },
    ],
  };

  return {
    success: true,
    message: `Data produk berhasil ditambahkan dengan ID ${response.id}`,
    data: response
  };
};

// const insertDaftarProdukRepo = async (data) => {
//   const { sku, detail_model_produk_id } = data;

//   // Insert the product into the database
//   const daftar_produk = await prisma.daftar_produk.create({
//     data: {
//       sku,
//       detail_model_produk: {
//         connect: {
//           id: parseInt(detail_model_produk_id),
//         },
//       },
//     },
//   });

//   // Fetch the inserted data along with related information
//   const insertedData = await findDaftarProdukById(daftar_produk.id);

//   // Format the fetched data according to the specified structure
//   const formattedData = {
//     success: true,
//     message: `Data produk berhasil ditambahkan dengan ID ${insertedData.id}`,
//     data: {
//       id: insertedData.id,
//       kode: insertedData.kode,
//       nama: insertedData.nama,
//       kategori: insertedData.kategori,
//       foto: insertedData.foto,
//       deskripsi: insertedData.deskripsi,
//       varian: insertedData.varian.map(variant => ({
//         ukuran: variant.ukuran,
//         biayaJahit: variant.biayaJahit,
//         hargaJual: variant.hargaJual,
//         stok: variant.stok,
//         bahan: variant.bahan.map(bahan => ({
//           id: bahan.id,
//           jumlahPakai: bahan.jumlahPakai,
//         })),
//       })),
//     },
//   };

//   return formattedData;
// };

const updateDaftarProdukRepo = async (id,updatedProdukData) => {
  const daftarProduk = await prisma.daftar_produk.findUnique({
    where: { id },
    include: {
      detail_model_produk: {
        include: {
          model_produk: true,
        }
      }
    },
  });

  if (!daftarProduk) {
    return {
      success: false,
      message: 'Produk tidak ditemukan.',
    };
  }


  // Delete bahan_produk related to detail_model_produk
  await prisma.bahan_produk.deleteMany({
    where: { detail_model_produk_id: daftarProduk.detail_model_produk.id },
  });
  // Delete daftar_produk itself
  // await prisma.daftar_produk.delete({
  //   where: { id },
  // });
 
  // Delete detail_model_produk
  await prisma.detail_model_produk.delete({
    where: { id: daftarProduk.detail_model_produk.id },
  });

// Delete foto_produk related to model_produk
  await prisma.foto_produk.deleteMany({
    where: { model_produk_id: daftarProduk.detail_model_produk.model_produk.id },
  });
  // Delete model_produk
  await prisma.model_produk.delete({
    where: { id: daftarProduk.detail_model_produk.model_produk.id },
  });

      // Validate and update the daftar_produk data
      const updatedProduk = await prisma.daftar_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedProdukData.kategori || existingProduk.kategori.kategori
        
      },
      });
      return updatedProduk
}
const deleteDaftarProdukByIdRepo = async (id) => {
  try {
    // Find the daftar_produk
    const daftarProduk = await prisma.daftar_produk.findUnique({
      where: { id },
      include: {
        detail_model_produk: {
          include: {
            model_produk: true,
          }
        }
      },
    });

    if (!daftarProduk) {
      return {
        success: false,
        message: 'Produk tidak ditemukan.',
      };
    }


    // Delete bahan_produk related to detail_model_produk
    await prisma.bahan_produk.deleteMany({
      where: { detail_model_produk_id: daftarProduk.detail_model_produk.id },
    });
    // Delete daftar_produk itself
    await prisma.daftar_produk.delete({
      where: { id },
    });
   
    // Delete detail_model_produk
    await prisma.detail_model_produk.delete({
      where: { id: daftarProduk.detail_model_produk.id },
    });

// Delete foto_produk related to model_produk
    await prisma.foto_produk.deleteMany({
      where: { model_produk_id: daftarProduk.detail_model_produk.model_produk.id },
    });
    // Delete model_produk
    await prisma.model_produk.delete({
      where: { id: daftarProduk.detail_model_produk.model_produk.id },
    });

    

    return {
      success: true,
      message: `Produk dengan ID ${id} berhasil dihapus.`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal menghapus daftar produk.',
      error: error.message || 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi',
    };
  }
};




module.exports={
  findDaftarProduk,
  findDaftarProdukById,
  findDaftarProdukBySku,
  insertDaftarProdukRepo,
  updateDaftarProdukRepo,
  deleteDaftarProdukByIdRepo
}