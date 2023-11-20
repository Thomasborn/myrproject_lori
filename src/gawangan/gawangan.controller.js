
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getGawangan,
  insertgawangan,
  updatedgawangan,
  getgawanganById,
  deletegawanganById,
  insertDetailGawangan,
} = require("./gawangan.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const gawangan =  await getGawangan();
    res.send(gawangan);
 });

router.get("/:id", async (req, res) => {
    try {
      const gawanganId = parseInt(req.params.id);
      const gawangan = await getgawanganById(parseInt(gawanganId));
  
      res.send(gawangan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router.get("/detail-gawangan",async (req,res) => {
    const gawangan =  await getgawangans();
    res.send(gawangan);
 });

router.get("/detail-gawangan/:id", async (req, res) => {
    try {
      const gawanganId = parseInt(req.params.id);
      const gawangan = await getDetailGawanganById(parseInt(gawanganId));
  
      res.send(gawangan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  router.post("/detail-gawangan", upload.none(), async (req, res) => {
    try {
    
        const newDetailGawanganData = req.body;

        const detail_gawangan = await insertDetailGawangan(newDetailGawanganData);
    
  
     
      res.send({
        
        data:detail_gawangan,
        message:"detail gawangan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating gawangan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.patch("/detail-gawangan/:id", upload.none(),async (req, res) => {
    const { id } = req.params;
    const updatedDetailGawanganData = req.body;
   
    try {
        // Check if the gawangan exists before attempting to update it
      const detailGawangan = await updatedgawangan(parseInt(id),updatedDetailGawanganData)
  
  res.send({data:detailGawangan, message: "gawangan updated successfully" });
} catch (error) {
  console.error('Error updating gawangan:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}});

router.delete("/detail-gawangan/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the gawangan exists, delete it
   await deleteDetailGawanganById(parseInt(id))

    res.json({ message: "detail gawangan deleted successfully" });
  } catch (error) {
    console.error('Error deleting gawangan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newgawanganData = req.body;

        const gawangan = await insertgawangan(newgawanganData);
    
  
     
      res.send({
        
        data:gawangan,
        message:"gawangan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating gawangan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedgawanganData = req.body;
     
      try {
          // Check if the gawangan exists before attempting to update it
        const gawangan = await updatedgawangan(parseInt(id),updatedgawanganData)
    
    res.send({data:gawangan, message: "gawangan updated successfully" });
} catch (error) {
    console.error('Error updating gawangan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the gawangan exists, delete it
   await deletegawanganById(parseInt(id))

    res.json({ message: "gawangan deleted successfully" });
  } catch (error) {
    console.error('Error deleting gawangan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;