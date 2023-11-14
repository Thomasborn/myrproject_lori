
const { PrismaClientValidationError } = require("@prisma/client/runtime/library");
const prisma = require("../db");
const findModelProduk = async () => {
  const model_produk = await prisma.model_produk.findMany({
    include:{
      kategori:true

    },
  });
  return model_produk;
};
const findAllModelProduk = async () => {
  try {
    const data = await prisma.detail_model_produk.findMany({
      select: {
        id: true,
        ukuran: true,
        biaya_jahit: true,
        hpp: true,
        model_produk_id: true,
        harga_jual: true,
        bahan_produk: {
          select: {
            jumlah: true,
            daftar_bahan: {
              select: {
                id:true,
                nama: true,
                satuan: true,
      
              }
            }
          }
        }
      }
    });
  
    // Menghitung harga satuan dari tabel restok bahan berdasarkan daftar_bahan_id
    for (const item of data) {
      for (const bahan of item.bahan_produk) {
        avgHargaSatuan = await prisma.$queryRaw`SELECT AVG(r.harga_satuan) as harga FROM restok_bahan r WHERE r.daftar_bahan_id = ${bahan.daftar_bahan.id}`;
        bahan.daftar_bahan.harga = avgHargaSatuan[0].harga;
      }
    }
    
  
    console.log(data);
  
    // // Calculate the average harga_satuan for each daftar_bahan
    // const result = detailModelProdukWithAvgHargaSatuan.map((detailModel) => {
    //   const bahanProduk = detailModel.bahan_produk;
    //   const daftarBahan = bahanProduk.daftar_bahan;
    //   const restokBahans = bahanProduk.restok_bahan;
    
    //   // Calculate the average harga_satuan
    //   const sumHargaSatuan = restokBahans.reduce((total, restokBahan) => total + restokBahan.harga_satuan, 0);
    //   const avgHargaSatuan = restokBahans.length > 0 ? sumHargaSatuan / restokBahans.length : 0;
    
    //   return {
    //     id: detailModel.id,
    //     ukuran: detailModel.ukuran,
    //     biaya_jahit: detailModel.biaya_jahit,
    //     hpp: detailModel.hpp,
    //     harga_jual: detailModel.harga_jual,
    //     bahan_produk: {
    //       id: bahanProduk.id,
    //       jumlah: bahanProduk.jumlah,
    //       daftar_bahan: {
    //         id: daftarBahan.id,
    //         kode: daftarBahan.kode,
    //         nama: daftarBahan.nama,
    //         satuan: daftarBahan.satuan,
    //       },
    //       avg_harga_satuan: avgHargaSatuan,
    //     },
    //   };
    // });
    
    // console.log(result);
    
    
    // console.log(result);
    
    return(data);
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      // Handle Prisma Client validation error
      console.error('Prisma validation error:', error.message);
      // Handle the error, return a response, or take appropriate action.
    } else {
      // Handle other types of errors
      console.error('Other error:', error);
      // Handle other errors differently if needed.
    }
  return error;
  }
};

const findModelProdukById = async (id) => {
  const model_produk = await prisma.model_produk.findUnique({
    where: {
      id:parseInt(id),
    },
   
  });
  
  return model_produk;
};
const findModelProdukByKode = async (kode) => {
  const model_produk = await prisma.model_produk.findFirst({
    where: {
      kode:kode,
    },
  });
  
  return model_produk;
};
const findDetailModelProdukByKode = async (ukuran,model_produk_id) => {
  const model_produk = await prisma.detail_model_produk.findFirst({
    where: {
      ukuran,
      model_produk_id
    },
  });
  
  return model_produk;
};
const insertModelProdukRepo = async (newModelProdukData) => {
  const {
    kode,
    nama,
    deskripsi,
    kategori_id,
    ukuran,
    biaya_jahit,
    hpp,
    harga_jual,
    model_produk_id,
    bahan_produk,
    variasi,
    foto,
    daftar_bahan,
  } = newModelProdukData;

  // Check if the model with the given kode exists
  const checkCode = await findModelProdukByKode(kode);

// return checkCode;
  if (checkCode) {
    throw new Error('Model with the same code already exists',checkCode);
  }
 
 

  
    // Create the main model_produk
    const model_produk = await prisma.model_produk.create({
      data: {
        kode,
        nama,
        deskripsi,
        variasi,
        // foto:imageUrls,
        kategori: {
          connect: {
            id: parseInt(kategori_id),
          },
        },
      },
    });

    const createdPhotos = await Promise.all(
      foto.map(async (imageUrl) => {
        const imageUrls = ('/public/images/model-produk' + foto.filename);
        const createdPhoto = await prisma.foto_produk.create({
          data: {
            filepath: imageUrls,
            model_produk: {
              connect: {
                id: parseInt(model_produk.id),
              },
            },
          },
        });
        return createdPhoto;
      })
    );
    
    // Check if a model with the same ukuran already exists
    const checkSize = await findDetailModelProdukByKode(ukuran, model_produk.id);

    if (checkSize) {
      throw new Error('Model with the same ukuran already exists');
    }

    // Create detail_model_produk
    const detail_model_produk = await prisma.detail_model_produk.create({
      data: {
        ukuran,
        biaya_jahit:parseFloat(biaya_jahit),
        hpp:parseFloat(hpp),
        harga_jual:parseFloat(harga_jual),
        model_produk: {
          connect: {
            id: model_produk.id,
          },
        },
      },
    });

    const detail_model_produk_id = detail_model_produk.id;

    // Create bahan_produk for each daftar_bahan
    const bahanProduk = [];
   

    for (const material of bahan_produk) {
      const { jumlah, daftar_bahan_id } = material;
      const bahan_produk = await prisma.bahan_produk.create({
        data: {
          jumlah:parseInt(jumlah),
          detail_model_produk: {
            connect: {
              id: detail_model_produk_id,
            },
          },
          daftar_bahan: {
            connect: {
              id: daftar_bahan_id,
            },
          },
        },
      });
      bahanProduk.push(bahan_produk);
    }

    const model_products = {
      model_produk: model_produk,
      detail_model_produk: detail_model_produk,
      bahanProduk: bahanProduk,
    };

    return model_products;
  };





const updateModelProdukRepo = async (id,updatedModelProdukData) => {
        const existingModelProduk = await prisma.model_produk.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingModelProduk) {
            return res.status(404).json({ error: "model_produk not found" });
      }

      // Validate and update the model_produk data
      const updatedModelProduk = await prisma.model_produk.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kode_produk: updatedProdukData.kode_produk || existingProduk.kode_produk,
          sku: updatedProdukData.sku || existingProduk.sku,
          nama_produk: updatedProdukData.nama_produk || existingProduk.nama_produk,
          stok: parseInt(updatedProdukData.stok) || existingProduk.stok,
      harga_jual: parseFloat(updatedProdukData.harga_jual) || existingProduk.harga_jual,

      },
      });
      return updatedProduk
}
const deleteModelProdukByIdRepo = async(id)=>{
  await prisma.model_produk.delete({
    where: { id: id },
  });
}
module.exports={
  findModelProduk,
  findModelProdukById,
  insertModelProdukRepo,
  updateModelProdukRepo,
  deleteModelProdukByIdRepo,
  findAllModelProduk
}