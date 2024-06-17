
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  gethak_akses,
  inserthak_akses,
  updatedhak_akses,
  gethak_aksesById,
  createhak_akses,
  deletehak_aksesById,
  edithak_aksesById,
} = require("./hak_akses.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const hak_akses =  await gethak_akses();
    res.send(hak_akses);
 });

 router.get("/profile", async (req, res) => {
  try {
    const hak_aksesId = parseInt(req.session.hak_akses.id);
    const hak_akses = await gethak_aksesById(parseInt(hak_aksesId));

    res.send(hak_akses);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.get("/:id", async (req, res) => {
    try {
      const hak_aksesId = parseInt(req.params.id);
      const hak_akses = await gethak_aksesById(parseInt(hak_aksesId));
  
      res.send(hak_akses);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newhak_aksesData = req.body;

        const hak_akses = await inserthak_akses(newhak_aksesData);
    
  
     
      res.send({
        
        data:hak_akses,
        message:"hak_akses berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating hak_akses:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedhak_aksesData = req.body;
     
      try {
          // Check if the hak_akses exists before attempting to update it
        const hak_akses = await updatedhak_akses(parseInt(id),updatedhak_aksesData)
    
    res.send({data:hak_akses, message: "hak_akses updated successfully" });
} catch (error) {
    console.error('Error updating hak_akses:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the hak_akses exists, delete it
   await deletehak_aksesById(parseInt(id))

    res.json({ message: "hak_akses deleted successfully" });
  } catch (error) {
    console.error('Error deleting hak_akses:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;