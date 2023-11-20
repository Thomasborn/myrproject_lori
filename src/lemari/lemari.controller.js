
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getLemari,
  insertLemari,
  updatedLemari,
  getLemariById,
  deleteLemariById,
} = require("./lemari.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const lemari =  await getLemari();
    res.send(lemari);
 });

router.get("/:id", async (req, res) => {
    try {
      const LemariId = parseInt(req.params.id);
      const lemari = await getLemariById(parseInt(LemariId));
  
      res.send(lemari);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newLemariData = req.body;

        const lemari = await insertLemari(newLemariData);
    
  
     
      res.send({
        
        data:lemari,
        message:"Lemari berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating Lemari:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedLemariData = req.body;
     
      try {
          // Check if the lemari exists before attempting to update it
        const lemari = await updatedLemari(parseInt(id),updatedLemariData)
    
    res.send({data:lemari, message: "lemari updated successfully" });
} catch (error) {
    console.error('Error updating lemari:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the lemari exists, delete it
   await deleteLemariById(parseInt(id))

    res.json({ message: "lemari deleted successfully" });
  } catch (error) {
    console.error('Error deleting lemari:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;