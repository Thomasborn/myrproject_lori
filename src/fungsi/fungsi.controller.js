
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getfungsis,
  insertfungsi,
  updatedfungsi,
  getfungsiById,
  createfungsi,
  deletefungsiById,
  editfungsiById,
} = require("./fungsi.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const fungsi =  await getfungsis();
    res.send(fungsi);
 });

 router.get("/profile", async (req, res) => {
  try {
    const fungsiId = parseInt(req.session.fungsi.id);
    const fungsi = await getfungsiById(parseInt(fungsiId));

    res.send(fungsi);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.get("/:id", async (req, res) => {
    try {
      const fungsiId = parseInt(req.params.id);
      const fungsi = await getfungsiById(parseInt(fungsiId));
  
      res.send(fungsi);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newfungsiData = req.body;

        const fungsi = await insertfungsi(newfungsiData);
    
  
     
      res.send({
        
        data:fungsi,
        message:"fungsi berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating fungsi:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedfungsiData = req.body;
     
      try {
          // Check if the fungsi exists before attempting to update it
        const fungsi = await updatedfungsi(parseInt(id),updatedfungsiData)
    
    res.send({data:fungsi, message: "fungsi updated successfully" });
} catch (error) {
    console.error('Error updating fungsi:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the fungsi exists, delete it
   await deletefungsiById(parseInt(id))

    res.json({ message: "fungsi deleted successfully" });
  } catch (error) {
    console.error('Error deleting fungsi:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;