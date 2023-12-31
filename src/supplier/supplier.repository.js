
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
  
  const nama_supplier = newsupplierData.nama_supplier;
  const alamat = newsupplierData.alamat;
  const kontak = newsupplierData.kontak;
  const nama_pic = newsupplierData.nama_pic;
  const kontak_pic = newsupplierData.kontak_pic;
  const supplier = await prisma.supplier.create({
    data: {
      nama_supplier,
      alamat,
      kontak,
      nama_pic,
      kontak_pic
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