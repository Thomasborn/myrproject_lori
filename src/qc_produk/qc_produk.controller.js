
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getQcProduk,
  insertQcProduk,
  updatedQcProduk,
  getQcProdukById,
  deleteQcProdukById,
} = require("./qc_produk.service");

const router = express.Router();
router.get("/",async (req,res) => {
  const query= req.query;
    const qc_produk =  await getQcProduk(query);
    res.send(qc_produk);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const qc_produk = await getQcProdukById(parseInt(produkId));
  
      res.send(qc_produk);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const qc_produk = await insertQcProduk(newProdukData);
    
  
     
      res.send(qc_produk);
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedQcProdukData = req.body;
     
      try {
          // Check if the qc_produk exists before attempting to update it
        const qc_produk = await updatedQcProduk(parseInt(id),updatedQcProdukData)
    
    res.send({data:qc_produk, message: "qc_produk updated successfully" });
} catch (error) {
    console.error('Error updating qc_produk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedQcProdukData = req.body;
    
    try {
        // Check if the qc_produk exists before attempting to update it
        const existingProduk = await prisma.qc_produk.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "qc_produk not found" });
        }
        
        // Validate and update the qc_produk data
        const updatedQcProduk = await prisma.qc_produk.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_produk: updatedQcProdukData.kode_produk || existingProduk.kode_produk,
                sku: updatedQcProdukData.sku || existingProduk.sku,
                nama_produk: updatedQcProdukData.nama_produk || existingProduk.nama_produk,
                stok: updatedQcProdukData.stok !== undefined ? parseInt(updatedQcProdukData.stok) : existingProduk.stok,
                harga_jual: updatedQcProdukData.harga_jual !== undefined ? parseFloat(updatedQcProdukData.harga_jual) : existingProduk.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "qc_produk updated successfully", updatedQcProduk });
    } catch (error) {
        console.error('Error updating qc_produk:', error);
        res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the qc_produk exists, delete it
   await deleteQcProdukById(parseInt(id))

    res.json({ message: "qc_produk deleted successfully" });
  } catch (error) {
    console.error('Error deleting qc_produk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;