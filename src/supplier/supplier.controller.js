
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getsuppliers,
  insertsupplier,
  updatedsupplier,
  getsupplierById,
  createsupplier,
  deletesupplierById,
  editsupplierById,
} = require("./supplier.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const supplier =  await getsuppliers();
    res.send(supplier);
 });

router.get("/:id", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const supplier = await getsupplierById(parseInt(supplierId));
  
      res.send(supplier);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newsupplierData = req.body;

        const supplier = await insertsupplier(newsupplierData);
    
  
     
      res.send({
        
        data:supplier,
        message:"supplier berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedsupplierData = req.body;
     
      try {
          // Check if the supplier exists before attempting to update it
        const supplier = await updatedsupplier(parseInt(id),updatedsupplierData)
    
    res.send({data:supplier, message: "supplier updated successfully" });
} catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the supplier exists, delete it
   await deletesupplierById(parseInt(id))

    res.json({ message: "supplier deleted successfully" });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;