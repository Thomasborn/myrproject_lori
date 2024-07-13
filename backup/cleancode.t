const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertModelProdukRepo = async (newModelProdukData) => {
  const {
    kode,
    nama,
    deskripsi,
    foto,
    kategori_id,
    ukuran,
    biaya_jahit,
    hpp,
    harga_jual,
    model_produk_id,
    bahan_id,
    daftar_bahan,
  } = newModelProdukData;

  // Check if the model with the given kode exists
  const checkCode = await prisma.model_produk.findUnique({
    where: {
      kode,
    },
  });

  if (checkCode) {
    throw new Error('Model with the same code already exists');
  }

  // Create the main model_produk
  const createdModelProduk = await prisma.model_produk.create({
    data: {
      kode,
      nama,
      deskripsi,
      foto,
      kategori: {
        connect: {
          id: parseInt(kategori_id),
        },
      },
      detail_model_produk: {
        create: {
          ukuran,
          biaya_jahit,
          hpp,
          harga_jual,
          bahan_produk: {
            create: {
              daftar_bahan: {
                connect: daftar_bahan.map((item) => {
                  return { id: item.daftar_bahan_id };
                }),
              },
              jumlah: ukuran.length, // Set the initial quantity based on the number of sizes
            },
          },
        },
      },
    },
    include: {
      detail_model_produk: {
        include: {
          bahan_produk: {
            include: {
              daftar_bahan: true,
            },
          },
        },
      },
    },
  });

  return createdModelProduk;
};

module.exports = insertModelProdukRepo;
