
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getOutlet,
  insertoutlet,
  updatedoutlet,
  getoutletById,
  createoutlet,
  deleteoutletById,
  editoutletById,
} = require("./outlet.service");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    // Extract query parameters for search criteria, page number, and page size
    const { q, page = 1, itemsPerPage = 10 } = req.query;

    // Fetch outlets data based on provided search criteria, page number, and page size
    const outlet = await getOutlet(q, parseInt(page), parseInt(itemsPerPage));

    // Send the response
    res.send(outlet);
  } catch (error) {
    // Handle errors
    console.error("Error fetching outlets:", error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});


router.get("/:id", async (req, res) => {
    try {
      const outletId = parseInt(req.params.id);
      const outlet = await getoutletById(parseInt(outletId));
  
      res.send(outlet);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newoutletData = req.body;

        const outlet = await insertoutlet(newoutletData);
    
  
     
      res.send(outlet);
    } catch (error) {
      console.error('Error creating outlet:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedoutletData = req.body;
     
      try {
          // Check if the outlet exists before attempting to update it
        const outlet = await updatedoutlet(parseInt(id),updatedoutletData)
    
    res.send(outlet);
} catch (error) {
    console.error('Error updating outlet:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the outlet exists, delete it
   const outlet=await deleteoutletById(parseInt(id))

    res.send(outlet);
  } catch (error) {
    console.error('Error deleting outlet:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;