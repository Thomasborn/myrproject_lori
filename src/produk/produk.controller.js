
const express = require("express");
const prisma = require("../db");
const  { imageUpload, pdfUpload, imageSingleUpload } = require("../middleware/upload-file");
const multer = require("multer");
const upload = multer();
const {
  getDaftarProduk,
  insertDaftarProduk,
  updatedDaftarProduk,
  getDaftarProdukById,
  deleteDaftarProdukById,
} = require("./produk.service");

const router = express.Router();
router.get("/", async (req, res) => {

    // Extracting query parameters for search and pagination
    const { q, outletId,kategori, page = 1, itemsPerPage = 10 } = req.query;

    // Fetching data based on search criteria and pagination
    const result = await getDaftarProduk(q, kategori,parseInt(outletId), parseInt(page, 10), parseInt(itemsPerPage, 10));

    res.send(result);
console.log(result)
  } 
);


router.get("/:id", async (req, res) => {
  try {
    const produkId = parseInt(req.params.id, 10);
    if (isNaN(produkId)) {
      return res.status(400).send({ 
        success: false, 
        message: "ID Produk tidak valid", 
        data: null 
      });
    }

    const produk = await getDaftarProdukById(produkId);
    res.send(produk);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send({
      success: false,
      message: 'Terjadi kesalahan di server',
      data: null
    });
  }
});
router.post("/", imageUpload, async (req, res) => {
  try {
    // Handle file upload if imageUpload middleware is used
    const foto = req.files && req.files.length > 0 ? req.files : null;

    // Extract and parse data from req.body
    const data = {
      deskripsi: req.body.deskripsi,
      kategori: req.body.kategori,
      nama: req.body.nama,
      varian: req.body.varian, // No need to parse varian as it should be JSON object already
      bahan: req.body.bahan,   // No need to parse bahan as it should be JSON object already
      foto: foto,  // Attach foto to data
    };

    // Call your function to insert produk data
    const produk = await insertDaftarProduk(data);

    res.json(produk); // Send the inserted produk data as JSON response
  } catch (error) {
    console.error('Error creating produk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});
  router.put("/:id", upload.none(),async (req, res) => {
    
     
      try {
        const { id } = req.params;
        // Handle file upload if imageUpload middleware is used
        const foto = req.files && req.files.length > 0 ? req.files : null;

        // Extract and parse data from req.body
        const updatedDaftarProdukData = {
          deskripsi: req.body.deskripsi,
          kategori: req.body.kategori,
          nama: req.body.nama,
          varian: req.body.varian, // No need to parse varian as it should be JSON object already
          bahan: req.body.bahan,   // No need to parse bahan as it should be JSON object already
          foto: foto,  // Attach foto to data
        };
          // Check if the produk exists before attempting to update it
        const produk = await updatedDaftarProduk(parseInt(id),updatedDaftarProdukData)
    
    res.send(produk);
} catch (error) {
    console.error('Error updating produk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the produk exists, delete it
   const produk = await deleteDaftarProdukById(parseInt(id))

    res.send(produk);
  } catch (error) {
    console.error('Error deleting produk:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;