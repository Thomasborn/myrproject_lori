
const express = require("express");
const prisma = require("../db");
const  { imageUpload, pdfUpload, imageSingleUpload } = require("../middleware/upload-file");
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
    const { kategori, page = 1, itemsPerPage = 10 } = req.query;

    // Fetch materials with category and pagination parameters
    const daftar_bahan = await getBahan(kategori, parseInt(page), parseInt(itemsPerPage));

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
router.post("/", imageSingleUpload, async (req, res) => {
    try {
    
        const newBahanData = req.body;
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        const file = req.file;

        const daftar_bahan = await insertBahan(newBahanData,file);
    
  
     
      res.send(
        daftar_bahan
    );
    } catch (error) {
      console.error('Error creating Bahan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.put("/:id", imageSingleUpload,async (req, res) => {
      const { id } = req.params;
      const updatedBahanData = req.body;
      const file = req.file;
     
      try {
          // Check if the daftar_bahan exists before attempting to update it
        const daftar_bahan = await updatedBahan(parseInt(id),updatedBahanData,file)
    
    res.send(daftar_bahan);
} catch (error) {
    console.error('Error updating daftar_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the daftar_bahan exists, delete it
   const bahan = await deleteBahanById(parseInt(id))

    res.send(bahan);
  } catch (error) {
    console.error('Error deleting daftar_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;