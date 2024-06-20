const { findDashboardStatistikPenjualan,
   findDashboardPengeluaran,
   findDashboardKeuntungan,
   findDashboardKerugian,
   findDashboardPendapatanPengeluaran,
   findPeringkatPenjahit,
   findPeringkatProduk,
   findPeringkatSales } = require("./dashboard.repository");

const getDashboardStatistikPenjualan = async (bulan, tahun) => {
    if (!bulan || !tahun) {
        return {
            success: false,
            message: "Parameter bulan dan tahun wajib diisi"
        };
    }
    const statistikData = await findDashboardStatistikPenjualan(bulan, tahun);
    return statistikData;
};

const getDashboardPengeluaran = async (bulan, tahun) => {
    if (!bulan || !tahun) {
        return {
            success: false,
            message: "Parameter bulan dan tahun wajib diisi"
        };
    }
    const pengeluaranData = await findDashboardPengeluaran(bulan, tahun);
    return pengeluaranData;
};

const getDashboardKeuntungan = async (bulan, tahun) => {
  if (!bulan || !tahun) {
    return {
      success: false,
      message: "Parameter bulan dan tahun wajib diisi",
    };
  }
  const keuntunganData = await findDashboardKeuntungan(bulan, tahun);
  return keuntunganData;
};


const getDashboardKerugian = async (bulan, tahun) => {
  if (!bulan || !tahun) {
    return {
      success: false,
      message: "Parameter bulan dan tahun wajib diisi",
    };
  }
  const kerugianData = await findDashboardKerugian(bulan, tahun);
  return kerugianData;
};



const getDashboardPendapatanPengeluaran = async (tahun) => {
  if (!tahun) {
    return {
      success: false,
      message: "Parameter tahun wajib diisi",
    };
  }
  const data = await findDashboardPendapatanPengeluaran(tahun);
  return data;
};



const getPeringkatPenjahit = async (bulan, tahun, itemsPerPage, page) => {
  if (!bulan || !tahun || !itemsPerPage || !page) {
      return {
          success: false,
          message: "Parameter bulan, tahun, itemsPerPage, dan page wajib diisi"
      };
  }

  const peringkatData = await findPeringkatPenjahit(bulan, tahun, itemsPerPage, page);
  return peringkatData;
};

const getDashboardPeringkatProduk = async (bulan, tahun, itemsPerPage, page) => {
  const penjualanData = await findPeringkatProduk(bulan, tahun,itemsPerPage, page);
return penjualanData;
};

const getPeringkatSales = async (bulan, tahun, itemsPerPage, page) => {
  if (!bulan || !tahun || !itemsPerPage || !page) {
    return {
      success: false,
      message: 'Parameter bulan, tahun, itemsPerPage, dan page wajib diisi',
    };
  }

  const peringkatData = await findPeringkatSales(bulan, tahun, itemsPerPage, page);
  return peringkatData;
};

module.exports = {
    getDashboardStatistikPenjualan,
    getDashboardPengeluaran,
    getDashboardKeuntungan,
    getDashboardKerugian,
    getDashboardPendapatanPengeluaran,
    getPeringkatPenjahit,
    getDashboardPeringkatProduk,
    getPeringkatSales


};
