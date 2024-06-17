
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getQcProduksi,
  insertQcProduksi,
  updatedQcProduksi,
  getQcProduksiById,
  deleteQcProduksiById,
  editQcProduksiById,
} = require("./qc_produksi.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const qc_produksi =  await getQcProduksi();
    res.send(qc_produksi);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const qc_produksi = await getQcProduksiById(parseInt(produkId));
  
      res.send(qc_produksi);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const qc_produksi = await insertQcProduksi(newProdukData);
    
  
     
      res.send({
        
        qc_produksi,
        message:"Produk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedQcProduksiData = req.body;
     
      try {
          // Check if the qc_produksi exists before attempting to update it
        const qc_produksi = await updatedQcProduksi(parseInt(id),updatedQcProduksiData)
    
    res.send({data:qc_produksi, message: "qc_produksi updated successfully" });
} catch (error) {
    console.error('Error updating qc_produksi:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedQcProduksiData = req.body;
    
    try {
        // Check if the qc_produksi exists before attempting to update it
        const existingProduk = await prisma.qc_produksi.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "qc_produksi not found" });
        }
        
        // Validate and update the qc_produksi data
        const updatedQcProduksi = await prisma.qc_produksi.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_produk: updatedQcProduksiData.kode_produk || existingProduk.kode_produk,
                sku: updatedQcProduksiData.sku || existingProduk.sku,
                nama_produk: updatedQcProduksiData.nama_produk || existingProduk.nama_produk,
                stok: updatedQcProduksiData.stok !== undefined ? parseInt(updatedQcProduksiData.stok) : existingProduk.stok,
                harga_jual: updatedQcProduksiData.harga_jual !== undefined ? parseFloat(updatedQcProduksiData.harga_jual) : existingProduk.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "qc_produksi updated successfully", updatedQcProduksi });
    } catch (error) {
        console.error('Error updating qc_produksi:', error);
        res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the qc_produksi exists, delete it
   await deleteQcProduksiById(parseInt(id))

    res.json({ message: "qc_produksi deleted successfully" });
  } catch (error) {
    console.error('Error deleting qc_produksi:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;