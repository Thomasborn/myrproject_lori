
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getKaryawan,
  insertKaryawan,
  updatedKaryawan,
  getKaryawanById,
  createkaryawan,
  deleteKaryawanById,
  editkaryawanById,
} = require("./karyawan.service");

const router = express.Router();
router.get("/",async (req,res) => {
  const { q, posisi, status, gender, sortBy,  page = 1, itemsPerPage = 10 } = req.query;

  // Parse search criteria if provided
    const karyawan =  await getKaryawan(q, posisi, status, gender, sortBy,  parseInt(page), parseInt(itemsPerPage));
    res.send(karyawan);
 });


router.get("/:id", async (req, res) => {
    try {
      const karyawanId = parseInt(req.params.id);
      const karyawan = await getKaryawanById(parseInt(karyawanId));
  
      res.send(karyawan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  router.post("/", upload.none(), async (req, res) => {
    try {
      const newkaryawanData = req.body;
      const karyawan = await insertKaryawan(newkaryawanData);
  
      // Send a response with status code 201 (Created) and the created karyawan data
      res.status(201).json(karyawan);
    } catch (error) {
      console.error('Error creating karyawan:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedKaryawanData = req.body;
     
      try {
          // Check if the karyawan exists before attempting to update it
        const karyawan = await updatedKaryawan(parseInt(id),updatedKaryawanData)
    
    res.send(karyawan);
} catch (error) {
    console.error('Error updating karyawan:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await deleteKaryawanById(parseInt(id));
    if (deleteResult.success) {
      // If successful, respond with 204 status and success message
      res.json({ success: deleteResult.success, message: deleteResult.message }).status(deleteResult.status);
    } else {
      // If unsuccessful, respond with appropriate status and error message
      res.status(deleteResult.status).json(deleteResult); // Send error response
    }
  } catch (error) {
    // If error occurs, respond with 500 status and error message
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;