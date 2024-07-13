
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getDiskon,
  insertDiskon,
  updateDiskon,
  getDiskonById,
  deleteDiskonById,
  insertDetailDiskon,
} = require("./diskon.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const diskon =  await getDiskon();
    res.send(diskon);
 });

router.get("/:id", async (req, res) => {
    try {
      const diskonId = parseInt(req.params.id);
      const diskon = await getDiskonById(parseInt(diskonId));
  
      res.send(diskon);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router.get("/detail-diskon",async (req,res) => {
    const diskon =  await getDiskon();
    res.send(diskon);
 });

router.get("/detail-diskon/:id", async (req, res) => {
    try {
      const diskonId = parseInt(req.params.id);
      const diskon = await getDetaildiskonById(parseInt(diskonId));
  
      res.send(diskon);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  router.post("/detail-diskon", upload.none(), async (req, res) => {
    try {
    
        const newDetaildiskonData = req.body;

        const detail_diskon = await insertDetailDiskon(newDetaildiskonData);
    
  
     
      res.send({
        
        data:detail_diskon,
        message:"detail diskon berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating diskon:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.patch("/detail-diskon/:id", upload.none(),async (req, res) => {
    const { id } = req.params;
    const updatedDetaildiskonData = req.body;
   
    try {
        // Check if the diskon exists before attempting to update it
      const detaildiskon = await updateDiskon(parseInt(id),updatedDetaildiskonData)
  
  res.send({data:detaildiskon, message: "diskon updated successfully" });
} catch (error) {
  console.error('Error updating diskon:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}});

router.delete("/detail-diskon/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the diskon exists, delete it
   await deleteDetaildiskonById(parseInt(id))

    res.json({ message: "detail diskon deleted successfully" });
  } catch (error) {
    console.error('Error deleting diskon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newdiskonData = req.body;

        const diskon = await insertDiskon(newdiskonData);
    
  
     
      res.send({
        
        data:diskon,
        message:"diskon berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating diskon:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updateDiskonData = req.body;
     
      try {
          // Check if the diskon exists before attempting to update it
        const diskon = await updateDiskon(parseInt(id),updateDiskonData)
    
    res.send({data:diskon, message: "diskon updated successfully" });
} catch (error) {
    console.error('Error updating diskon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the diskon exists, delete it
   await deleteDiskonById(parseInt(id))

    res.json({ message: "diskon deleted successfully" });
  } catch (error) {
    console.error('Error deleting diskon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;