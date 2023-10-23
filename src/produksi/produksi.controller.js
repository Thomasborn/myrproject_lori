
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getProduksi,
  insertProduksi,
  updatedProduksi,
  getProduksiById,
  deleteproduksiById,
} = require("./produksi.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const produksi =  await getProduksi();
    res.send(produksi);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const produksi = await getProduksiById(parseInt(produkId));
  
      res.send(produksi);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const produksi = await insertProduksi(newProdukData);
    
  
     
      res.send({
        
        data:produksi,
        message:"Produksi berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produksi:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedProdukData = req.body;
     
      try {
          // Check if the produksi exists before attempting to update it
        const produksi = await updatedProduksi(parseInt(id),updatedProdukData)
    
    res.send({data:produksi, message: "produksi updated successfully" });
} catch (error) {
    console.error('Error updating produksi:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
// router.put("/:id", upload.none(), async (req, res) => {
//     const { id } = req.params;
//     const updatedProdukData = req.body;
    
//     try {
//         // Check if the produksi exists before attempting to update it
//         const existingProduk = await prisma.produksi.findUnique({
//             where: { id: parseInt(id) },
//         });
        
//         if (!existingProduk) {
//             return res.status(404).json({ error: "produksi not found" });
//         }
        
//         // Validate and update the produksi data
//         const updatedProduk = await prisma.produksi.update({
//             where: { id: parseInt(id) },
//             data: {
//                 // Update the field only if it's provided in the request body
//                 kode_produk: updatedProdukData.kode_produk || existingProduk.kode_produk,
//                 sku: updatedProdukData.sku || existingProduk.sku,
//                 nama_produk: updatedProdukData.nama_produk || existingProduk.nama_produk,
//                 stok: updatedProdukData.stok !== undefined ? parseInt(updatedProdukData.stok) : existingProduk.stok,
//                 harga_jual: updatedProdukData.harga_jual !== undefined ? parseFloat(updatedProdukData.harga_jual) : existingProduk.harga_jual,
//                 // ... other fields
//             },
//         });
        
//         res.send({ message: "produksi updated successfully", updatedProduk });
//     } catch (error) {
//         console.error('Error updating produksi:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the produksi exists, delete it
   await deleteproduksiById(parseInt(id))

    res.json({ message: "produksi deleted successfully" });
  } catch (error) {
    console.error('Error deleting produksi:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;