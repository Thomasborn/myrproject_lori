const express = require("express");
// const { app, prisma } = require("./server"); // Import the Express app and Prisma client
const router = express.Router();
const verifyAccess = require("../middleware/access");
const ProdukController = require("../produk_item/produk_item.controller")
const ProduksiController = require("../produksi/produksi.controller")
const PengecekanController = require("../pengecekan/pengecekan.controller")
// const StokController = require("../stok/stok.controller")
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
const ModelProdukController = require("../model_produk/model_produk.controller")
const KategoriProdukController = require("../kategori_produk/kategori_produk.controller")
const QcProduksiController = require("../qc_produksi/qc_produksi.controller")
const QcProdukController = require("../qc_produk/qc_produk.controller")
const QcBahanController = require("../qc_bahan/qc_bahan.controller")
const DaftarProdukController = require("../daftar_produk/daftar_produk.controller")
const KustomController = require("../kustom/kustom.controller")
const DiskonController = require("../diskon/diskon.controller")
const PenjualanController = require("../penjualan/penjualan.controller")
const DaftarBahanController = require("../daftar_bahan/daftar_bahan.controller")
const RestokBahanController = require("../restok_bahan/restok_bahan.controller")
const StokBahanController = require("../stok_bahan/stok_bahan.controller")
const LemariController = require("../lemari/lemari.controller")
const BahanStokOpnameController = require("../bahan_stok_opname/bahan_stok_opname.controller")
const ProdukStokOpnameController = require("../produk_stok_opname/produk_stok_opname.controller")

router.use("/produk",ProdukController);
router.use("/kategori",KategoriController);
router.use("/pembuat",PembuatController);
router.use("/produksi",ProduksiController);
router.use("/pengecekan",PengecekanController);
router.use("/pengecekan_bahan",PengecekanBahanController);
router.use("/pemesanan",PemesananBahanController);
router.use("/supplier",SupplierController);
router.use("/outlet",OutletController);
router.use("/gawangan",GawanganController);
router.use("/pembelians",PembelianController);
router.use("/users",UserController);
router.use("/fungsi",FungsiController);
router.use("/model-produk",ModelProdukController);
router.use("/kategori-produk",KategoriController);
router.use("/hak-akses",HakAksesController);
router.use("/qc-produksi",QcProduksiController);
router.use("/qc-produk",QcProdukController);
router.use("/qc-bahan",QcBahanController);
router.use("/daftar-produk",DaftarProdukController);
router.use("/kustom",KustomController);
router.use("/diskon",DiskonController);
router.use("/penjualan",PenjualanController);
router.use("/daftar-bahan",DaftarBahanController);
router.use("/restok-bahan",RestokBahanController);
router.use("/stok-bahan",StokBahanController);
router.use("/lemari",LemariController);
router.use("/bahan-stok-opname",BahanStokOpnameController);
router.use("/produk-stok-opname",ProdukStokOpnameController);
module.exports=router;