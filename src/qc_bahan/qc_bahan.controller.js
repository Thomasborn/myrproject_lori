
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getQcBahan,
  insertQcBahan,
  updatedQcBahan,
  getQcBahanById,
  deleteQcBahanById,
} = require("./qc_bahan.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const qc_bahan =  await getQcBahan();
    res.send(qc_bahan);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const qc_bahan = await getQcBahanById(parseInt(produkId));
  
      res.send(qc_bahan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const qc_bahan = await insertQcBahan(newProdukData);
    
  
     
      res.send({
        
        data:qc_bahan,
        message:`Bahan dengan id ${daftar_bahan_id} telah berhasil dicek`
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedQcBahanData = req.body;
     
      try {
          // Check if the qc_bahan exists before attempting to update it
        const qc_bahan = await updatedQcBahan(parseInt(id),updatedQcBahanData)
    
    res.send({data:qc_bahan, message: "qc_bahan updated successfully" });
} catch (error) {
    console.error('Error updating qc_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedQcBahanData = req.body;
    
    try {
        // Check if the qc_bahan exists before attempting to update it
        const existingProduk = await prisma.qc_bahan.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "qc_bahan not found" });
        }
        
        // Validate and update the qc_bahan data
        const updatedQcBahan = await prisma.qc_bahan.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_produk: updatedQcBahanData.kode_produk || existingProduk.kode_produk,
                sku: updatedQcBahanData.sku || existingProduk.sku,
                nama_produk: updatedQcBahanData.nama_produk || existingProduk.nama_produk,
                stok: updatedQcBahanData.stok !== undefined ? parseInt(updatedQcBahanData.stok) : existingProduk.stok,
                harga_jual: updatedQcBahanData.harga_jual !== undefined ? parseFloat(updatedQcBahanData.harga_jual) : existingProduk.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "qc_bahan updated successfully", updatedQcBahan });
    } catch (error) {
        console.error('Error updating qc_bahan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the qc_bahan exists, delete it
   await deleteQcBahanById(parseInt(id))

    res.json({ message: "qc_bahan deleted successfully" });
  } catch (error) {
    console.error('Error deleting qc_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;