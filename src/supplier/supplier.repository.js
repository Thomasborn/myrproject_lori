
const prisma = require("../db");

const findsupplier = async () => {
  const supplier = await prisma.supplier.findMany();

  return supplier;
};

const findsupplierById = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: {
      id,
    },
  });
  
  return supplier;
};
const insertsupplierRepo = async (newsupplierData) => {
  
  const kode = newsupplierData.kode;

  const nama = newsupplierData.nama;
  const alamat = newsupplierData.alamat;
  const kontak = newsupplierData.kontak;
  const no_rekening = newsupplierData.no_rekening;
  const supplier = await prisma.supplier.create({
    data: {
      kode,
      nama,
      alamat,
      kontak,
      no_rek:no_rekening,
    
      },
  });
  return supplier
}
const updatesupplierRepo = async (id,updatedsupplierData) => {
        const existingsupplier = await prisma.supplier.findUnique({
          where: { id: parseInt(id) },
        });
        
        if (!existingsupplier) {
            return res.status(404).json({ error: "supplier not found" });
      }

      // Validate and update the supplier data
      const updatedsupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
          // Add validation and update fields as needed
          kategori: updatedsupplierData.kategori || existingsupplier.kategori.kategori
        
      },
      });
      return updatedsupplier
}
const deletesupplierByIdRepo = async(id)=>{
  await prisma.supplier.delete({
    where: { id: id },
  });
}
module.exports={
  findsupplier,
  findsupplierById,
  insertsupplierRepo,
  updatesupplierRepo,
  deletesupplierByIdRepo
}