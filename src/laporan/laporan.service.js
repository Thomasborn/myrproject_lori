const { findLaporanPenjualan } = require("./laporan.repository");
const getLaporanPenjualan = async (query) => {
  const laporanPenjualan = await findLaporanPenjualan(query, false);
  return laporanPenjualan;
};

const exportLaporanPenjualan = async (query) => {
  const laporanPenjualan = await findLaporanPenjualan(query, true);
  return laporanPenjualan;
};
module.exports = {
    getLaporanPenjualan,
    exportLaporanPenjualan
};