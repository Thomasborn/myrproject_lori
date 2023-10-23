
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getoutlets,
  insertoutlet,
  updatedoutlet,
  getoutletById,
  createoutlet,
  deleteoutletById,
  editoutletById,
} = require("./outlet.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const outlet =  await getoutlets();
    res.send(outlet);
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
    
  
     
      res.send({
        
        data:outlet,
        message:"outlet berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating outlet:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedoutletData = req.body;
     
      try {
          // Check if the outlet exists before attempting to update it
        const outlet = await updatedoutlet(parseInt(id),updatedoutletData)
    
    res.send({data:outlet, message: "outlet updated successfully" });
} catch (error) {
    console.error('Error updating outlet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the outlet exists, delete it
   await deleteoutletById(parseInt(id))

    res.json({ message: "outlet deleted successfully" });
  } catch (error) {
    console.error('Error deleting outlet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;