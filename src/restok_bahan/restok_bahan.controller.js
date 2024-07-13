
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
router.get("/",async (req,res) => {
    const restok_bahan =  await getRestokBahan();
    res.send(restok_bahan);
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
    
  
     
      res.send({
        
        data:restok_bahan,
        message:"RestokBahan berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating RestokBahan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedRestokBahanData = req.body;
     
      try {
          // Check if the restok_bahan exists before attempting to update it
        const restok_bahan = await updatedRestokBahan(parseInt(id),updatedRestokBahanData)
    
    res.send({data:restok_bahan, message: "restok_bahan updated successfully" });
} catch (error) {
    console.error('Error updating restok_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the restok_bahan exists, delete it
   await deleteRestokBahanById(parseInt(id))

    res.json({ message: "restok_bahan deleted successfully" });
  } catch (error) {
    console.error('Error deleting restok_bahan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;