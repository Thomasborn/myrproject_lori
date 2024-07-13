
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
  const { q, page = 1, itemsPerPage = 10 } = req.query;

  // Parse searchCriteria if provided
  const parsedSearchCriteria = q;

    const supplier =  await getsuppliers(parsedSearchCriteria,parseInt(page),parseInt(itemsPerPage));
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
    
  
     
      res.send(supplier);
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedsupplierData = req.body;
     
      try {
          // Check if the supplier exists before attempting to update it
        const supplier = await updatedsupplier(parseInt(id),updatedsupplierData)
    
    res.send(supplier);
} catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the supplier exists, delete it
  const supplier = await deletesupplierById(parseInt(id))

    res.send(supplier);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;