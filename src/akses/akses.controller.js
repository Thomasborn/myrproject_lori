
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getaksess,
  insertakses,
  updatedakses,
  getaksesById,
  createakses,
  deleteaksesById,
  editaksesById,
} = require("./aksi.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const akses =  await getaksess();
    res.send(akses);
 });

 router.get("/profile", async (req, res) => {
  try {
    const aksesId = parseInt(req.session.akses.id);
    const akses = await getaksesById(parseInt(aksesId));

    res.send(akses);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.get("/:id", async (req, res) => {
    try {
      const aksesId = parseInt(req.params.id);
      const akses = await getaksesById(parseInt(aksesId));
  
      res.send(akses);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newaksesData = req.body;

        const akses = await insertakses(newaksesData);
    
  
     
      res.send({
        
        data:akses,
        message:"akses berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating akses:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedaksesData = req.body;
     
      try {
          // Check if the akses exists before attempting to update it
        const akses = await updatedakses(parseInt(id),updatedaksesData)
    
    res.send({data:akses, message: "akses updated successfully" });
} catch (error) {
    console.error('Error updating akses:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the akses exists, delete it
   await deleteaksesById(parseInt(id))

    res.json({ message: "akses deleted successfully" });
  } catch (error) {
    console.error('Error deleting akses:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;