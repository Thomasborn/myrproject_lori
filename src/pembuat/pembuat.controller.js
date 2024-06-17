
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getProduks,
  insertProduk,
  updatedProduk,
  getProdukById,
  createproduk,
  deleteprodukById,
  editprodukById,
} = require("./pembuat.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const pembuat =  await getProduks();
    res.send(pembuat);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const pembuat = await getProdukById(parseInt(produkId));
  
      res.send(pembuat);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const pembuat = await insertProduk(newProdukData);
    
  
     
      res.send({
        
        data:pembuat,
        message:"Produk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedProdukData = req.body;
     
      try {
          // Check if the pembuat exists before attempting to update it
        const pembuat = await updatedProduk(parseInt(id),updatedProdukData)
    
    res.send({data:pembuat, message: "pembuat updated successfully" });
} catch (error) {
    console.error('Error updating pembuat:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the pembuat exists, delete it
   await deleteprodukById(parseInt(id))

    res.json({ message: "pembuat deleted successfully" });
  } catch (error) {
    console.error('Error deleting pembuat:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;