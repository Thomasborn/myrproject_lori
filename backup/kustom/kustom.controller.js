
const express = require("express");
const prisma = require("../../src/db");
const multer = require("multer");
const upload = multer();
const {
  getKustom,
  insertKustom,
  updatedKustom,
  getKustomById,
  createKustom,
  deleteKustomById,
  editKustomById,
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
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newKustomData = req.body;

        const kustom = await insertKustom(newKustomData);
    
  
     
      res.send({
        
        data:kustom,
        message:"Kustom berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating Kustom:', error);
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