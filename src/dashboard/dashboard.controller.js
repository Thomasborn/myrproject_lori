const express = require("express");
const { getDashboardStatistikPenjualan,
   getDashboardPengeluaran,
   getDashboardKeuntungan,
   getDashboardKerugian,
   getDashboardPendapatanPengeluaran,
   getPeringkatPenjahit,
   getPeringkatSales } = require("./dashboard.service");

const router = express.Router();

router.get("/statistik/penjualan", async (req, res) => {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
        return res.status(400).send({
            success: false,
            message: "Parameter bulan dan tahun wajib diisi"
        });
    }

    const dashboardData = await getDashboardStatistikPenjualan(bulan, tahun);
    res.send(dashboardData);
});

router.get("/pengeluaran", async (req, res) => {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
        return res.status(400).send({
            success: false,
            message: "Parameter bulan dan tahun wajib diisi"
        });
    }

    const dashboardData = await getDashboardPengeluaran(bulan, tahun);
    res.send(dashboardData);
});

router.get("/keuntungan", async (req, res) => {
  const { bulan, tahun } = req.query;
  const keuntunganData = await getDashboardKeuntungan(bulan, tahun);
  res.send(keuntunganData);
});

router.get("/kerugian", async (req, res) => {
  const { bulan, tahun } = req.query;
  const kerugianData = await getDashboardKerugian(bulan, tahun);
  res.send(kerugianData);
});

router.get("/pendapatan-pengeluaran", async (req, res) => {
  const { tahun } = req.query;
  const data = await getDashboardPendapatanPengeluaran(tahun);
  res.send(data);
});


router.get('/peringkat-produk', async (req, res) => {
  const { bulan, tahun, itemsPerPage, page } = req.query;
  const data = await getDashboardPeringkatProduk(bulan, tahun, parseInt(itemsPerPage), parseInt(page));
  res.json(data);
});
router.get("/peringkat-penjahit", async (req, res) => {
  try {
    const { bulan, tahun, itemsPerPage, page } = req.query;
    const data = await getPeringkatPenjahit(bulan, tahun, itemsPerPage, page);
    res.json(data);
  } catch (error) {
    console.error("Error fetching peringkat penjahit:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.get('/peringkat-sales', async (req, res) => {
  const { bulan, tahun, itemsPerPage = 10, page = 1 } = req.query;

  try {
    const result = await getPeringkatSales(bulan, tahun, parseInt(itemsPerPage), parseInt(page));
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sales ranking',
      error: error.message,
    });
  }
});
module.exports = router;
// konsisten
// const express = require("express");
// const {
//   getDashboardStatistikPenjualan,
//   getDashboardPengeluaran,
//   getDashboardKeuntungan,
//   getDashboardKerugian,
//   getDashboardPendapatanPengeluaran,
//   getPeringkatPenjahit,
//   getPeringkatSales,
// } = require("./dashboard.service");

// const router = express.Router();

// router.get("/statistik/penjualan", async (req, res) => {
//   try {
//     const { bulan, tahun } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const dashboardData = await getDashboardStatistikPenjualan(bulan, tahun);
//     res.send(dashboardData);
//   } catch (error) {
//     console.error("Error fetching dashboard statistics:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/pengeluaran", async (req, res) => {
//   try {
//     const { bulan, tahun } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const dashboardData = await getDashboardPengeluaran(bulan, tahun);
//     res.send(dashboardData);
//   } catch (error) {
//     console.error("Error fetching pengeluaran data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/keuntungan", async (req, res) => {
//   try {
//     const { bulan, tahun } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const keuntunganData = await getDashboardKeuntungan(bulan, tahun);
//     res.send(keuntunganData);
//   } catch (error) {
//     console.error("Error fetching keuntungan data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/kerugian", async (req, res) => {
//   try {
//     const { bulan, tahun } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const kerugianData = await getDashboardKerugian(bulan, tahun);
//     res.send(kerugianData);
//   } catch (error) {
//     console.error("Error fetching kerugian data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/pendapatan-pengeluaran", async (req, res) => {
//   try {
//     const { tahun } = req.query;

//     if (!tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter tahun wajib diisi",
//       });
//     }

//     const data = await getDashboardPendapatanPengeluaran(tahun);
//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching pendapatan pengeluaran data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/peringkat-produk", async (req, res) => {
//   try {
//     const { bulan, tahun, itemsPerPage, page } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const data = await getDashboardPeringkatProduk(bulan, tahun, parseInt(itemsPerPage), parseInt(page));
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching peringkat produk data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/peringkat-penjahit", async (req, res) => {
//   try {
//     const { bulan, tahun, itemsPerPage, page } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const data = await getPeringkatPenjahit(bulan, tahun, itemsPerPage, page);
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching peringkat penjahit:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// router.get("/peringkat-sales", async (req, res) => {
//   try {
//     const { bulan, tahun, itemsPerPage = 10, page = 1 } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).send({
//         success: false,
//         message: "Parameter bulan dan tahun wajib diisi",
//       });
//     }

//     const result = await getPeringkatSales(bulan, tahun, parseInt(itemsPerPage), parseInt(page));
//     res.json(result);
//   } catch (error) {
//     console.error("Error fetching peringkat sales:", error);
//     res.status(500).json({
//       success: false,
//       message: "Sedang terjadi kesalahan di server, silahkan coba beberapa saat lagi",
//     });
//   }
// });

// module.exports = router;
