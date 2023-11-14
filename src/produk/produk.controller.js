
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getProduks,
  insertProduk,
  updatedProduk,
  getProdukById,
  createproduk,
  deleteprodukById,
  editprodukById,
} = require("./produk_item.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const produk_Item =  await getProduks();
    res.send(produk_Item);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const produk_Item = await getProdukById(parseInt(produkId));
  
      res.send(produk_Item);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newProdukData = req.body;

        const produk_Item = await insertProduk(newProdukData);
    
  
     
      res.send({
        
        data:produk_Item,
        message:"Produk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedProdukData = req.body;
     
      try {
          // Check if the produk_Item exists before attempting to update it
        const produk_Item = await updatedProduk(parseInt(id),updatedProdukData)
    
    res.send({data:produk_Item, message: "Produk_Item updated successfully" });
} catch (error) {
    console.error('Error updating produk_Item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.put("/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedProdukData = req.body;
    
    try {
        // Check if the produk_Item exists before attempting to update it
        const existingProduk = await prisma.produk_Item.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!existingProduk) {
            return res.status(404).json({ error: "Produk_Item not found" });
        }
        
        // Validate and update the Produk_Item data
        const updatedProduk = await prisma.produk_Item.update({
            where: { id: parseInt(id) },
            data: {
                // Update the field only if it's provided in the request body
                kode_produk: updatedProdukData.kode_produk || existingProduk.kode_produk,
                sku: updatedProdukData.sku || existingProduk.sku,
                nama_produk: updatedProdukData.nama_produk || existingProduk.nama_produk,
                stok: updatedProdukData.stok !== undefined ? parseInt(updatedProdukData.stok) : existingProduk.stok,
                harga_jual: updatedProdukData.harga_jual !== undefined ? parseFloat(updatedProdukData.harga_jual) : existingProduk.harga_jual,
                // ... other fields
            },
        });
        
        res.send({ message: "Produk_Item updated successfully", updatedProduk });
    } catch (error) {
        console.error('Error updating produk_Item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the produk_Item exists, delete it
   await deleteprodukById(parseInt(id))

    res.json({ message: "Produk_Item deleted successfully" });
  } catch (error) {
    console.error('Error deleting produk_Item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;