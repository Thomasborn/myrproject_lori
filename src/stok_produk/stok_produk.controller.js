
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getStokProduk,
  insertStokProduk,
  updatedStokProduk,
  getStokProdukById,
  deleteStokProdukById,
  editstokProdukById,
} = require("./stok_produk.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const stokProduk =  await getStokProduk();
    res.send(stokProduk);
 });

router.get("/:id", async (req, res) => {
    try {
      const stokProdukId = parseInt(req.params.id);
      const stokProduk = await getStokProdukById(parseInt(stokProdukId));
  
      res.send(stokProduk);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newstokProdukData = req.body;

        const stokProduk = await insertStokProduk(newstokProdukData);
    
  
     
      res.send({
        
        data:stokProduk,
        message:"stokProduk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating stokProduk:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedStokProdukData = req.body;
     
      try {
          // Check if the stokProduk exists before attempting to update it
        const stokProduk = await updatedStokProduk(parseInt(id),updatedStokProdukData)
    
    res.send({data:stokProduk, message: "stokProduk updated successfully" });
} catch (error) {
    console.error('Error updating stokProduk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedStokProdukData = req.body;
    
    try {
        // Check if the stokProduk exists before attempting to update it
        const existingstokProduk = await prisma.stokProduk.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingstokProduk) {
            return res.status(404).json({ error: "stokProduk not found" });
        }
        
        // Validate and update the stokProduk data
        const updatedStokProduk = await prisma.stokProduk.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_stokProduk: updatedStokProdukData.kode_stokProduk || existingstokProduk.kode_stokProduk,
                sku: updatedStokProdukData.sku || existingstokProduk.sku,
                nama_stokProduk: updatedStokProdukData.nama_stokProduk || existingstokProduk.nama_stokProduk,
                stokProduk: updatedStokProdukData.stokProduk !== undefined ? parseInt(updatedStokProdukData.stokProduk) : existingstokProduk.stokProduk,
                harga_jual: updatedStokProdukData.harga_jual !== undefined ? parseFloat(updatedStokProdukData.harga_jual) : existingstokProduk.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "stokProduk updated successfully", updatedStokProduk });
    } catch (error) {
        console.error('Error updating stokProduk:', error);
        res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the stokProduk exists, delete it
   await deleteStokProdukById(parseInt(id))

    res.json({ message: "stokProduk deleted successfully" });
  } catch (error) {
    console.error('Error deleting stokProduk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;