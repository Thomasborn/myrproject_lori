
const prisma = require("../db");
const daftarProdukRepo = require("../daftar_produk/daftar_produk.repository");
const produksi = require("../produksi/produksi.repository");

const findQcProduksi = async () => {
  const qc_produksis = await prisma.qc_produksi.findMany({
    include: {
      // Include related data from 'qc_produksi_produk' and 'kondisi_produk'
      user: true,
      produksi: true,
    },
  });
  
  // Now 'qc_produksis' contains the details with related 'qc_produksi_produk' and 'kondisi_produk'
  
  return qc_produksis;
};

const findQcProduksiById = async (id) => {
  const qc_produksi = await prisma.qc_produksi.findUnique({
    where: {
      id,
    },
  });
  
  return qc_produksi;
};
function generateFourDigitNumber(str1, str2, str3) {
  // Concatenate the strings
  const combinedString = str1 + str2 + str3;

  // Use a simple hashing function to convert the string to a number
  const hashCode = combinedString.split('').reduce((acc, char) => {
    const charCode = char.charCodeAt(0);
    return (acc << 5) - acc + charCode;
  }, 0);

  // Ensure the result is a positive 4-digit number
  const fourDigitNumber = Math.abs(hashCode) % 10000;

  // Pad with leading zeros if needed
  const paddedNumber = fourDigitNumber.toString().padStart(4, '0');

  return paddedNumber;
}

const insertQcProduksiRepo = async (newprodukData) => {

const status = newprodukData.status;
// const waktu = newprodukData.waktu;
const deskripsi = newprodukData.deskripsi;
const keterangan = newprodukData.keterangan;
const tanggal_mulai = newprodukData.tanggal_mulai;
const tanggal_selesai = newprodukData.tanggal_mulai;
const user_id = parseInt(newprodukData.user_id);
const jumlah_aman = parseInt(newprodukData.jumlah_aman);
const jumlah_rusak = parseInt(newprodukData.jumlah_rusak);
const produksi_id = parseInt(newprodukData.produksi_id);
const bahan = JSON.parse(newprodukData.bahan);
// return bahan;
const qc_produksi = await prisma.qc_produksi.create({
  data: {
    status,
    // waktu,
    deskripsi,
    jumlah_aman,
    jumlah_rusak,
    user: {
      connect: {
        id: user_id,
      },
    },
    produksi: {
      connect: {
        id: produksi_id,
      },
    },
  },
});

const listProduk = await produksi.findProduksiById(produksi_id);
// const sku = `${listProduk.detail_model_produk.ukuran}${listProduk.detail_model_produk.model_produk.kode}${listProduk.detail_model_produk.model_produk.variasi}`;
const ukuran = listProduk.detail_model_produk.ukuran;
const kode = listProduk.detail_model_produk.model_produk.kode;
const variasi = listProduk.detail_model_produk.model_produk.variasi;

// Combine the values into a single string
const generate4DigitNumber = generateFourDigitNumber(ukuran, kode, variasi);
const sku = `${ukuran}${kode}${variasi}${generate4DigitNumber}`;


const existingLemari = await prisma.lemari.findUnique({
where: {
  id: lemari_id,
},
});

if (!existingLemari) {
return ({ error: 'Lemari not found.' });
}

let daftar_produk;
const checkSku = await daftarProdukRepo.findDaftarProdukBySku(sku);
if(checkSku){
 // Check if lemari with the provided id exists
 
// Create stok_produk
 daftar_produk = await prisma.stok_produk.create({
  data: {
    daftar_produk: {
      connect: {
        id: checkSku.id,
      },
    },
    lemari: {
      connect: {
        id: lemari_id,
      },
    },
    jumlah_aman,
  },
});

}

 daftar_produk = await prisma.daftar_produk.create({
  data: {
    sku,
    detail_model_produk: {
      connect: {
        id: listProduk.detail_model_produk_id,
      },
    },
  },
});

if(jumlah_rusak && status !="aman"){
  const perbaikan_produksi = await prisma.perbaikan_produksi.create({
    data: {
      tanggal_mulai,
      tanggal_selesai,
      jumlah:jumlah_rusak,
      keterangan,
      qc_produksi:{
        connect:{
          id: qc_produksi.id,
    },
  }}});
  const bahanPerbaikan = [];
   

  for (const material of bahan) {
    const { jumlah, daftar_bahan_id } = material;
    const bahan = await prisma.detail_bahan_perbaikan.create({
      data: {
        jumlah:parseInt(jumlah),
        perbaikan_produksi: {
          connect: {
            id: perbaikan_produksi.id,
          },
        },
        daftar_bahan: {
          connect: {
            id: daftar_bahan_id,
          },
        },
      },
    });
    bahanPerbaikan.push(bahan);
  }

  const daftar_qc_produksi = {
    qc_produksi: qc_produksi,
    perbaikan_produksi: perbaikan_produksi,
    bahanPerbaikan: bahanPerbaikan,
    daftar_produk:daftar_produk
  };

  
  return daftar_qc_produksi;
}
const daftar_qc_produksi = {
  qc_produksi: qc_produksi,
  daftar_produk:daftar_produk
};
return daftar_qc_produksi;
}

const updateQcProduksiRepo = async (id,updatedProdukData) => {
        const existingProduk = await prisma.qc_produksi.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "qc_produksi not found" });
      }

      // Validate and update the qc_produksi data
      const updatedProduk = await prisma.qc_produksi.update({
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
const deleteQcProduksiByIdRepo = async(id)=>{
  await prisma.qc_produksi.delete({
    where: { id: id },
  });
}
module.exports={
  findQcProduksi,
  findQcProduksiById,
  insertQcProduksiRepo,
  updateQcProduksiRepo,
  deleteQcProduksiByIdRepo
}