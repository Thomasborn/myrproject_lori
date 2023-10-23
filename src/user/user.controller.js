
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
    const user =  await getusers();
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
    
  
     
      res.send({
        
        data:user,
        message:"user berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updateduserData = req.body;
     
      try {
          // Check if the user exists before attempting to update it
        const user = await updateduser(parseInt(id),updateduserData)
    
    res.send({data:user, message: "user updated successfully" });
} catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    
    // If the user exists, delete it
   await deleteuserById(parseInt(id))

    res.json({ message: "user deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;