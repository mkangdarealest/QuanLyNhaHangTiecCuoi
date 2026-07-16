const { readDB } = require('../models/db');

class DashboardController {
    static getStats(req, res) {
        try {
            const db = readDB();

            // 1. Calculations
            const totalBookings = db.dattiec.length;
            const pendingBookings = db.dattiec.filter(b => b.TrangThai === "Đã cọc").length;
            const totalServices = db.menu_dichvu.length;
            
            // Revenue is the sum of TongTienKhachTra from payment + DatCoc from active/paid bookings
            const totalRevenue = db.thanhtoan.reduce((sum, item) => sum + item.TongTienKhachTra, 0) + 
                                 db.dattiec.filter(b => b.TrangThai === "Đã cọc").reduce((sum, item) => sum + item.DatCoc, 0);

            // 2. Recent Bookings (limit 5)
            const recentBookings = [...db.dattiec]
                .sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat))
                .slice(0, 5);

            // 3. Monthly Revenue Data (for Chart.js)
            const monthlyRevenue = {};
            const months = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const key = d.toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' });
                months.push(key);
                monthlyRevenue[key] = 0;
            }

            db.thanhtoan.forEach(invoice => {
                const dateObj = new Date(invoice.Ngaytt);
                const key = dateObj.toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' });
                if (monthlyRevenue[key] !== undefined) {
                    monthlyRevenue[key] += invoice.TongTienKhachTra;
                }
            });

            db.dattiec.filter(b => b.TrangThai === "Đã cọc").forEach(booking => {
                const dateObj = new Date(booking.NgayDat);
                const key = dateObj.toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' });
                if (monthlyRevenue[key] !== undefined) {
                    monthlyRevenue[key] += booking.DatCoc;
                }
            });

            const chartData = {
                labels: months,
                data: months.map(m => monthlyRevenue[m])
            };

            // 4. Popular Items
            const itemCounts = {};
            db.chitietdattiec.forEach(detail => {
                itemCounts[detail.MaMenu_DV] = (itemCounts[detail.MaMenu_DV] || 0) + detail.SoLuong;
            });

            const popularItems = Object.keys(itemCounts)
                .map(code => {
                    const item = db.menu_dichvu.find(m => m.MaMenu_DV === code);
                    return {
                        name: item ? item.TenMenu_DV : code,
                        count: itemCounts[code]
                    };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            res.json({
                totalRevenue,
                totalBookings,
                pendingBookings,
                totalServices,
                recentBookings,
                chartData,
                popularItems
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = DashboardController;
