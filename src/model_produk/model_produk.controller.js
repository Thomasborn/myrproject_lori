
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const  { imageUpload, pdfUpload } = require("../middleware/upload-file");
const upload = multer();
const modelProdukService = require("./model_produk.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const model_produk =  await modelProdukService.getModelProduk();
    res.send(model_produk);
 });
router.get("/detail-model-produk",async (req,res) => {
    // res.send({message:"sahjbshaj"})
    const model_produk =  await modelProdukService.getAllModelProduk();
    res.send(model_produk);
 });

router.get("/:id", async (req, res) => {
    try {
      const produkId = parseInt(req.params.id);
      const model_produk = await modelProdukService.getModelProdukById(parseInt(produkId));
  
      res.send(model_produk);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", imageUpload, async (req, res) => {
    try {
      if (!req.files) {
        // No file was uploaded
        return res.status(400).json({ error: 'No image file provided' });
      }
      const newModelProdukData = {
        kode: req.body.kode,
        nama: req.body.nama,
        deskripsi: req.body.deskripsi,
        kategori_id: req.body.kategori_id,
        ukuran: req.body.ukuran,
        biaya_jahit: req.body.biaya_jahit,
        variasi: req.body.variasi,
        hpp: req.body.hpp,
        harga_jual: req.body.harga_jual,
        model_produk_id: req.body.model_produk_id,
        bahan_produk:  JSON.parse(req.body.bahan_produk),
        foto: req.files, 
      };
      
     
      
      if (newModelProdukData.bahan_produk) {
        // JSON parsing successful, do something with the parsed data
        const model_produk = await modelProdukService.insertModelProduk(newModelProdukData);
        res.send({
          
          data: model_produk,
          data1:newModelProdukData,
          message:"ModelProduk berhasil ditambah success"
        });
      } else {
        console.error('Invalid JSON input:', jsonString);
      }
    

     
    } catch (error) {
      console.error('Error creating ModelProduk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedModelProdukData = req.body;
     
      try {
          // Check if the model_ModelProduk exists before attempting to update it
        const model_produk = await modelProdukService.updatedModelProduk(parseInt(id),updatedModelProdukData)
    
    res.send({data:model_produk, message: "model_produk updated successfully" });
} catch (error) {
    console.error('Error updating model_produk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    const checkModel = await modelProdukService.getModelProdukById(id);
    if(checkModel)
    // If the model_produk exists, delete it
   await modelProdukService.deleteModelProdukById(parseInt(id))

    res.json({ message: "model_produk deleted successfully" });
  } catch (error) {
    console.error('Error deleting model_produk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;