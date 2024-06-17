
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getBahanStokOpnames,
  insertBahanStokOpname,
  updatedBahanStokOpname,
  getBahanStokOpnameById,
  deleteBahanStokOpnameById,
} = require("./bahan_stok_opname.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const bahan_stok_opname =  await getBahanStokOpnames();
    res.send(bahan_stok_opname);
 });

router.get("/:id", async (req, res) => {
    try {
      const BahanStokOpnameId = parseInt(req.params.id);
      const bahan_stok_opname = await getBahanStokOpnameById(parseInt(BahanStokOpnameId));
  
      res.send(bahan_stok_opname);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newBahanStokOpnameData = req.body;

        const bahan_stok_opname = await insertBahanStokOpname(newBahanStokOpnameData);
    
  
     
      res.send({
        
        data:bahan_stok_opname,
        message:"BahanStokOpname berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating BahanStokOpname:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedBahanStokOpnameData = req.body;
     
      try {
          // Check if the bahan_stok_opname exists before attempting to update it
        const bahan_stok_opname = await updatedBahanStokOpname(parseInt(id),updatedBahanStokOpnameData)
    
    res.send({data:bahan_stok_opname, message: "bahan_stok_opname updated successfully" });
} catch (error) {
    console.error('Error updating bahan_stok_opname:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the bahan_stok_opname exists, delete it
   await deleteBahanStokOpnameById(parseInt(id))

    res.json({ message: "bahan_stok_opname deleted successfully" });
  } catch (error) {
    console.error('Error deleting bahan_stok_opname:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;