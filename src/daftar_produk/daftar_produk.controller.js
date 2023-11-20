
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getDaftarProduk,
  insertDaftarProduk,
  updatedDaftarProduk,
  getDaftarProdukById,
  deleteDaftarProdukById,
} = require("./daftar_produk.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const daftar_produk =  await getDaftarProduk();
    res.send(daftar_produk);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const daftar_produk = await getDaftarProdukById(parseInt(produkId));
  
      res.send(daftar_produk);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const {sku,detail_model_produk_id} = req.body;

        const daftar_produk = await insertDaftarProduk(sku,detail_model_produk_id);
    
  
     
      res.send({
        
        data:daftar_produk,
        message:"Produk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedDaftarProdukData = req.body;
     
      try {
          // Check if the daftar_produk exists before attempting to update it
        const daftar_produk = await updatedDaftarProduk(parseInt(id),updatedDaftarProdukData)
    
    res.send({data:daftar_produk, message: "daftar_produk updated successfully" });
} catch (error) {
    console.error('Error updating daftar_produk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the daftar_produk exists, delete it
   await deleteDaftarProdukById(parseInt(id))

    res.json({ message: "daftar_produk deleted successfully" });
  } catch (error) {
    console.error('Error deleting daftar_produk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;