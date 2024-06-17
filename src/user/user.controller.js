
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const {
  getUsers,
  insertUser,
  updatedUser,
  getUserById,
  createuser,
  deleteUserById,
  edituserById,
} = require("./user.service");

const router = express.Router();
router.get("/",async (req,res) => {
  const { q, role, status, page, itemsPerPage} = req.query;


    const user =  await getUsers(q,role,status,parseInt(page),parseInt(itemsPerPage));
    res.send(user);
 });

 router.get("/profile", async (req, res) => {
  try {
    const userId = parseInt(req.session.user.id);
    const user = await getUserById(parseInt(userId));

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.get("/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await getUserById(parseInt(userId));
  
      res.send(user);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  router.post("/", upload.none(), async (req, res) => {
    try {
      const newuserData = req.body;
      const user = await insertUser(newuserData);
  
      // Send a response with status code 201 (Created) and the created user data
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
    }
  });
  
  router.put("/:id", upload.none(),async (req, res) => {
      const { id } = req.params;
      const updatedUserData = req.body;
     
      try {
          // Check if the user exists before attempting to update it
        const user = await updatedUser(parseInt(id),updatedUserData)
    
    res.send(user);
} catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
}
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Attempt to delete the user
    const deleteResult = await deleteUserById(parseInt(id));

    if (deleteResult.success) {
      // If successful, respond with 204 No Content
      res.json({ success: true, message: deleteResult.message }).status(deleteResult.status);
    } else {
      // If the user was not found, respond with 404 Not Found
      res.status(404).json({ success: false, message: deleteResult.message });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi' });
  }
});

module.exports = router;