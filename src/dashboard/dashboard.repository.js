const prisma = require("../db");

const findDashboardStatistikPenjualan = async (bulan, tahun) => {
    try {
        bulan = bulan.toString().padStart(2, '0');
        tahun = tahun.toString();

        const startDate = new Date(`${tahun}-${bulan}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

        const penjualan = await prisma.penjualan.findMany({
            where: {
                waktu: {
                    gte: startDate,
                    lt: endDate
                }
            },
            include: {
                detail_penjualan: {
                    include: {
                        produk: true
                    }
                },
                user: {
                    include: {
                        karyawan: {
                            include: {
                                outlet: true
                            }
                        }
                    }
                }
            }
        });

        const totalNilaiPenjualan = penjualan.reduce((acc, curr) => acc + curr.total, 0);
        const totalProdukPenjualan = penjualan.reduce((acc, curr) => acc + curr.detail_penjualan.length, 0);
        const totalJumlahPenjualan = penjualan.length;

        const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        const totalWeeks = Math.ceil((endOfMonth.getDate() - startOfMonth.getDate() + 1) / 7);
        const rataRataNilaiPenjualanPerMinggu = totalNilaiPenjualan / (totalWeeks || 1);

        const response = {
            success: true,
            message: "Dashboard statistik penjualan berhasil diperoleh",
            dataTitle: "Dashboard Statistik Penjualan",
            data: {
                totalJumlahPenjualan,
                totalNilaiPenjualan,
                totalProdukPenjualan,
                rataRataNilaiPenjualanPerMinggu: parseFloat(rataRataNilaiPenjualanPerMinggu.toFixed(2))
            }
        };

        return response;
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            success: false,
            message: "Gagal memperoleh data statistik penjualan"
        };
    }
};

const findDashboardPengeluaran = async (bulan, tahun) => {
  try {
    bulan = bulan.toString().padStart(2, '0');
    tahun = tahun.toString();

    const startDate = new Date(`${tahun}-${bulan}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    // Fetch current month's material restocking costs
const restokBahan = await prisma.restok_bahan.findMany({
  where: {
    tanggal_terima: {
      gte: startDate,
      lt: endDate,
    },
  },
  include: {
    daftar_bahan: true,
  },
});

const pengeluaranBahan = restokBahan.reduce((acc, curr) => acc + curr.daftar_bahan.harga * curr.jumlah, 0);
console.log(`Total pengeluaran bahan: ${pengeluaranBahan}`);
 // Fetch current month's sewing costs
    const produksi = await prisma.produksi.findMany({
      where: {
        tanggal_mulai: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        detail_model_produk: true,
      },
    });

    const pengeluaranJahit = produksi.reduce((acc, curr) => acc + curr.jumlah * curr.detail_model_produk.biaya_jahit, 0);

    // Calculate total current month's expenditure
    const pengeluaranBulanIni = pengeluaranBahan + pengeluaranJahit;

    // Fetch previous month's material restocking and sewing costs
    const previousMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(previousMonthStart.getFullYear(), previousMonthStart.getMonth() + 1, 1);

    const restokBahanLalu = await prisma.restok_bahan.findMany({
      where: {
        tanggal_terima: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
      },
      include: {
        daftar_bahan: true,
      },
    });

    const pengeluaranBahanLalu = restokBahanLalu.reduce((acc, curr) => acc + curr.harga_satuan * curr.jumlah, 0);

    const produksiLalu = await prisma.produksi.findMany({
      where: {
        tanggal_mulai: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
      },
      include: {
        detail_model_produk: true,
      },
    });

    const pengeluaranJahitLalu = produksiLalu.reduce((acc, curr) => acc + curr.jumlah * curr.detail_model_produk.biaya_jahit, 0);

    const pengeluaranBulanLalu = pengeluaranBahanLalu + pengeluaranJahitLalu;

    const selisihPengeluaran = pengeluaranBulanIni - pengeluaranBulanLalu;
    const persentasePerubahan = pengeluaranBulanLalu === 0 ? (pengeluaranBulanIni === 0 ? 0 : 100) : (selisihPengeluaran / pengeluaranBulanLalu) * 100;

    const response = {
      success: true,
      message: "Dashboard jumlah, selisih, dan persentase pengeluaran berhasil diperoleh",
      dataTitle: "Dashboard Jumlah, Selisih, dan Persentase Pengeluaran",
      data: {
        pengeluaranBulanIni,
        selisihPengeluaran,
        persentasePerubahan: parseFloat(persentasePerubahan.toFixed(2)),
      },
    };

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Gagal memperoleh data pengeluaran",
    };
  }
};

const findDashboardKeuntungan = async (bulan, tahun) => {
  try {
    bulan = bulan.toString().padStart(2, '0');
    tahun = tahun.toString();

    const startDate = new Date(`${tahun}-${bulan}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    // Fetch current month's sales
    const penjualan = await prisma.penjualan.findMany({
      where: {
        waktu: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const totalPenjualanBulanIni = penjualan.reduce((acc, curr) => acc + curr.total, 0);

    // Fetch current month's material restocking costs
    const restokBahan = await prisma.restok_bahan.findMany({
      where: {
        tanggal_terima: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        daftar_bahan: true,
      },
    });

    const totalPengeluaranBahan = restokBahan.reduce((acc, curr) => acc + curr.daftar_bahan.harga * curr.jumlah, 0);
// Fetch current month's production costs
const produksi = await prisma.produksi.findMany({
  where: {
    tanggal_mulai: {
      gte: startDate,
      lt: endDate,
    },
  },
  include: {
    detail_model_produk: true,
  },
});

const totalPengeluaranProduksi = produksi.reduce((acc, curr) => acc + curr.jumlah * curr.detail_model_produk.biaya_jahit, 0);

    // Calculate total profit for the current month
    const totalKeuntunganBulanIni = totalPenjualanBulanIni - totalPengeluaranBahan - totalPengeluaranProduksi;

    // Fetch weekly profits for the current month
    const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    const totalWeeks = Math.ceil((endOfMonth.getDate() - startOfMonth.getDate() + 1) / 7);

    const weeklyProfits = Array.from({ length: totalWeeks }, (_, index) => {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (index * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekPenjualan = penjualan.filter(p => p.waktu >= weekStart && p.waktu <= weekEnd);
      const weekTotalPenjualan = weekPenjualan.reduce((acc, curr) => acc + curr.total, 0);

      const weekRestokBahan = restokBahan.filter(r => r.tanggal_terima >= weekStart && r.tanggal_terima <= weekEnd);
      const weekTotalPengeluaranBahan = weekRestokBahan.reduce((acc, curr) => acc + curr.harga_satuan * curr.jumlah, 0);

      const weekProduksi = produksi.filter(p => p.tanggal_mulai >= weekStart && p.tanggal_mulai <= weekEnd);
      const weekTotalPengeluaranProduksi = weekProduksi.reduce((acc, curr) => acc + curr.jumlah * curr.detail_model_produk.harga_jual, 0);

      return weekTotalPenjualan - weekTotalPengeluaranBahan - weekTotalPengeluaranProduksi;
    });

    // Calculate percentage change in profit
    const previousMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(previousMonthStart.getFullYear(), previousMonthStart.getMonth() + 1, 1);

    const previousMonthPenjualan = await prisma.penjualan.findMany({
      where: {
        waktu: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
      },
    });

    const totalPreviousMonthPenjualan = previousMonthPenjualan.reduce((acc, curr) => acc + curr.total, 0);

    const previousMonthRestokBahan = await prisma.restok_bahan.findMany({
      where: {
        tanggal_terima: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
      },
      include: {
        daftar_bahan: true,
      },
    });

    const totalPreviousMonthPengeluaranBahan = previousMonthRestokBahan.reduce((acc, curr) => acc + curr.harga_satuan * curr.jumlah, 0);

    const previousMonthProduksi = await prisma.produksi.findMany({
      where: {
        tanggal_mulai: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
      },
      include: {
        detail_model_produk: true,
      },
    });

    const totalPreviousMonthPengeluaranProduksi = previousMonthProduksi.reduce((acc, curr) => acc + curr.jumlah * curr.detail_model_produk.harga_jual, 0);

    const totalPreviousMonthKeuntungan = totalPreviousMonthPenjualan - totalPreviousMonthPengeluaranBahan - totalPreviousMonthPengeluaranProduksi;

    const selisihKeuntungan = totalKeuntunganBulanIni - totalPreviousMonthKeuntungan;
    const persentasePerubahanKeuntungan = totalPreviousMonthKeuntungan === 0 ? (totalKeuntunganBulanIni === 0 ? 0 : 100) : (selisihKeuntungan / totalPreviousMonthKeuntungan) * 100;

    const response = {
      success: true,
      message: "Dashboard jumlah, selisih, dan persentase pengeluaran berhasil diperoleh",
      dataTitle: "Dashboard Jumlah, Selisih, dan Persentase Pengeluaran",
      data: {
        totalKeuntunganBulanIni,
        totalPengeluaranBulanIni: totalPengeluaranBahan + totalPengeluaranProduksi,
        persentasePerubahanKeuntungan: parseFloat(persentasePerubahanKeuntungan.toFixed(2)),
        keuntunganMingguan: weeklyProfits,
      },
    };

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Gagal memperoleh data pengeluaran",
    };
  }
};

const findDashboardKerugian = async (bulan, tahun) => {
  try {
    bulan = bulan.toString().padStart(2, '0');
    tahun = tahun.toString();

    const startDate = new Date(`${tahun}-${bulan}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    // Fetch QC bahan failures
    const qcBahanFailures = await prisma.qc_bahan.findMany({
      where: {
        created_at: {
          gte: startDate,
          lt: endDate,
        },
        status: "gagal",
      },
    });

    // Fetch QC produk failures
    const qcProdukFailures = await prisma.qc_produk.findMany({
      where: {
        created_at: {
          gte: startDate,
          lt: endDate,
        },
        status: "gagal",
      },
    });

    // Fetch production failures
    const productionFailures = await prisma.produksi.findMany({
      where: {
        tanggal_mulai: {
          gte: startDate,
          lt: endDate,
        },
        status: "gagal",
      },
    });

    // Calculate total loss value for the current month
    let totalNilaiKerugianBulanIni = 0;

    // Calculate loss value for failed QC bahan
    for (const qcBahan of qcBahanFailures) {
      const bahan = await prisma.daftar_bahan.findUnique({
        where: {
          id: qcBahan.daftar_bahan_id,
        },
      });
      if (bahan && bahan.harga) {
        totalNilaiKerugianBulanIni += bahan.harga;
      }
    }

    // Calculate loss value for failed QC produk
    for (const qcProduk of qcProdukFailures) {
      const produk = await prisma.detail_model_produk.findUnique({
        where: {
          id: qcProduk.detail_model_produk_id,
        },
      });
      if (produk && produk.harga_jual) {
        totalNilaiKerugianBulanIni += produk.harga_jual;
      }
    }

    // Calculate loss value for failed production
    for (const production of productionFailures) {
      const produk = await prisma.detail_model_produk.findUnique({
        where: {
          id: production.detail_model_produk_id,
        },
      });
      if (produk && produk.hpp) {
        totalNilaiKerugianBulanIni += produk.hpp;
      }
    }

    // Calculate percentage change in losses
    // (assuming previous month's losses are 0 for this example)
    const persentasePerubahanKerugian = -100;

    const response = {
      success: true,
      message: "Dashboard perhitungan kerugian berhasil diperoleh",
      dataTitle: "Dashboard Perhitungan Kerugian",
      data: {
        jumlahKegagalanBerdasarkanOperasi: {
          name: ["Qc Bahan", "Qc Produk", "Produksi"],
          data: [qcBahanFailures.length, qcProdukFailures.length, productionFailures.length],
        },
        totalKegagalanOperasi: qcBahanFailures.length + qcProdukFailures.length + productionFailures.length,
        totalNilaiKerugianBulanIni,
        persentasePerubahanKerugian,
      },
    };

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Gagal memperoleh data kerugian",
    };
  }
};
const findDashboardPendapatanPengeluaran = async (tahun) => {
  try {
    const startDate = new Date(`${tahun}-01-01`);
    const endDate = new Date(`${parseInt(tahun) + 1}-01-01`);

    const pendapatan = await prisma.penjualan.groupBy({
      by: ["waktu"],
      where: {
        waktu: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        total: true
      }
    });
    
    
    const pengeluaranRestokBahan = await prisma.restok_bahan.findMany({
      where: {
        tanggal_terima: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        tanggal_terima:true,
        jumlah: true,
        daftar_bahan: {
          select: {
            harga: true,
          },
        },
      },
    });

    const pengeluaranProduksi = await prisma.produksi.findMany({
      where: {
        tanggal_mulai: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        tanggal_mulai:true,
        jumlah: true,
        detail_model_produk: {
          select: {
            harga_jual: true,
            biaya_jahit: true,
          },
        },
      },
    });

    const totalPengeluaranRestokBahan = pengeluaranRestokBahan.reduce((acc, curr) => {
      return acc + curr.jumlah * curr.daftar_bahan.harga;
    }, 0);

    const totalPengeluaranProduksi = pengeluaranProduksi.reduce((acc, curr) => {
      return acc + curr.jumlah * curr.detail_model_produk.harga_jual;
    }, 0);

    const pendapatanPerBulan = Array.from({ length: 12 }, (_, i) => {
      const bulan = (i + 1).toString().padStart(2, '0');
      const pendapatanBulan = pendapatan.find((item) => item.waktu.getMonth() + 1 === (i + 1));
      return pendapatanBulan ? pendapatanBulan._sum.total : 0;
    });

    const pengeluaranPerBulan = Array.from({ length: 12 }, (_, i) => {
      const bulan = (i + 1).toString().padStart(2, '0');
      const pengeluaranRestokBahanBulan = pengeluaranRestokBahan.filter((item) => item.tanggal_terima.getMonth() + 1 === (i + 1));
      const totalPengeluaranRestokBahanBulan = pengeluaranRestokBahanBulan.reduce((acc, curr) => {
        return acc + curr.jumlah * curr.daftar_bahan.harga;
      }, 0);

      const pengeluaranProduksiBulan = pengeluaranProduksi.filter((item) => item.tanggal_mulai.getMonth() + 1 === (i + 1));
      const totalPengeluaranProduksiBulan = pengeluaranProduksiBulan.reduce((acc, curr) => {
        return acc + curr.jumlah * curr.detail_model_produk.biaya_jahit;
      }, 0);

      return totalPengeluaranRestokBahanBulan + totalPengeluaranProduksiBulan;
    });

    const response = {
      success: true,
      message: `Dashboard pendapatan dan pengeluaran tahun ${tahun} berhasil diperoleh`,
      dataTitle: `Dashboard Pendapatan dan Pengeluaran Tahun ${tahun}`,
      data: {
        pendapatanPerBulan,
        pengeluaranPerBulan,
      },
    };

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Gagal memperoleh data pendapatan dan pengeluaran",
    };
  }
};const findPeringkatPenjahit = async (bulan, tahun, itemsPerPage, page) => {
  const skip = itemsPerPage * (page - 1);
  const nextMonth = parseInt(bulan) === 12 ? 1 : parseInt(bulan) + 1;
  const nextYear = nextMonth === 1 ? parseInt(tahun) + 1 : tahun;

  // Retrieve produksi records
  const produksiData = await prisma.produksi.findMany({
    where: {
      tanggal_mulai: {
        gte: new Date(`${tahun}-${bulan}-01T00:00:00.000Z`),
        lt: new Date(`${nextYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          karyawan: {
            select: {
              nama: true,
              foto: true,
            },
          },
          role: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
  });

  // Calculate totalProduksi and totalProses
  const totalProduksi = produksiData.filter((item) => item.status === 'selesai').length;
  const totalProses = produksiData.filter((item) => item.status === 'review' || item.status === 'pengerjaan').length;

  // Group produksiData by user_id
  const groupedData = produksiData.reduce((acc, curr) => {
    const userId = curr.user.id;
    if (!acc[userId]) {
      acc[userId] = {
        idPenjahit: userId,
        namaPenjahit: curr.user.karyawan.nama,
        foto: curr.user.karyawan.foto,
        role: curr.user.role.nama,
        totalProduksi: 0,
        totalProses: 0,
      };
    }
    if (curr.status === 'selesai') {
      acc[userId].totalProduksi++;
    } else if (curr.status === 'review' || curr.status === 'pengerjaan') {
      acc[userId].totalProses++;
    }
    return acc;
  }, {});

  // Convert groupedData to array
  const reshapedData = Object.values(groupedData);

  // Sort reshapedData by totalProduksi in descending order
  reshapedData.sort((a, b) => b.totalProduksi - a.totalProduksi);

  // Paginate reshapedData
  const paginatedData = reshapedData.slice(skip, skip + itemsPerPage);

  return {
    success: true,
    message: "Dashboard peringkat penjahit berhasil diperoleh",
    dataTitle: "Dashboard Peringkat Penjahit",
    data: paginatedData,
    // totalProduksi,
    // totalProses,
  };
};const findPeringkatProduk = async (bulan, tahun) => {
  const nextMonth = parseInt(bulan) === 12 ? 1 : parseInt(bulan) + 1;
  const nextYear = parseInt(bulan) === 12 ? parseInt(tahun) + 1 : parseInt(tahun);

  const ltDate = new Date(`${nextYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`);

  try {
    const penjualanData = await prisma.penjualan.findMany({
      where: {
        waktu: {
          gte: new Date(`${tahun}-${bulan}-01T00:00:00.000Z`),
          lt: ltDate,
        },
      },
      include: {
        detail_penjualan: {
          include: {
            produk: {
              include: {
                model_produk: {
                  include: {
                    kategori: true,
                    foto_produk: true, // Include foto_produk
                  },
                },
              },
            },
          },
        },
      },
    });

    const groupedData = penjualanData.reduce((acc, curr) => {
      curr.detail_penjualan.forEach((detail) => {
        const { produk } = detail;
        const { id, kode, nama, model_produk } = produk;

        if (!acc[id]) {
          acc[id] = {
            idProduk: id,
            kodeProduk: kode,
            namaProduk: nama,
            foto: model_produk.foto_produk.length > 0 ? model_produk.foto_produk[0].filepath : null, // Get the first foto or null if not available
            kategoriProduk: model_produk.kategori.nama,
            hargaProduk: model_produk.harga_jual,
            totalJumlahTerjual: 0,
          };
        }
        acc[id].totalJumlahTerjual++; // Increment the totalJumlahTerjual
      });
      return acc;
    }, {});

    const reshapedData = Object.values(groupedData);

    return {
      success: true,
      message: "Dashboard peringkat produk berhasil diperoleh",
      dataTitle: "Dashboard Peringkat Produk",
      data: reshapedData,
    };
  } catch (error) {
    console.error("Error finding peringkat produk: ", error);
    return {
      success: false,
      message: "Error fetching product rankings",
      error: error.message,
    };
  }
};

const findPeringkatSales = async (bulan, tahun, itemsPerPage, page) => {
  const skip = itemsPerPage * (page - 1);
  const nextMonth = parseInt(bulan) === 12 ? 1 : parseInt(bulan) + 1;
  const nextYear = parseInt(bulan) === 12 ? parseInt(tahun) + 1 : parseInt(tahun);

  const ltDate = new Date(`${nextYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`);

  const penjualanData = await prisma.penjualan.findMany({
    where: {
      waktu: {
        gte: new Date(`${tahun}-${bulan}-01T00:00:00.000Z`),
        lt: ltDate,
      },
    },
    include: {
      user: {
        include: {
          karyawan: true,  // Assuming karyawan contains user details like name and photo
          role: true,
        },
      },
    },
  });

  // Group penjualanData by user_id and sum total transactions and their value
  const groupedData = penjualanData.reduce((acc, curr) => {
    const { user_id, total } = curr;
    if (!acc[user_id]) {
      acc[user_id] = {
        idSales: user_id,
        namaSales: curr.user.karyawan.nama, // Assuming karyawan has a nama field
        foto: curr.user.karyawan.foto || null, // Assuming karyawan has a foto field
        role: curr.user.role.nama,
        totalNilaiTransaksi: 0,
        jumlahTransaksi: 0,
      };
    }
    acc[user_id].totalNilaiTransaksi += total;
    acc[user_id].jumlahTransaksi++;
    return acc;
  }, {});

  const reshapedData = Object.values(groupedData);

  // Sort by totalNilaiTransaksi in descending order
  reshapedData.sort((a, b) => b.totalNilaiTransaksi - a.totalNilaiTransaksi);

  // Paginate the data
  const paginatedData = reshapedData.slice(skip, skip + itemsPerPage);

  return {
    success: true,
    message: "Dashboard peringkat sales berhasil diperoleh",
    dataTitle: "Dashboard Peringkat Sales",
    data: paginatedData,
  };
};



module.exports = {
    findDashboardStatistikPenjualan,
    findDashboardPengeluaran,
    findDashboardKeuntungan,
    findDashboardKerugian,
    findDashboardPendapatanPengeluaran,
    findPeringkatPenjahit,
    findPeringkatProduk,
  findPeringkatSales,

};
