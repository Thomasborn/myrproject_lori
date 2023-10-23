
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getstoks,
  insertstok,
  updatedstok,
  getstokById,
  createstok,
  deletestokById,
  editstokById,
} = require("./stok.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const stok =  await getstoks();
    res.send(stok);
 });

router.get("/:id", async (req, res) => {
    try {
      const stokId = parseInt(req.params.id);
      const stok = await getstokById(parseInt(stokId));
  
      res.send(stok);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newstokData = req.body;

        const stok = await insertstok(newstokData);
    
  
     
      res.send({
        
        data:stok,
        message:"stok berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating stok:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedstokData = req.body;
     
      try {
          // Check if the stok exists before attempting to update it
        const stok = await updatedstok(parseInt(id),updatedstokData)
    
    res.send({data:stok, message: "stok updated successfully" });
} catch (error) {
    console.error('Error updating stok:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedstokData = req.body;
    
    try {
        // Check if the stok exists before attempting to update it
        const existingstok = await prisma.stok.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingstok) {
            return res.status(404).json({ error: "stok not found" });
        }
        
        // Validate and update the stok data
        const updatedstok = await prisma.stok.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_stok: updatedstokData.kode_stok || existingstok.kode_stok,
                sku: updatedstokData.sku || existingstok.sku,
                nama_stok: updatedstokData.nama_stok || existingstok.nama_stok,
                stok: updatedstokData.stok !== undefined ? parseInt(updatedstokData.stok) : existingstok.stok,
                harga_jual: updatedstokData.harga_jual !== undefined ? parseFloat(updatedstokData.harga_jual) : existingstok.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "stok updated successfully", updatedstok });
    } catch (error) {
        console.error('Error updating stok:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the stok exists, delete it
   await deletestokById(parseInt(id))

    res.json({ message: "stok deleted successfully" });
  } catch (error) {
    console.error('Error deleting stok:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;