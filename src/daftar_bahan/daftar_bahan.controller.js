
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getBahan,
  insertBahan,
  updatedBahan,
  getBahanById,
  deleteBahanById,

} = require("./daftar_bahan.service");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const { kategori, page = 1, pageSize = 10 } = req.query;

    // Fetch materials with category and pagination parameters
    const daftar_bahan = await getBahan(kategori, parseInt(page), parseInt(pageSize));

    res.send(daftar_bahan);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: error,
    });
  }
});


router.get("/:id", async (req, res) => {
    try {
      const bahanId = parseInt(req.params.id);
      const daftar_bahan = await getBahanById(parseInt(bahanId));
  
      res.send(daftar_bahan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newBahanData = req.body;

        const daftar_bahan = await insertBahan(newBahanData);
    
  
     
      res.send({
        
        data:daftar_bahan,
        message:"Bahan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating Bahan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedBahanData = req.body;
     
      try {
          // Check if the daftar_bahan exists before attempting to update it
        const daftar_bahan = await updatedBahan(parseInt(id),updatedBahanData)
    
    res.send({data:daftar_bahan, message: "daftar_bahan updated successfully" });
} catch (error) {
    console.error('Error updating daftar_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the daftar_bahan exists, delete it
   await deleteBahanById(parseInt(id))

    res.json({ message: "daftar_bahan deleted successfully" });
  } catch (error) {
    console.error('Error deleting daftar_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;