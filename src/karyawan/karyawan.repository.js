
const prisma = require("../db");

const findkaryawan = async () => {
  const karyawan = await prisma.karyawan.findMany();

  return karyawan;
};

const findkaryawanById = async (id) => {
  const karyawan = await prisma.karyawan.findUnique({
    where: {
      id,
    },
  });
  
  return karyawan;
};
const insertkaryawanRepo = async (newkaryawanData) => {
  
  const nama = newkaryawanData.nama;
  const nik = newkaryawanData.nik;
  const alamat = newkaryawanData.alamat;
  const kontak = newkaryawanData.kontak;
  const tanggal_lahir = newkaryawanData.tanggal_lahir;
  const no_rekening = newkaryawanData.no_rekening;
  const karyawan = await prisma.karyawan.create({
    data: {
      nama,
      nik,
      alamat,
      kontak,
      tanggal_lahir,
      no_rekening
      },
  });
  return karyawan
}
const updatekaryawanRepo = async (id,updatedkaryawanData) => {
        const existingkaryawan = await prisma.karyawan.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingkaryawan) {
            return res.status(404).json({ error: "karyawan not found" });
      }

      // Validate and update the karyawan data
      const updatedkaryawan = await prisma.karyawan.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
           nama : newkaryawanData.nama    || existingkaryawan.nama,
           nik : newkaryawanData.nik      || existingkaryawan.nik,
           alamat : newkaryawanData.alamat|| existingkaryawan.alamat,
           kontak : newkaryawanData.kontak|| existingkaryawan.kontak,
           tanggal_lahir : newkaryawanData.tanggal_lahir|| existingkaryawan.tanggal_lahir,
           role_id :  newkaryawanData.role_id|| existingkaryawan.role_id,
           no_rekening : newkaryawanData.no_rekening|| existingkaryawan.no_rekening,
           
        
      },
      });
      return updatedkaryawan
}
const deletekaryawanByIdRepo = async(id)=>{
  const users = findkaryawanById(id);
  for (const user in users) {
    if (user) {
      await prisma.user.delete({
        where: { karyawan_id: id },
      });
    }
  }


  await prisma.karyawan.delete({
    where: { id: id },
  });
}
module.exports={
  findkaryawan,
  findkaryawanById,
  insertkaryawanRepo,
  updatekaryawanRepo,
  deletekaryawanByIdRepo
}