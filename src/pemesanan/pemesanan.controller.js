
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
} = require("./pemesanan.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const pemesanan =  await getbahans();
    res.send(pemesanan);
 });

router.get("/:id", async (req, res) => {
    try {
      const bahanId = parseInt(req.params.id);
      const pemesanan = await getbahanById(parseInt(bahanId));
  
      res.send(pemesanan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newbahanData = req.body;

        const pemesanan = await insertbahan(newbahanData);
    
  
     
      res.send({
        
        data:pemesanan,
        message:"bahan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating bahan:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedbahanData = req.body;
     
      try {
          // Check if the pemesanan exists before attempting to update it
        const pemesanan = await updatedbahan(parseInt(id),updatedbahanData)
    
    res.send({data:pemesanan, message: "pemesanan updated successfully" });
} catch (error) {
    console.error('Error updating pemesanan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedbahanData = req.body;
    
    try {
        // Check if the pemesanan exists before attempting to update it
        const existingbahan = await prisma.pemesanan.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingbahan) {
            return res.status(404).json({ error: "pemesanan not found" });
        }
        
        // Validate and update the pemesanan data
        const updatedbahan = await prisma.pemesanan.update({
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
        
        res.send({ message: "pemesanan updated successfully", updatedbahan });
    } catch (error) {
        console.error('Error updating pemesanan:', error);
        res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the pemesanan exists, delete it
   await deletebahanById(parseInt(id))

    res.json({ message: "pemesanan deleted successfully" });
  } catch (error) {
    console.error('Error deleting pemesanan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;