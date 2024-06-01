
const prisma = require("../db");
const findkaryawan = async () => {
  const karyawan = await prisma.karyawan.findMany();

  return karyawan.map(employee => ({
    id: employee.id,
    nama: employee.nama,
    gender: employee.jenis_kelamin, // Assuming 'jenis_kelamin' maps to 'gender' in your model
    nik: employee.nik,
    alamat: employee.alamat,
    noHp: employee.kontak, // Assuming 'kontak' maps to 'noHp' in your model
    email: employee.email,
    foto: employee.foto,
    posisi: employee.posisi,
    status: employee.status,
    bank: employee.bank,
    norek: employee.no_rekening, // Assuming 'no_rekening' maps to 'norek' in your model
    akunBank: employee.akun_bank // Assuming 'akun_bank' maps to 'akunBank' in your model
  }));
};
const findkaryawanById = async (id) => {
  const karyawan = await prisma.karyawan.findUnique({
    where: {
      id,
    },
  });

  if (!karyawan) {
    return null; // Return null if no employee found with the provided ID
  }

  return {
    id: karyawan.id,
    nama: karyawan.nama,
    gender: karyawan.jenis_kelamin, // Assuming 'jenis_kelamin' maps to 'gender' in your model
    nik: karyawan.nik,
    alamat: karyawan.alamat,
    noHp: karyawan.kontak, // Assuming 'kontak' maps to 'noHp' in your model
    tanggal_lahir: karyawan.tanggal_lahir,
    noRekening: karyawan.no_rekening, // Assuming 'no_rekening' maps to 'noRekening' in your model
    foto: karyawan.foto,
    posisi: karyawan.posisi,
    status: karyawan.status,
    bank: karyawan.bank,
    akunBank: karyawan.akun_bank // Assuming 'akun_bank' maps to 'akunBank' in your model
  };
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