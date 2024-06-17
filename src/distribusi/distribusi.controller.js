const express = require("express");
const router = express.Router();
const distribusiService = require("./distribusi.service");

// GET all distribusi
router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const distribusi = await distribusiService.findDistribusi(filters);
    res.status(200).json(distribusi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET distribusi by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const distribusi = await distribusiService.getDistribusiById(parseInt(id));
    if (!distribusi) {
      return res.status(404).json({ error: "Distribusi not found" });
    }
    res.status(200).json(distribusi);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error)
  }
});

// POST new distribusi
router.post("/", async (req, res) => {
  try {
    const newDistribusiData = req.body;
    const distribusi = await distribusiService.insertDistribusi(newDistribusiData);
    res.status(201).json(distribusi);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error)
  }
});

// PUT (update) distribusi
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDistribusiData = req.body;
    const distribusi = await distribusiService.updateDistribusi(parseInt(id), updatedDistribusiData);
    res.status(200).json(distribusi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE distribusi
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await distribusiService.deleteDistribusiById(parseInt(id));
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
