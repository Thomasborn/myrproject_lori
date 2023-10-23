
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getbahans,
  insertbahan,
  updatedbahan,
  getbahanById,
  createbahan,
  deletebahanById,
  editbahanById,
} = require("./pembelian.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const pembelian =  await getbahans();
    res.send(pembelian);
 });

router.get("/:id", async (req, res) => {
    try {
      const bahanId = parseInt(req.params.id);
      const pembelian = await getbahanById(parseInt(bahanId));
  
      res.send(pembelian);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newbahanData = req.body;

        const pembelian = await insertbahan(newbahanData);
    
  
     
      res.send({
        
        data:pembelian,
        message:"bahan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating bahan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedbahanData = req.body;
     
      try {
          // Check if the pembelian exists before attempting to update it
        const pembelian = await updatedbahan(parseInt(id),updatedbahanData)
    
    res.send({data:pembelian, message: "pembelian updated successfully" });
} catch (error) {
    console.error('Error updating pembelian:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedbahanData = req.body;
    
    try {
        // Check if the pembelian exists before attempting to update it
        const existingbahan = await prisma.pembelian.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingbahan) {
            return res.status(404).json({ error: "pembelian not found" });
        }
        
        // Validate and update the pembelian data
        const updatedbahan = await prisma.pembelian.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_bahan: updatedbahanData.kode_bahan || existingbahan.kode_bahan,
                sku: updatedbahanData.sku || existingbahan.sku,
                nama_bahan: updatedbahanData.nama_bahan || existingbahan.nama_bahan,
                stok: updatedbahanData.stok !== undefined ? parseInt(updatedbahanData.stok) : existingbahan.stok,
                harga_jual: updatedbahanData.harga_jual !== undefined ? parseFloat(updatedbahanData.harga_jual) : existingbahan.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "pembelian updated successfully", updatedbahan });
    } catch (error) {
        console.error('Error updating pembelian:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the pembelian exists, delete it
   await deletebahanById(parseInt(id))

    res.json({ message: "pembelian deleted successfully" });
  } catch (error) {
    console.error('Error deleting pembelian:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;