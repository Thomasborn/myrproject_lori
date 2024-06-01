
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
const { findLemariById } = require("./lemari.repository");

const router = express.Router();
router.get("/", async (req, res) => {
    // Extract pagination parameters from the request query
    const { kode,page = 1, pageSize = 10 } = req.query;

    // Call getLemari function with pagination parameters
    const lemari = await getLemari(kode,parseInt(page), parseInt(pageSize));

    // Send the response
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
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedLemariData = req.body;
     
      try {
        const existlemari = await getLemariById(parseInt(id));
        if(!existlemari){
          res.send({success : false, message: "lemari dengan id: "+id+"tidak ditemukan",data:null });
        }
          // Check if the lemari exists before attempting to update it
        const lemari = await updatedLemari(parseInt(id),updatedLemariData)
    
    res.send({success : true, message: "lemari updated successfully",data:lemari });
} catch (error) {
    console.error('Error updating lemari:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the lemari exists
    const lemari = await findLemariById(parseInt(id));
    
    // If the lemari doesn't exist, send a 404 response
    if (!lemari) {
      return res.status(404).json({ error: 'Lemari not found' });
    }

    // If the lemari exists, delete it
    await deleteLemariById(parseInt(id));

    // Send success response
    res.json({ message: "Lemari id: "+id+" deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error('Error deleting lemari:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;