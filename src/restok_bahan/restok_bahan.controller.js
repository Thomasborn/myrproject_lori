
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getRestokBahan,
  insertRestokBahan,
  updatedRestokBahan,
  getRestokBahanById,
  deleteRestokBahanById,
} = require("./restok_bahan.service");

const router = express.Router();
router.get("/", async (req, res) => {
    const { bulanPesan, tahunPesan, bulanTerima, tahunTerima, status, itemsPerPage, page } = req.query;
    const queryParams = { bulanPesan, tahunPesan, bulanTerima, tahunTerima, status, itemsPerPage, page };
    
    const restok_bahan = await getRestokBahan(queryParams);
    
    res.json(restok_bahan);
 
});

router.get("/:id", async (req, res) => {
    try {
      const RestokBahanId = parseInt(req.params.id);
      const restok_bahan = await getRestokBahanById(parseInt(RestokBahanId));
  
      res.send(restok_bahan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  router.post("/", upload.none(), async (req, res) => {
    try {
      const newRestokBahanData = req.body;
      const restok_bahan = await insertRestokBahan(newRestokBahanData);
  
      res.send(restok_bahan);
    } catch (error) {
      console.error('Error creating RestokBahan:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedRestokBahanData = req.body;
     
      try {
          // Check if the restok_bahan exists before attempting to update it
        const restok_bahan = await updatedRestokBahan(parseInt(id),updatedRestokBahanData)

    res.send(restok_bahan);
} catch (error) {
    console.error('Error updating restok_bahan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteRestokBahanById(parseInt(id));
    return result;
  } catch (error) {
    console.error('Error deleting restok_bahan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;