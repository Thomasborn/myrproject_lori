
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getPenjualan,
  insertPenjualan,
  updatePenjualan,
  getPenjualanById,
  getDetailPenjualanById,
  deletePenjualanById,
  insertDetailPenjualan,
  getDetailPenjualan,
} = require("./penjualan.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const penjualan =  await getPenjualan();
    res.send(penjualan);
 });

router.get("/:id", async (req, res) => {
    try {
      const penjualanId = parseInt(req.params.id);
      const penjualan = await getPenjualanById(parseInt(penjualanId));
  
      res.send(penjualan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router.get("/detail-penjualan",async (req,res) => {
    const penjualan =  await getDetailPenjualan();
    res.send(penjualan);
 });

router.get("/detail-penjualan/:id", async (req, res) => {
    try {
      const penjualanId = parseInt(req.params.id);
      const penjualan = await getDetailPenjualanById(parseInt(penjualanId));
  
      res.send(penjualan);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  router.post("/detail-penjualan", upload.none(), async (req, res) => {
    try {
    
        const newDetailpenjualanData = req.body;

        const detail_penjualan = await insertDetailPenjualan(newDetailpenjualanData);
    
  
     
      res.send({
        
        data:detail_penjualan,
        message:"detail penjualan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating penjualan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.patch("/detail-penjualan/:id", upload.none(),async (req, res) => {
    const { id } = req.params;
    const updatedDetailpenjualanData = req.body;
   
    try {
        // Check if the penjualan exists before attempting to update it
      const detailpenjualan = await updatePenjualan(parseInt(id),updatedDetailpenjualanData)
  
  res.send({data:detailpenjualan, message: "penjualan updated successfully" });
} catch (error) {
  console.error('Error updating penjualan:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}});

router.delete("/detail-penjualan/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the penjualan exists, delete it
   await deleteDetailpenjualanById(parseInt(id))

    res.json({ message: "detail penjualan deleted successfully" });
  } catch (error) {
    console.error('Error deleting penjualan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newpenjualanData = req.body;

        const penjualan = await insertPenjualan(newpenjualanData);
    
  
     
      res.send({
        
        data:penjualan,
        message:"penjualan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating penjualan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatePenjualanData = req.body;
     
      try {
          // Check if the penjualan exists before attempting to update it
        const penjualan = await updatePenjualan(parseInt(id),updatePenjualanData)
    
    res.send({data:penjualan, message: "penjualan updated successfully" });
} catch (error) {
    console.error('Error updating penjualan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the penjualan exists, delete it
   await deletePenjualanById(parseInt(id))

    res.json({ message: "penjualan deleted successfully" });
  } catch (error) {
    console.error('Error deleting penjualan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;