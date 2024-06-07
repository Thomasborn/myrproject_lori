
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getusers,
  insertuser,
  updateduser,
  getuserById,
  createuser,
  deleteuserById,
  edituserById,
} = require("./user.service");

const router = express.Router();
router.get("/",async (req,res) => {
  const { searchCriteria, page = 1, itemsPerPage = 10 } = req.query;

  // Parse search criteria if provided
  const parsedSearchCriteria = searchCriteria ? JSON.parse(searchCriteria) : {};
    const user =  await getusers(parsedSearchCriteria,parseInt(page),parseInt(itemsPerPage));
    res.send(user);
 });

 router.get("/profile", async (req, res) => {
  try {
    const userId = parseInt(req.session.user.id);
    const user = await getuserById(parseInt(userId));

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.get("/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await getuserById(parseInt(userId));
  
      res.send(user);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
router.post("/", upload.none(), async (req, res) => {
    try {
    
        const newuserData = req.body;

        const user = await insertuser(newuserData);
    
  
     
      res.send(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updateduserData = req.body;
     
      try {
          // Check if the user exists before attempting to update it
        const user = await updateduser(parseInt(id),updateduserData)
    
    res.send(user);
} catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the user exists, delete it
   const pengguna = await deleteuserById(parseInt(id))

    res.json(pengguna);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;