
const prisma = require("../db");

const findbahan = async () => {
  const pengecekans = await prisma.detail_pengecekan_bahan.findMany({
    include: {
      // Include related data from 'pengecekan_bahan' and 'kondisi_bahan'
      pengecekan_bahan: true,
      kondisi_bahan: true,
    },
  });
  
  // Now 'pengecekans' contains the details with related 'pengecekan_bahan' and 'kondisi_bahan'
  
  return pengecekans;
};

const findbahanById = async (id) => {
  const pengecekan = await prisma.detail_pengecekan_bahan.findUnique({
    where: {
      id,
    }, include: {
      // Include related data from 'pengecekan_bahan' and 'kondisi_bahan'
      pengecekan_bahan: true,
      kondisi_bahan: true,
    },
  });
  
  return pengecekan;
};
const insertbahanRepo = async (newbahanData) => {
  
//   const pengecekan_bahan_id = newbahanData.pengecekan_bahan_id;
//   const pengecekanBahan = {
//     nama_pic: newbahanData.nama_pic, // Replace with the actual PIC name
//     tanggal: newbahanData.tanggal, // Replace with the actual date
//   };
//   const kondisi = newbahanData.kondisi;
//   const bahan_item_id = newbahanData.bahan_item_id;
//   const kondisi_bahan_id = newbahanData.kondisi_bahan_id;
//   const jumlah = parseInt(newbahanData.jumlah);
// if(kondisi_bahan_id== null || kondisi_bahan_id== undefined){
  
//   const kondisi_bahan = await prisma.kondisi_bahan.create({
//     data:{
//       kondisi,
//     }
//   });
// }
// if(pengecekan_bahan_id== null || pengecekan_bahan_id== undefined){
//   const pengecekan_bahan = await prisma.pengecekan_bahan.create({
//     data:{
//       pengecekanBahan,
//     }
//   });
// }
  
//   const pengecekan = await prisma.detail_pengecekan_bahan.create({
//     data: {
//       pengecekan_bahan_id: pengecekan_bahan_id||pengecekan_bahan.id,
//       bahan_item_id,
//       kondisi_bahan_id: kondisi_bahan_id || kondisi_bahan.id,
//       jumlah,
   
      
//     },
//   });
//   return pengecekan
// const pengecekan_bahan_id = newbahanData.pengecekan_bahan_id;
// const pengecekanBahan = {
//   nama_pic: newbahanData.nama_pic,
//   tanggal: newbahanData.tanggal,
// };
// const kondisi = newbahanData.kondisi;
// const bahan_item_id = newbahanData.bahan_item_id;
// const kondisi_bahan_id = newbahanData.kondisi_bahan_id;
// const jumlah = parseInt(newbahanData.jumlah);

// let createdKondisiBahan;
// let createdPengecekanBahan;

// if (kondisi_bahan_id == null || kondisi_bahan_id == undefined) {
//   const kondisi_bahan = await prisma.kondisi_bahan.create({
//     data: {
//       kondisi,
//     },
//   });
//   createdKondisiBahan = kondisi_bahan;
// }

// if (pengecekan_bahan_id == null || pengecekan_bahan_id == undefined) {
//   const pengecekan_bahan = await prisma.pengecekan_bahan.create({
//     data: {
//       pengecekanBahan,
//     },
//   });
//   createdPengecekanBahan = pengecekan_bahan;
// }
// const pengecekan = await prisma.detail_pengecekan_bahan.create({
  //   data: {
    //     pengecekan_bahan_id: pengecekan_bahan_id || createdPengecekanBahan?.id,
    //     bahan_item_id,
    //     kondisi_bahan_id: kondisi_bahan_id || createdKondisiBahan?.id,
    //     jumlah,
    //   },
    // });
    
    // return pengecekan;
    
    // }
    const pengecekan_bahan_id = parseInt(newbahanData.pengecekan_bahan_id);
    const pengecekanbahan = {
      nama_pic: newbahanData.nama_pic,
      tanggal: newbahanData.tanggal,
    };
    const kondisi = newbahanData.kondisi;
    const stok_bahan_id = parseInt(newbahanData.stok_bahan_id);
    const kondisi_bahan_id = parseInt(newbahanData.kondisi_bahan_id);
    const jumlah = parseInt(newbahanData.jumlah);
    
    let createdKondisibahan;
    let createdPengecekanbahan;
    
    if (kondisi_bahan_id == null || isNaN(kondisi_bahan_id)) {
      const existingKondisibahan = await prisma.kondisi_bahan.findFirst({
        where: {
          kondisi: {
            equals: kondisi,
          },
        },
      });
      createdKondisibahan= existingKondisibahan;
      if (!existingKondisibahan) {
      const kondisi_bahan = await prisma.kondisi_bahan.create({
        data: {
          kondisi,
        },
      });
      createdKondisibahan = kondisi_bahan;
    }
    }
    
    if (pengecekan_bahan_id == null || isNaN(pengecekan_bahan_id)) {
      const pengecekan_bahan = await prisma.pengecekan_bahan.create({
        data: pengecekanbahan,
      });
      createdPengecekanbahan = pengecekan_bahan;
    }
    
    const pengecekan = await prisma.detail_pengecekan_bahan.create({
      data: {
        pengecekan_bahan: {
          connect: {
            id: createdPengecekanbahan?.id||pengecekan_bahan_id,
          },
        },
        stok_bahan: {
          connect: {
            id: stok_bahan_id || createdbahanItem?.id,
          },
        },
        kondisi_bahan: {
          connect: {
            id: createdKondisibahan?.id||kondisi_bahan_id ,
          },
        },
        jumlah,
      },
    });
    
    return pengecekan;
    }
const updatebahanRepo = async (id,updatedbahanData) => {
        const existingbahan = await prisma.detail_pengecekan_bahan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingbahan) {
            return res.status(404).json({ error: "pengecekan not found" });
      }
      const pengecekan_bahan_id = updatedbahanData.pengecekan_bahan_id;
      const pengecekanBahan = {
        nama_pic: updatedbahanData.nama_pic,
        tanggal: updatedbahanData.tanggal,
      };
      const kondisi = updatedbahanData.kondisi;
      const stok_bahan_id = updatedbahanData.stok_bahan_id;
      const kondisi_bahan_id = updatedbahanData.kondisi_bahan_id;
      const jumlah = parseInt(updatedbahanData.jumlah);
      
      let createdKondisiBahan;
      let createdPengecekanBahan;
      
      if (kondisi_bahan_id == null || kondisi_bahan_id == undefined) {
        const kondisi_bahan = await prisma.kondisi_bahan.create({
          data: {
            kondisi,
          },
        });
        createdKondisiBahan = kondisi_bahan;
      }
      
      if (pengecekan_bahan_id == null || pengecekan_bahan_id == undefined) {
        const pengecekan_bahan = await prisma.pengecekan_bahan.create({
          data: {
            pengecekanBahan,
          },
        });
        createdPengecekanBahan = pengecekan_bahan;
      }
      // Validate and update the pengecekan data
      const updatedbahan = await prisma.detail_pengecekan_bahan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          pengecekan_bahan_id: updatedbahanData.pengecekan_bahan_id || existingbahan.pengecekan_bahan_id || createdPengecekanBahan?.id,
          stok_bahan_id: updatedbahanData.stok_bahan_id || existingbahan.stok_bahan_id,
          kondisi_bahan_id: updatedbahanData.kondisi_bahan_id || existingbahan.kondisi_bahan_id||createdKondisiBahan?.id,
          jumlah: parseInt(updatedbahanData.jumlah) || existingbahan.jumlah,
    

      },
      });
      return updatedbahan
}
const deletebahanByIdRepo = async(id)=>{
  await prisma.detail_pengecekan_bahan.delete({
    where: { id: id },
  });
}
module.exports={
  findbahan,
  findbahanById,
  insertbahanRepo,
  updatebahanRepo,
  deletebahanByIdRepo
}