
const { PrismaClientValidationError } = require("@prisma/client/runtime/library");
const prisma = require("../db");
const { v4: uuidv4 } = require('uuid');
const fsp = require("fs/promises");
const fs = require('fs');
const path = require('path');
const findModelProduk = async () => {
  const model_produk = await prisma.model_produk.findMany({
    include:{
      kategori:true

    },
  });
  return model_produk;
};
const findFotoProduk = async (id) => {
  const fotoProduk = await prisma.foto_produk.findFirst({
    where:{
      id:id

    },
  });
  return fotoProduk;
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
    },include:{
      kategori:true,
      foto_produk:true
    }
   
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
const generateKode = async (nama) => {
  // Extract the first three characters of each word in the product name and concatenate them
  const baseKode = nama.split(' ')
                       .map(word => word.substring(0, 3).toUpperCase())
                       .join('');

  // Check if the generated kode already exists in the database
  let kode = baseKode;
  let counter = 1;

  while (await prisma.model_produk.findFirst({ where: { kode } })) {
    // If the kode already exists, append a numeric suffix to ensure uniqueness
    kode = `${baseKode}${counter}`;
    counter++;
  }

  return kode;
};
const insertModelProdukRepo = async (newModelProdukData) => {
  const {
    deskripsi,
    foto,
    kategori,
    nama,
    varian,
  } = newModelProdukData;

  try {
    // Generate a unique kode for the model, assuming you have a function for this
    const kode = await generateKode(nama);

    // Check if the model with the given kode exists
    const checkCode = await findModelProdukByKode(kode);
    if (checkCode) {
      throw new Error('Model dengan kode yang sama telah ada');
    }

    // Find kategori_id based on kategori name
    const kategoriRecord = await prisma.kategori_produk.findFirst({
      where: {
        nama: kategori,
      },
    });

    if (!kategoriRecord) {
      throw new Error('Kategori tidak ditemukan');
    }

    // Create the main model_produk entry
    const model_produk = await prisma.model_produk.create({
      data: {
        kode,
        nama,
        deskripsi,
        kategori: {
          connect: {
            id: parseInt(kategoriRecord.id),
          },
        },
      },
    });

    let createdPhotos = null;
    // Handle creation of photos associated with the model if foto exists
    if (foto && foto.length > 0) {
      createdPhotos = await Promise.all(
        foto.map(async (file) => {
          // Generate a random filename if it doesn't exist or is undefined
          const filename = file.filename ? file.filename : uuidv4() + path.extname(file.originalname);
          const targetDir = path.join(__dirname, 'public/images/model-produk');
          const targetPath = path.join(targetDir, filename);

          // Ensure the directory exists
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          // Move the file to the target directory
          fs.copyFileSync(file.path, targetPath);

          const imageUrls = '/public/images/model-produk/' + filename;

          // Create foto_produk entry and link it to model_produk
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
    }

    const createdVarian = await Promise.all(
      varian.map(async (variant) => {
        const { ukuran, biayaJahit, hpp, hargaJual, stok, bahan } = variant;

        // Create detail_model_produk for each variant
        const createdVariant = await prisma.detail_model_produk.create({
          data: {
            ukuran,
            biaya_jahit: biayaJahit,
            hpp,
            harga_jual: hargaJual,
            // stok,
            model_produk: {
              connect: {
                id: model_produk.id,
              },
            },
          },
        });

        // Create bahan_produk for each variant
        const createdBahan = await Promise.all(
          bahan.map(async (item) => {
            const { id, jumlahPakai } = item;

            // Create bahan_produk for the variant
            return prisma.bahan_produk.create({
              data: {
                // daftar_bahan_id: id,
                jumlah: parseFloat(jumlahPakai),
                detail_model_produk: {
                  connect: {
                    id: createdVariant.id,
                  },
                },
                daftar_bahan: {
                  connect: {
                    id: id,
                  },
                },
              },
            });
          })
        );

        return { createdVariant, createdBahan };
      })
    );

    return { model_produk, createdPhotos, createdVarian };
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menambahkan model produk baru');
  }
};
const updateModelProdukRepo = async (id, updateModelProdukData) => {
  const {
    deskripsi,
    foto,
    kategori,
    nama,
    varian,
  } = updateModelProdukData;

  try {
    // Find the existing model product by ID
    const existingModelProduk = await prisma.model_produk.findUnique({
      where: { id: parseInt(id) },
      include: {
        kategori: true, // Include the kategori data
        foto_produk: true, // Include the foto_produk data
        detail_model_produk: { // Include the detail_model_produk data
          include: {
            bahan_produk: true, // Include the bahan data
          },
        },
      },
    });

    if (!existingModelProduk) {
      throw new Error('Model produk tidak ditemukan');
    }

    // Find kategori_id based on kategori name
    const kategoriRecord = await prisma.kategori_produk.findFirst({
      where: {
        nama: kategori,
      },
    });

    if (!kategoriRecord) {
      throw new Error('Kategori tidak ditemukan');
    }

    // Update the main model_produk entry
    const updatedModelProduk = await prisma.model_produk.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        deskripsi,
        kategori: {
          connect: {
            id: parseInt(kategoriRecord.id),
          },
        },
      },
      include: {
        kategori: true, // Include the kategori data
        foto_produk: true, // Include the foto_produk data
        detail_model_produk: { // Include the detail_model_produk data
          include: {
            bahan_produk: true, // Include the bahan data
          },
        },
      },
    });

    let createdPhotos = null;
    // Handle updating photos associated with the model if foto exists
    if (foto && foto.length > 0) {
      // First, delete existing photos
      await prisma.foto_produk.deleteMany({
        where: { model_produk_id: parseInt(id) },
      });

      // Then, create new photos
      createdPhotos = await Promise.all(
        foto.map(async (file) => {
          const filename = file.filename ? file.filename : uuidv4() + path.extname(file.originalname);
          const targetDir = path.join(__dirname, 'public/images/model-produk');
          const targetPath = path.join(targetDir, filename);

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          fs.copyFileSync(file.path, targetPath);

          const imageUrls = '/public/images/model-produk/' + filename;

          return prisma.foto_produk.create({
            data: {
              filepath: imageUrls,
              model_produk: {
                connect: {
                  id: parseInt(id),
                },
              },
            },
          });
        })
      );
    }

    // Update variants
    const createdVarian = await Promise.all(
      varian.map(async (variant) => {
        const { ukuran, biayaJahit, hpp, hargaJual, stok, bahan } = variant;

        console.log('bahan:', bahan); // Add this logging

        // Find the existing variant by its unique key, or create a new one if it doesn't exist
        const existingVariant = await prisma.detail_model_produk.findFirst({
          where: {
            model_produk_id: parseInt(id),
            ukuran: ukuran,
          },
        });

        const createdOrUpdatedVariant = existingVariant
          ? await prisma.detail_model_produk.update({
              where: { id: existingVariant.id },
              data: {
                biaya_jahit: biayaJahit,
                hpp,
                harga_jual: hargaJual,
                // stok,
              },
            })
          : await prisma.detail_model_produk.create({
              data: {
                ukuran,
                biaya_jahit: biayaJahit,
                hpp,
                harga_jual: hargaJual,
                // stok,
                model_produk: {
                  connect: {
                    id: parseInt(id),
                  },
                },
              },
            });

        // Delete existing bahan for this variant
        await prisma.bahan_produk.deleteMany({
          where: { detail_model_produk_id: createdOrUpdatedVariant.id },
        });

        // Create new bahan for the variant
        await Promise.all(
          bahan.map(async (item) => {
            const { id, jumlahPakai } = item;

            return prisma.bahan_produk.create({
              data: {
                jumlah: parseFloat(jumlahPakai),
                detail_model_produk: {
                  connect: {
                    id: createdOrUpdatedVariant.id,
                  },
                },
                daftar_bahan: {
                  connect: {
                    id: id,
                  },
                },
              },
            });
          })
        );

        return createdOrUpdatedVariant;
      })
    );

    return { updatedModelProduk, createdPhotos, createdVarian };
  } catch (error) {
    console.error(error);
    throw new Error('Gagal memperbarui model produk');
  }
};







const updateModelProdukRepoOld = async (id,updatedModelProdukData) => {
  const {
    kode,
    nama,
    deskripsi,
    variasi,
    foto,
    kategori_id,
    ukuran,
    biaya_jahit,
    hpp,
    harga_jual,
    bahan_produk,
    daftar_bahan,
  } = updatedModelProdukData;

  // Check if the model with the given kode exists
  const existingModel = await prisma.model_produk.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingModel) {
    throw new Error('Model not found');
  }
  // const kategori_id = await prisma.kategori_produk.findFirst({
  //   where:{
  //     nama:kategori
  //   }
  // });
  // Update the main model_produk
  const updatedModel = await prisma.model_produk.update({
    where: {
      id: id,
    },
    data: {
      kode,
      nama,
      deskripsi,
      variasi,
      kategori: {
        connect: {
          id: parseInt(kategori_id),
        },
      },
    },
  });

  // // Update existing photos or add new ones
  // const updatedPhotos = await Promise.all(
  //   foto.map(async (imageUrl) => {
  //     const imageUrls = ('/public/images/model-produk' + foto.filename);
  //     const fotoId= await prisma.foto_produk.findFirst({
  //       where:{
  //         id:updatedModel.id
  //       }
  //     })
  //     const updatedPhoto = await prisma.foto_produk.upsert({
  //       where: {
  //         model_produk_id: updatedModel.id,
  //       },
  //       update: {
  //         filepath: imageUrls,
  //       },
  //       create: {
  //         filepath: imageUrls,
  //         model_produk: {
  //           connect: {
  //             id: updatedModel.id,
  //           },
  //         },
  //       },
  //     });
  //     return updatedPhoto;
  //   })
  // );

  // Update or create bahan_produk for each daftar_bahan
  const detail_model_produk = await prisma.detail_model_produk.findFirst({
    where: {
    model_produk_id: existingModel.id
    
  }});
  const updatedBahanProduk = await Promise.all(
    bahan_produk.map(async (material) => {
      const { jumlah, daftar_bahan_id } = material;
      const existingBahanProduk = await prisma.bahan_produk.findFirst({
        where: {
          detail_model_produk_id: {
            equals: detail_model_produk.id,
          },
          daftar_bahan_id: {
            equals: daftar_bahan_id,
          },
        },
      });

      if (existingBahanProduk) {
        // Update existing bahan_produk
        return prisma.bahan_produk.update({
          where: {
            id: existingBahanProduk.id,
          },
          data: {
            jumlah: parseInt(jumlah),
          },
        });
      } else {
        // Create new bahan_produk
        return prisma.bahan_produk.create({
          data: {
            jumlah: parseInt(jumlah),
            detail_model_produk: {
              connect: {
                id: detail_model_produk.id,
              },
            },
            daftar_bahan: {
              connect: {
                id: daftar_bahan_id,
              },
            },
          },
        });
      }
    })
  );

  const updatedModelProducts = {
    model_produk: updatedModel,
    detail_model_produk: existingModel.detail_model_produk,
    bahanProduk: updatedBahanProduk,
  };

  return updatedModelProducts;
}
const updatedFotoProdukRepo = async(fotoProduk,newFotoProduk)=>{
  // return fotoProduk;
  // if (!fotoProduk || !fotoProduk.filepath) {
  //   throw new Error('Invalid existing photo data');
  // }
  try {
    const fullPath = path.join(__dirname, '..', fotoProduk.filepath); // Adjust '..' based on your project structure
    await fsp.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting existing file:', error);
  }
  const imageUrls = ('/public/images/model-produk/' + newFotoProduk.foto.filename);
  const updateFotoProduk = await prisma.foto_produk.update({
        where:{
          id:fotoProduk.id
        },
        data:{
        filepath:imageUrls
        }
          });
          return updateFotoProduk;
}
const deleteModelProdukByIdRepo = async(id)=>{
  await prisma.model_produk.delete({
    where: { id: id },
  });
}
module.exports={
  findModelProdukById,
  findModelProduk,
  findFotoProduk,
  insertModelProdukRepo,
  updateModelProdukRepo,
  updatedFotoProdukRepo,
  deleteModelProdukByIdRepo,
  findAllModelProduk
}