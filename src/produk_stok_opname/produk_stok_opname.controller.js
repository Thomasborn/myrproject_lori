
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getProdukStokOpnames,
  insertProdukStokOpname,
  updatedProdukStokOpname,
  getProdukStokOpnameById,
  deleteProdukStokOpnameById,
} = require("./produk_stok_opname.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const produk_stok_opname =  await getProdukStokOpnames();
    res.send(produk_stok_opname);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkStokOpnameId = parseInt(req.params.id);
      const produk_stok_opname = await getProdukStokOpnameById(parseInt(produkStokOpnameId));
  
      res.send(produk_stok_opname);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukStokOpnameData = req.body;

        const produk_stok_opname = await insertProdukStokOpname(newProdukStokOpnameData);
    
  
     
      res.send({
        
        data:produk_stok_opname,
        message:"ProdukStokOpname berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating ProdukStokOpname:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedProdukStokOpnameData = req.body;
     
      try {
          // Check if the produk_stok_opname exists before attempting to update it
        const produk_stok_opname = await updatedProdukStokOpname(parseInt(id),updatedProdukStokOpnameData)
    
    res.send({data:produk_stok_opname, message: "produk_stok_opname updated successfully" });
} catch (error) {
    console.error('Error updating produk_stok_opname:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the produk_stok_opname exists, delete it
   await deleteProdukStokOpnameById(parseInt(id))

    res.json({ message: "produk_stok_opname deleted successfully" });
  } catch (error) {
    console.error('Error deleting produk_stok_opname:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;