
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
// const express = require("express");
// const prisma = require("../db");
// const multer = require("multer");
// const upload = multer();
// const { getLaporanPenjualan, exportLaporanPenjualan } = require("./laporan.service");

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const query = req.query;
//     const laporanPenjualan = await getLaporanPenjualan(query);
//     res.send(laporanPenjualan);
//   } catch (error) {
//     console.error("Error fetching laporan penjualan:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/export", async (req, res) => {
//   try {
//     const query = req.query;
//     const laporanPenjualan = await exportLaporanPenjualan(query);
//     res.send(laporanPenjualan);
//   } catch (error) {
//     console.error("Error exporting laporan penjualan:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// module.exports = router;

