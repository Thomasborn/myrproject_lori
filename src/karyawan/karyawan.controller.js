
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getkaryawans,
  insertkaryawan,
  updatedkaryawan,
  getkaryawanById,
  createkaryawan,
  deletekaryawanById,
  editkaryawanById,
} = require("./karyawan.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const karyawan =  await getkaryawans();
    res.send(karyawan);
 });

 router.get("/profile", async (req, res) => {
  try {
    const karyawanId = parseInt(req.session.karyawan.id);
    const karyawan = await getkaryawanById(parseInt(karyawanId));

    res.send(karyawan);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.get("/:id", async (req, res) => {
    try {
      const karyawanId = parseInt(req.params.id);
      const karyawan = await getkaryawanById(parseInt(karyawanId));
  
      res.send(karyawan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newkaryawanData = req.body;

        const karyawan = await insertkaryawan(newkaryawanData);
    
  
     
      res.send({
        
        data:karyawan,
        message:"karyawan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating karyawan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedkaryawanData = req.body;
     
      try {
          // Check if the karyawan exists before attempting to update it
        const karyawan = await updatedkaryawan(parseInt(id),updatedkaryawanData)
    
    res.send({data:karyawan, message: "karyawan updated successfully" });
} catch (error) {
    console.error('Error updating karyawan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the karyawan exists, delete it
   await deletekaryawanById(parseInt(id))

    res.json({ message: "karyawan deleted successfully" });
  } catch (error) {
    console.error('Error deleting karyawan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;