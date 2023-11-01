const express = require("express");
// const { app, prisma } = require("./server"); // Import the Express app and Prisma client
const router = express.Router();
const verifyAccess = require("../middleware/access");
const ProdukController = require("../produk_item/produk_item.controller")
const ProduksiController = require("../produksi/produksi.controller")
const PengecekanController = require("../pengecekan/pengecekan.controller")
const StokController = require("../stok/stok.controller")
const KategoriController = require("../kategori_produk/kategori_produk.controller")
const PembuatController = require("../pembuat/pembuat.controller")
const PengecekanBahanController = require("../pengecekan_bahan/pengecekan_bahan.controller")
const PemesananBahanController = require("../pemesanan/pemesanan.controller")
const SupplierController = require("../supplier/supplier.controller")
const OutletController = require("../outlet/outlet.controller")
const GawanganController = require("../gawangan/gawangan.controller")
const PembelianController = require("../pembelian/pembelian.controller")
const UserController = require("../user/user.controller")
const AuthController = require("../auth/auth.controller")
const FungsiController = require("../fungsi/fungsi.controller")
const HakAksesController = require("../hak_akses/hak_akses.controller")

router.use("/produks",ProdukController);
router.use("/kategoris",KategoriController);
router.use("/pembuats",PembuatController);
router.use("/produksis",ProduksiController);
router.use("/pengecekans",PengecekanController);
router.use("/pengecekan_bahans",PengecekanBahanController);
router.use("/stoks",StokController);
router.use("/pemesanans",PemesananBahanController);
router.use("/suppliers",SupplierController);
router.use("/outlets",OutletController);
router.use("/gawangans",GawanganController);
router.use("/pembelians",PembelianController);
router.use("/users",UserController);
router.use("/fungsi",FungsiController);
router.use("/hak-akses",HakAksesController);
module.exports=router;