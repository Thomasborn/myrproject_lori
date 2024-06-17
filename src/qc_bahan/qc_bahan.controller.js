
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getQcBahan,
  insertQcBahan,
  updatedQcBahan,
  getQcBahanById,
  deleteQcBahanById,
} = require("./qc_bahan.service");

const router = express.Router();
// Route to get QC Bahan data
router.get("/", async (req, res) => {
  try {
    const queryParams = {
      bulanTemuan: req.query.bulanTemuan,
      tahunTemuan: req.query.tahunTemuan,
      bulanSelesai: req.query.bulanSelesai,
      tahunSelesai: req.query.tahunSelesai,
      status: req.query.status,
      itemsPerPage: parseInt(req.query.itemsPerPage) || 10,
      page: parseInt(req.query.page) || 1,
    };
    
    const qc_bahan = await getQcBahan(queryParams);
    res.send(qc_bahan);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching QC Bahan data" });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const qc_bahan = await getQcBahanById(parseInt(produkId));
  
      res.send(qc_bahan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const qc_bahan = await insertQcBahan(newProdukData);
    
  
     
      res.send(qc_bahan);
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedQcBahanData = req.body;
     
      try {
          // Check if the qc_bahan exists before attempting to update it
        const qc_bahan = await updatedQcBahan(parseInt(id),updatedQcBahanData)
    
    res.send(qc_bahan);
} catch (error) {
    console.error('Error updating qc_bahan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the qc_bahan exists, delete it
  const qc_bahan =  await deleteQcBahanById(parseInt(id))

    res.json(qc_bahan);
  } catch (error) {
    console.error('Error deleting qc_bahan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;