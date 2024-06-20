
const express = require("express");
const prisma = require("../db");
const multer = require("multer");
const upload = multer();
const { getLaporanPenjualan,exportLaporanPenjualan } = require("./laporan.service");

const router = express.Router();
router.get("/", async (req, res) => {
    const query = req.query;
    const laporanPenjualan = await getLaporanPenjualan(query);
    res.send(laporanPenjualan);
});
router.get("/export", async (req, res) => {
  const query = req.query;
  const laporanPenjualan = await exportLaporanPenjualan(query);
  res.send(laporanPenjualan);
});
module.exports = router;
