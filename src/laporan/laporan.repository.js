// const prisma = require("../db");

// const findLaporanPenjualan = async (query) => {
//     try {
//         let { q, metodePembayaran, idOutlet, idSales, tanggalAwal, tanggalAkhir, itemsPerPage = 10, page = 1 } = query;
//         const offset = (page - 1) * itemsPerPage;
//         let whereCondition = {};

//         // Parse tanggalAwal and tanggalAkhir
//         const startDate = tanggalAwal ? new Date(tanggalAwal.split('/').reverse().join('-')) : null;
//         const endDate = tanggalAkhir ? new Date(tanggalAkhir.split('/').reverse().join('-')) : null;

//         if (startDate && endDate) {
//             whereCondition.waktu = {
//                 gte: startDate,
//                 lte: endDate
//             };
//         } else if (startDate) {
//             whereCondition.waktu = {
//                 gte: startDate
//             };
//         } else if (endDate) {
//             whereCondition.waktu = {
//                 lte: endDate
//             };
//         }

//         if (metodePembayaran) {
//             whereCondition.metode_pembayaran = metodePembayaran;
//         }

//         if (idOutlet) {
//             idOutlet = parseInt(idOutlet);
//             whereCondition.user = {
//                 karyawan: {
//                     outlet_id: idOutlet
//                 }
//             };
//         }

//         if (idSales) {
//             idSales = parseInt(idSales);
//             whereCondition.user_id = idSales;
//         }

//         if (q) {
//             whereCondition.OR = [
//                 { user: { karyawan: { nama: { contains: q, mode: 'insensitive' } } } }
//             ];
//         }

//         const laporanPenjualan = await prisma.penjualan.findMany({
//             where: whereCondition,
//             skip: offset,
//             take: parseInt(itemsPerPage),
//             include: {
//                 detail_penjualan: { include: { produk: true } },
//                 user: {
//                     include: {
//                         karyawan: { include: { outlet: true } }
//                     }
//                 }
//             }
//         });

//         const totalData = await prisma.penjualan.count({ where: whereCondition });
//         const totalPages = Math.ceil(totalData / itemsPerPage);

//         // Calculate total sales value, total items sold, and average sales per week
//         const totalNilaiPenjualan = laporanPenjualan.reduce((acc, curr) => acc + curr.total, 0);
//         const totalItemPenjualan = laporanPenjualan.reduce((acc, curr) => acc + curr.detail_penjualan.length, 0);
//         const weeks = (endDate - startDate) / (1000 * 60 * 60 * 24 * 7);
//         const rataRataNilaiPenjualanPerMinggu = totalNilaiPenjualan / (weeks || 1); // Avoid division by zero

//         return {
//             success: true,
//             message: "Data laporan penjualan berhasil diperoleh",
//             dataTitle: "Laporan Penjualan",
//             itemsPerPage,
//             totalPages,
//             totalData,
//             page,
//             data: laporanPenjualan.map(p => ({
//                 id: p.id,
//                 tanggal: p.waktu.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
//                 waktu: p.waktu.toLocaleTimeString('id-ID'),
//                 metodePembayaran: p.metode_pembayaran,
//                 idPenggunaSales: p.user_id,
//                 namaPenggunaSales: p.user.karyawan.nama,
//                 totalTransaksi: p.total,
//                 idOutlet: p.user.karyawan.outlet.id,
//                 namaOutlet: p.user.karyawan.outlet.nama,
//                 jumlahItem: p.detail_penjualan.length
//             })),
//             report: {
//                 totalNilaiPenjualan,
//                 totalItemPenjualan,
//                 rataRataNilaiPenjualanPerMinggu
//             }
//         };
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return {
//             success: false,
//             message: "Gagal memperoleh data laporan penjualan"
//         };
//     }
// };

// module.exports = {
//     findLaporanPenjualan,
// };

const prisma = require("../db");

const findLaporanPenjualan = async (query, isExport) => {
    try {
        let { q, metodePembayaran, idOutlet, idSales, tanggalAwal, tanggalAkhir, bulanTransaksi, tahunTransaksi, itemsPerPage = 10, page = 1 } = query;
        const offset = (page - 1) * itemsPerPage;
        let whereCondition = {};

        if (tanggalAwal && tanggalAkhir) {
            const startDate = new Date(tanggalAwal.split('/').reverse().join('-'));
            const endDate = new Date(tanggalAkhir.split('/').reverse().join('-'));
            whereCondition.waktu = {
                gte: startDate,
                lte: endDate
            };
        } else if (bulanTransaksi && tahunTransaksi) {
            bulanTransaksi = bulanTransaksi.toString().padStart(2, '0');
            tahunTransaksi = tahunTransaksi.toString();
            const startDate = new Date(`${tahunTransaksi}-${bulanTransaksi}-01`);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
            whereCondition.waktu = {
                gte: startDate,
                lt: endDate
            };
        }

        if (metodePembayaran) {
            whereCondition.metode_pembayaran = metodePembayaran;
        }

        if (idOutlet) {
            idOutlet = parseInt(idOutlet);
            whereCondition.user = {
                karyawan: {
                    outlet_id: idOutlet
                }
            };
        }

        if (idSales) {
            idSales = parseInt(idSales);
            whereCondition.user_id = idSales;
        }

        if (q) {
            whereCondition.OR = [
                { user: { karyawan: { nama: { contains: q, mode: 'insensitive' } } } }
            ];
        }

        const laporanPenjualan = await prisma.penjualan.findMany({
            where: whereCondition,
            skip: offset,
            take: parseInt(itemsPerPage),
            include: {
                detail_penjualan: { include: { produk: true } },
                user: {
                    include: {
                        karyawan: { include: { outlet: true } }
                    }
                }
            }
        });

        const totalData = await prisma.penjualan.count({ where: whereCondition });
        const totalPages = Math.ceil(totalData / itemsPerPage);

        const totalNilaiPenjualan = laporanPenjualan.reduce((acc, curr) => acc + curr.total, 0);
        const totalItemPenjualan = laporanPenjualan.reduce((acc, curr) => acc + curr.detail_penjualan.length, 0);
        const startDate = tanggalAwal ? new Date(tanggalAwal.split('/').reverse().join('-')) : new Date(`${tahunTransaksi}-${bulanTransaksi}-01`);
        const endDate = tanggalAkhir ? new Date(tanggalAkhir.split('/').reverse().join('-')) : new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
        const weeks = (endDate - startDate) / (1000 * 60 * 60 * 24 * 7);
        const rataRataNilaiPenjualanPerMinggu = totalNilaiPenjualan / (weeks || 1);

        if (isExport) {
            return {
                success: true,
                message: "Data export laporan penjualan berhasil diperoleh",
                dataTitle: "Laporan Penjualan",
                totalData,
                data: {
                    row: laporanPenjualan.map(p => ({
                        tanggal: p.waktu.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                        waktu: p.waktu.toLocaleTimeString('id-ID'),
                        pembayaran: p.metode_pembayaran,
                        sales: p.user.karyawan.nama,
                        outlet: p.user.karyawan.outlet.nama,
                        jumlah: p.detail_penjualan.length,
                        total: p.total
                    })),
                    sum: {
                        "Total Nilai Penjualan": totalNilaiPenjualan,
                        "Total Produk Terjual": totalItemPenjualan,
                        "Rata - rata Penjualan Mingguan": rataRataNilaiPenjualanPerMinggu
                    },
                    filter: {
                        "Metode Pembayaran": metodePembayaran,
                        "Nama Outlet": idOutlet,
                        "Nama Sales": idSales,
                        "Tanggal Awal": tanggalAwal,
                        "Tanggal Akhir": tanggalAkhir
                    }
                }
            };
        } else {
            return {
                success: true,
                message: "Data laporan penjualan berhasil diperoleh",
                dataTitle: "Laporan Penjualan",
                itemsPerPage,
                totalPages,
                totalData,
                page,
                data: laporanPenjualan.map(p => ({
                    id: p.id,
                    tanggal: p.waktu.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    waktu: p.waktu.toLocaleTimeString('id-ID'),
                    metodePembayaran: p.metode_pembayaran,
                    idPenggunaSales: p.user_id,
                    namaPenggunaSales: p.user.karyawan.nama,
                    totalTransaksi: p.total,
                    idOutlet: p.user.karyawan.outlet.id,
                    namaOutlet: p.user.karyawan.outlet.nama,
                    jumlahItem: p.detail_penjualan.length
                })),
                report: {
                    totalNilaiPenjualan,
                    totalItemPenjualan,
                    rataRataNilaiPenjualanPerMinggu
                }
            };
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            success: false,
            message: "Gagal memperoleh data laporan penjualan"
        };
    }
};

module.exports = {
    findLaporanPenjualan,
};
