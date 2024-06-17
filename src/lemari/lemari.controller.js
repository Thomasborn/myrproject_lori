
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
    const {q,page = 1, itemsPerPage = 10 } = req.query;

    // Call getLemari function with pagination parameters
    const lemari = await getLemari(q,parseInt(page), parseInt(itemsPerPage));

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
        success : lemari.success,
        message: lemari.message,
        data:lemari.data,
      });
    } catch (error) {
      console.error('Error creating Lemari:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedLemariData = req.body;
     
      try {
        const existlemari = await getLemariById(parseInt(id));
        if(!existlemari){
          res.send({success : false, message: "lemari dengan id: "+id+"tidak ditemukan"});
        }
          // Check if the lemari exists before attempting to update it
        const lemari = await updatedLemari(parseInt(id),updatedLemariData)
    
        res.send({
          success : lemari.success,
          message: lemari.message,
          data:lemari.data,
        });
} catch (error) {
    console.error('Error updating lemari:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
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
    const deleteLemari = await deleteLemariById(parseInt(id));

    // Send success response
    res.json(deleteLemari);
  } catch (error) {
    // Handle errors
    console.error('Error deleting lemari:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});



module.exports = router;