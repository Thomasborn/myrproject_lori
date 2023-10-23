
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
} = require("./kategori_produk.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const kategori_produk =  await getProduks();
    res.send(kategori_produk);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const kategori_produk = await getProdukById(parseInt(produkId));
  
      res.send(kategori_produk);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const kategori_produk = await insertProduk(newProdukData);
    
  
     
      res.send({
        
        data:kategori_produk,
        message:"Produk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedProdukData = req.body;
     
      try {
          // Check if the kategori_produk exists before attempting to update it
        const kategori_produk = await updatedProduk(parseInt(id),updatedProdukData)
    
    res.send({data:kategori_produk, message: "kategori_produk updated successfully" });
} catch (error) {
    console.error('Error updating kategori_produk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the kategori_produk exists, delete it
   await deleteprodukById(parseInt(id))

    res.json({ message: "kategori_produk deleted successfully" });
  } catch (error) {
    console.error('Error deleting kategori_produk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;