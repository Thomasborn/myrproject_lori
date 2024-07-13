
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getDashboard,
  insertDashboard,
  updatedDashboard,
  getDashboardById,
  deleteDashboardById,
} = require("./dashboard.service");

const router = express.Router();
router.get("/",async (req,res) => {
    const dashboard =  await getDashboard();
    res.send(dashboard);
 });

router.get("/:id", async (req, res) => {
    try {
      const DashboardId = parseInt(req.params.id);
      const dashboard = await getDashboardById(parseInt(DashboardId));
  
      res.send(dashboard);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newDashboardData = req.body;

        const dashboard = await insertDashboard(newDashboardData);
    
  
     
      res.send({
        
        data:dashboard,
        message:"Dashboard berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating Dashboard:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedDashboardData = req.body;
     
      try {
          // Check if the dashboard exists before attempting to update it
        const dashboard = await updatedDashboard(parseInt(id),updatedDashboardData)
    
    res.send({data:dashboard, message: "dashboard updated successfully" });
} catch (error) {
    console.error('Error updating dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the dashboard exists, delete it
   await deleteDashboardById(parseInt(id))

    res.json({ message: "dashboard deleted successfully" });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;