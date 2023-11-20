
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getKustom,
  insertKustom,
  updatedKustom,
  getKustomById,
  deleteKustomById,
  insertDetailKustom,
} = require("./kustom.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const kustom =  await getKustom();
    res.send(kustom);
 });

router.get("/:id", async (req, res) => {
    try {
      const kustomId = parseInt(req.params.id);
      const kustom = await getKustomById(parseInt(kustomId));
  
      res.send(kustom);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router.get("/detail-kustom",async (req,res) => {
    const kustom =  await getKustom();
    res.send(kustom);
 });

router.get("/detail-kustom/:id", async (req, res) => {
    try {
      const kustomId = parseInt(req.params.id);
      const kustom = await getDetailkustomById(parseInt(kustomId));
  
      res.send(kustom);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  router.post("/detail-kustom", upload.none(), async (req, res) => {
    try {
    
        const newDetailkustomData = req.body;

        const detail_kustom = await insertDetailKustom(newDetailkustomData);
    
  
     
      res.send({
        
        data:detail_kustom,
        message:"detail kustom berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating kustom:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.patch("/detail-kustom/:id", upload.none(),async (req, res) => {
    const { id } = req.params;
    const updatedDetailkustomData = req.body;
   
    try {
        // Check if the kustom exists before attempting to update it
      const detailkustom = await updatedKustom(parseInt(id),updatedDetailkustomData)
  
  res.send({data:detailkustom, message: "kustom updated successfully" });
} catch (error) {
  console.error('Error updating kustom:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}});

router.delete("/detail-kustom/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the kustom exists, delete it
   await deleteDetailkustomById(parseInt(id))

    res.json({ message: "detail kustom deleted successfully" });
  } catch (error) {
    console.error('Error deleting kustom:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newkustomData = req.body;

        const kustom = await insertKustom(newkustomData);
    
  
     
      res.send({
        
        data:kustom,
        message:"kustom berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating kustom:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedKustomData = req.body;
     
      try {
          // Check if the kustom exists before attempting to update it
        const kustom = await updatedKustom(parseInt(id),updatedKustomData)
    
    res.send({data:kustom, message: "kustom updated successfully" });
} catch (error) {
    console.error('Error updating kustom:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the kustom exists, delete it
   await deleteKustomById(parseInt(id))

    res.json({ message: "kustom deleted successfully" });
  } catch (error) {
    console.error('Error deleting kustom:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;