
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getstokBahan,
  insertstokBahan,
  updatedstokBahan,
  getstokBahanById,
  createstokBahan,
  deletestokBahanById,
  editstokBahanById,
} = require("./stok_bahan.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const stokBahan =  await getstokBahan();
    res.send(stokBahan);
 });

router.get("/:id", async (req, res) => {
    try {
      const stokBahanId = parseInt(req.params.id);
      const stokBahan = await getstokBahanById(parseInt(stokBahanId));
  
      res.send(stokBahan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newstokBahanData = req.body;

        const stokBahan = await insertstokBahan(newstokBahanData);
    
  
     
      res.send({
        
        data:stokBahan,
        message:"stokBahan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating stokBahan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedstokBahanData = req.body;
     
      try {
          // Check if the stokBahan exists before attempting to update it
        const stokBahan = await updatedstokBahan(parseInt(id),updatedstokBahanData)
    
    res.send({data:stokBahan, message: "stokBahan updated successfully" });
} catch (error) {
    console.error('Error updating stokBahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedstokBahanData = req.body;
    
    try {
        // Check if the stokBahan exists before attempting to update it
        const existingstokBahan = await prisma.stokBahan.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingstokBahan) {
            return res.status(404).json({ error: "stokBahan not found" });
        }
        
        // Validate and update the stokBahan data
        const updatedstokBahan = await prisma.stokBahan.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_stokBahan: updatedstokBahanData.kode_stokBahan || existingstokBahan.kode_stokBahan,
                sku: updatedstokBahanData.sku || existingstokBahan.sku,
                nama_stokBahan: updatedstokBahanData.nama_stokBahan || existingstokBahan.nama_stokBahan,
                stokBahan: updatedstokBahanData.stokBahan !== undefined ? parseInt(updatedstokBahanData.stokBahan) : existingstokBahan.stokBahan,
                harga_jual: updatedstokBahanData.harga_jual !== undefined ? parseFloat(updatedstokBahanData.harga_jual) : existingstokBahan.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "stokBahan updated successfully", updatedstokBahan });
    } catch (error) {
        console.error('Error updating stokBahan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the stokBahan exists, delete it
   await deletestokBahanById(parseInt(id))

    res.json({ message: "stokBahan deleted successfully" });
  } catch (error) {
    console.error('Error deleting stokBahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;