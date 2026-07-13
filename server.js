const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions for reading/writing DB
function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return { loai: [], menu_dichvu: [], dattiec: [], chitietdattiec: [], thanhtoan: [], chitietthanhtoan: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("Error writing database:", err);
        return false;
    }
}

// ==========================================
// API - LOAI (Categories)
// ==========================================
app.get('/api/loai', (req, res) => {
    const db = readDB();
    res.json(db.loai || []);
});

app.post('/api/loai', (req, res) => {
    const db = readDB();
    const { TenLoai, MoTa } = req.body;
    
    if (!TenLoai) {
        return res.status(400).json({ error: "Tên loại không được để trống" });
    }

    // Generate unique MaLoai (e.g. L06, L07...)
    const lastId = db.loai.reduce((max, item) => {
        const num = parseInt(item.MaLoai.substring(1));
        return num > max ? num : max;
    }, 0);
    const MaLoai = 'L' + String(lastId + 1).padStart(2, '0');

    const newLoai = { MaLoai, TenLoai, MoTa: MoTa || "" };
    db.loai.push(newLoai);
    writeDB(db);
    res.status(201).json(newLoai);
});

app.put('/api/loai/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const { TenLoai, MoTa } = req.body;

    const index = db.loai.findIndex(item => item.MaLoai === id);
    if (index === -1) {
        return res.status(404).json({ error: "Không tìm thấy loại" });
    }

    db.loai[index] = { ...db.loai[index], TenLoai: TenLoai || db.loai[index].TenLoai, MoTa: MoTa !== undefined ? MoTa : db.loai[index].MoTa };
    writeDB(db);
    res.json(db.loai[index]);
});

app.delete('/api/loai/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;

    // Check if category is used in Menu_Dichvu
    const isUsed = db.menu_dichvu.some(item => item.Loai === id);
    if (isUsed) {
        return res.status(400).json({ error: "Không thể xóa loại vì đang có món ăn/dịch vụ thuộc loại này" });
    }

    const filtered = db.loai.filter(item => item.MaLoai !== id);
    if (filtered.length === db.loai.length) {
        return res.status(404).json({ error: "Không tìm thấy loại" });
    }

    db.loai = filtered;
    writeDB(db);
    res.json({ message: "Xóa loại thành công" });
});


// ==========================================
// API - MENU_DICHVU (Menu & Services)
// ==========================================
app.get('/api/menu_dichvu', (req, res) => {
    const db = readDB();
    // Resolve category name
    const resolved = db.menu_dichvu.map(item => {
        const cat = db.loai.find(l => l.MaLoai === item.Loai);
        return {
            ...item,
            TenLoai: cat ? cat.TenLoai : "Chưa phân loại"
        };
    });
    res.json(resolved);
});

app.post('/api/menu_dichvu', (req, res) => {
    const db = readDB();
    const { TenMenu_DV, MoTa, HinhAnh, DonGia, GiamGia, Loai } = req.body;

    if (!TenMenu_DV || DonGia === undefined || !Loai) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc (Tên, Đơn giá, Loại)" });
    }

    // Check category exists
    if (!db.loai.some(l => l.MaLoai === Loai)) {
        return res.status(400).json({ error: "Loại món ăn/dịch vụ không tồn tại" });
    }

    // Generate MaMenu_DV (e.g. DV011, DV012)
    const lastId = db.menu_dichvu.reduce((max, item) => {
        const num = parseInt(item.MaMenu_DV.substring(2));
        return num > max ? num : max;
    }, 0);
    const MaMenu_DV = 'DV' + String(lastId + 1).padStart(3, '0');

    const newItem = {
        MaMenu_DV,
        TenMenu_DV,
        MoTa: MoTa || "",
        HinhAnh: HinhAnh || "images/default.jpg",
        DonGia: Number(DonGia),
        GiamGia: Number(GiamGia || 0),
        Loai
    };

    db.menu_dichvu.push(newItem);
    writeDB(db);
    res.status(201).json(newItem);
});

app.put('/api/menu_dichvu/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const { TenMenu_DV, MoTa, HinhAnh, DonGia, GiamGia, Loai } = req.body;

    const index = db.menu_dichvu.findIndex(item => item.MaMenu_DV === id);
    if (index === -1) {
        return res.status(404).json({ error: "Không tìm thấy món ăn/dịch vụ" });
    }

    if (Loai && !db.loai.some(l => l.MaLoai === Loai)) {
        return res.status(400).json({ error: "Loại món ăn/dịch vụ không tồn tại" });
    }

    db.menu_dichvu[index] = {
        ...db.menu_dichvu[index],
        TenMenu_DV: TenMenu_DV || db.menu_dichvu[index].TenMenu_DV,
        MoTa: MoTa !== undefined ? MoTa : db.menu_dichvu[index].MoTa,
        HinhAnh: HinhAnh !== undefined ? HinhAnh : db.menu_dichvu[index].HinhAnh,
        DonGia: DonGia !== undefined ? Number(DonGia) : db.menu_dichvu[index].DonGia,
        GiamGia: GiamGia !== undefined ? Number(GiamGia) : db.menu_dichvu[index].GiamGia,
        Loai: Loai || db.menu_dichvu[index].Loai
    };

    writeDB(db);
    res.json(db.menu_dichvu[index]);
});

app.delete('/api/menu_dichvu/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;

    // Check if used in DatTiec details or ThanhToan details
    const isUsedInBookings = db.chitietdattiec.some(item => item.MaMenu_DV === id);
    const isUsedInInvoices = db.chitietthanhtoan.some(item => item.MaMenu_DV === id);

    if (isUsedInBookings || isUsedInInvoices) {
        return res.status(400).json({ error: "Không thể xóa vì sản phẩm/dịch vụ này đã nằm trong đơn đặt tiệc hoặc hóa đơn" });
    }

    const filtered = db.menu_dichvu.filter(item => item.MaMenu_DV !== id);
    if (filtered.length === db.menu_dichvu.length) {
        return res.status(404).json({ error: "Không tìm thấy món ăn/dịch vụ" });
    }

    db.menu_dichvu = filtered;
    writeDB(db);
    res.json({ message: "Xóa món ăn/dịch vụ thành công" });
});


// ==========================================
// API - DATTIEC (Bookings)
// ==========================================
app.get('/api/dattiec', (req, res) => {
    const db = readDB();
    res.json(db.dattiec || []);
});

// Get a single booking with details
app.get('/api/dattiec/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;

    const booking = db.dattiec.find(item => item.IdDatTiec === id);
    if (!booking) {
        return res.status(404).json({ error: "Không tìm thấy đơn đặt tiệc" });
    }

    // Get details and resolve item names
    const details = db.chitietdattiec.filter(item => item.IdDatTiec === id).map(item => {
        const itemInfo = db.menu_dichvu.find(m => m.MaMenu_DV === item.MaMenu_DV);
        return {
            ...item,
            TenMenu_DV: itemInfo ? itemInfo.TenMenu_DV : "Món ăn/dịch vụ đã bị xóa",
            Loai: itemInfo ? itemInfo.Loai : ""
        };
    });

    res.json({
        ...booking,
        details
    });
});

app.post('/api/dattiec', (req, res) => {
    const db = readDB();
    const {
        NgayDat,
        NgayThucHien,
        TenNhanVien,
        TenKhach,
        SDT,
        DatCoc,
        GhiChu,
        items // Array of { MaMenu_DV, SoLuong }
    } = req.body;

    if (!NgayThucHien || !TenKhach || !SDT || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Thiếu thông tin tiệc cưới hoặc danh sách món chọn" });
    }

    // Generate IdDatTiec (e.g. DT003, DT004)
    const lastId = db.dattiec.reduce((max, item) => {
        const num = parseInt(item.IdDatTiec.substring(2));
        return num > max ? num : max;
    }, 0);
    const IdDatTiec = 'DT' + String(lastId + 1).padStart(3, '0');

    let TongSL = 0;
    let TongTien = 0;
    const newDetails = [];

    // Calculate billing
    for (const orderItem of items) {
        const dbItem = db.menu_dichvu.find(m => m.MaMenu_DV === orderItem.MaMenu_DV);
        if (!dbItem) {
            return res.status(400).json({ error: `Sản phẩm ${orderItem.MaMenu_DV} không tồn tại` });
        }

        const qty = Number(orderItem.SoLuong || 0);
        if (qty <= 0) continue;

        const price = dbItem.DonGia;
        const discount = dbItem.GiamGia || 0; // % discount
        const lineTotal = qty * price * (1 - discount / 100);

        TongSL += qty;
        TongTien += lineTotal;

        newDetails.push({
            IdDatTiec,
            MaMenu_DV: orderItem.MaMenu_DV,
            SoLuong: qty,
            DonGia: price,
            GiamGia: discount
        });
    }

    const cọc = Number(DatCoc || 0);
    const conLai = TongTien - cọc;

    const newBooking = {
        IdDatTiec,
        NgayDat: NgayDat || new Date().toISOString().split('T')[0],
        NgayThucHien,
        TenNhanVien: TenNhanVien || "Lễ tân",
        TenKhach,
        SDT,
        TongSL,
        TongTien,
        DatCoc: cọc,
        ConLai: conLai < 0 ? 0 : conLai,
        GhiChu: GhiChu || "",
        TrangThai: "Đã cọc"
    };

    // Save
    db.dattiec.push(newBooking);
    db.chitietdattiec.push(...newDetails);
    writeDB(db);

    res.status(201).json({
        ...newBooking,
        details: newDetails
    });
});

app.put('/api/dattiec/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const {
        NgayThucHien,
        TenNhanVien,
        TenKhach,
        SDT,
        DatCoc,
        GhiChu,
        items // Array of { MaMenu_DV, SoLuong }
    } = req.body;

    const index = db.dattiec.findIndex(item => item.IdDatTiec === id);
    if (index === -1) {
        return res.status(404).json({ error: "Không tìm thấy đơn đặt tiệc" });
    }

    // Check status
    if (db.dattiec[index].TrangThai === "Đã thanh toán") {
        return res.status(400).json({ error: "Không thể chỉnh sửa đơn đặt tiệc đã thanh toán" });
    }

    let TongSL = db.dattiec[index].TongSL;
    let TongTien = db.dattiec[index].TongTien;

    // Remove old details for this booking
    db.chitietdattiec = db.chitietdattiec.filter(item => item.IdDatTiec !== id);

    if (items && Array.isArray(items) && items.length > 0) {
        TongSL = 0;
        TongTien = 0;
        const newDetails = [];

        for (const orderItem of items) {
            const dbItem = db.menu_dichvu.find(m => m.MaMenu_DV === orderItem.MaMenu_DV);
            if (!dbItem) {
                return res.status(400).json({ error: `Sản phẩm ${orderItem.MaMenu_DV} không tồn tại` });
            }

            const qty = Number(orderItem.SoLuong || 0);
            if (qty <= 0) continue;

            const price = dbItem.DonGia;
            const discount = dbItem.GiamGia || 0;
            const lineTotal = qty * price * (1 - discount / 100);

            TongSL += qty;
            TongTien += lineTotal;

            newDetails.push({
                IdDatTiec: id,
                MaMenu_DV: orderItem.MaMenu_DV,
                SoLuong: qty,
                DonGia: price,
                GiamGia: discount
            });
        }
        db.chitietdattiec.push(...newDetails);
    }

    const cọc = DatCoc !== undefined ? Number(DatCoc) : db.dattiec[index].DatCoc;
    const conLai = TongTien - cọc;

    db.dattiec[index] = {
        ...db.dattiec[index],
        NgayThucHien: NgayThucHien || db.dattiec[index].NgayThucHien,
        TenNhanVien: TenNhanVien || db.dattiec[index].TenNhanVien,
        TenKhach: TenKhach || db.dattiec[index].TenKhach,
        SDT: SDT || db.dattiec[index].SDT,
        TongSL,
        TongTien,
        DatCoc: cọc,
        ConLai: conLai < 0 ? 0 : conLai,
        GhiChu: GhiChu !== undefined ? GhiChu : db.dattiec[index].GhiChu
    };

    writeDB(db);
    res.json(db.dattiec[index]);
});

app.delete('/api/dattiec/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;

    const index = db.dattiec.findIndex(item => item.IdDatTiec === id);
    if (index === -1) {
        return res.status(404).json({ error: "Không tìm thấy đơn đặt tiệc" });
    }

    if (db.dattiec[index].TrangThai === "Đã thanh toán") {
        return res.status(400).json({ error: "Không thể xóa đơn đặt tiệc đã hoàn tất thanh toán" });
    }

    // Delete details and booking
    db.dattiec = db.dattiec.filter(item => item.IdDatTiec !== id);
    db.chitietdattiec = db.chitietdattiec.filter(item => item.IdDatTiec !== id);
    writeDB(db);

    res.json({ message: "Xóa đơn đặt tiệc thành công" });
});


// ==========================================
// API - THANHTOAN (Payments / Invoices)
// ==========================================
app.get('/api/thanhtoan', (req, res) => {
    const db = readDB();
    res.json(db.thanhtoan || []);
});

app.get('/api/thanhtoan/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;

    const invoice = db.thanhtoan.find(item => item.IdThanhtoan === id);
    if (!invoice) {
        return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
    }

    // Get invoice details
    const details = db.chitietthanhtoan.filter(item => item.IdThanhToan === id).map(item => {
        const itemInfo = db.menu_dichvu.find(m => m.MaMenu_DV === item.MaMenu_DV);
        return {
            ...item,
            TenMenu_DV: itemInfo ? itemInfo.TenMenu_DV : "Món ăn/dịch vụ đã bị xóa",
            Loai: itemInfo ? itemInfo.Loai : ""
        };
    });

    res.json({
        ...invoice,
        details
    });
});

// Process payment and create invoice
app.post('/api/thanhtoan', (req, res) => {
    const db = readDB();
    const {
        IdDatTiec,
        Ngaytt,
        TienPhaiNopThem,
        TienGiamGia,
        GhiChu
    } = req.body;

    if (!IdDatTiec) {
        return res.status(400).json({ error: "Cần truyền mã đặt tiệc để thanh toán" });
    }

    // Find booking
    const bIndex = db.dattiec.findIndex(b => b.IdDatTiec === IdDatTiec);
    if (bIndex === -1) {
        return res.status(404).json({ error: "Không tìm thấy thông tin đặt tiệc" });
    }

    const booking = db.dattiec[bIndex];
    if (booking.TrangThai === "Đã thanh toán") {
        return res.status(400).json({ error: "Tiệc cưới này đã được thanh toán trước đó" });
    }

    // Generate IdThanhtoan (e.g. TT002, TT003)
    const lastId = db.thanhtoan.reduce((max, item) => {
        const num = parseInt(item.IdThanhtoan.substring(2));
        return num > max ? num : max;
    }, 0);
    const IdThanhtoan = 'TT' + String(lastId + 1).padStart(3, '0');

    const phaiNopThem = Number(TienPhaiNopThem || 0);
    const giamGiaHD = Number(TienGiamGia || 0);
    const conLaiBanDau = booking.TongTien - booking.DatCoc;
    
    // TongTienKhachTra = ConLaiBanDau + TienPhaiNopThem - TienGiamGia
    const TongTienKhachTra = conLaiBanDau + phaiNopThem - giamGiaHD;

    const newInvoice = {
        IdThanhtoan,
        Ngaytt: Ngaytt || new Date().toISOString().split('T')[0],
        IdDatTiec,
        Ngaythuchien: booking.NgayThucHien,
        TenNhanVien: booking.TenNhanVien,
        TenKhach: booking.TenKhach,
        SD: booking.SDT, // SD matches SDT in schema
        TongSL: booking.TongSL,
        TongTien: booking.TongTien,
        DaDatCoc: booking.DatCoc,
        ConLai: 0, // Fully paid now
        GhiChu: GhiChu || booking.GhiChu || "",
        TienPhaiNopThem: phaiNopThem,
        TienGiamGia: giamGiaHD,
        TongTienKhachTra: TongTienKhachTra < 0 ? 0 : TongTienKhachTra
    };

    // Copy booking items to invoice details
    const bookingDetails = db.chitietdattiec.filter(item => item.IdDatTiec === IdDatTiec);
    const invoiceDetails = bookingDetails.map(item => ({
        IdThanhToan: IdThanhtoan,
        MaMenu_DV: item.MaMenu_DV,
        SoLuong: item.SoLuong,
        DonGia: item.DonGia,
        GiamGia: item.GiamGia
    }));

    // Update booking status
    db.dattiec[bIndex].TrangThai = "Đã thanh toán";
    db.dattiec[bIndex].ConLai = 0;

    // Save
    db.thanhtoan.push(newInvoice);
    db.chitietthanhtoan.push(...invoiceDetails);
    writeDB(db);

    res.status(201).json({
        ...newInvoice,
        details: invoiceDetails
    });
});


// ==========================================
// API - DASHBOARD
// ==========================================
app.get('/api/dashboard', (req, res) => {
    const db = readDB();

    // 1. Calculations
    const totalBookings = db.dattiec.length;
    const pendingBookings = db.dattiec.filter(b => b.TrangThai === "Đã cọc").length;
    const totalServices = db.menu_dichvu.length;
    
    // Revenue is the sum of TongTienKhachTra from payment + DatCoc from active/paid bookings
    // But schema-wise, let's sum up TongTienKhachTra + DatCoc of paid bookings, or simply sum TongTienKhachTra + DatCoc
    const totalRevenue = db.thanhtoan.reduce((sum, item) => sum + item.TongTienKhachTra, 0) + 
                         db.dattiec.filter(b => b.TrangThai === "Đã cọc").reduce((sum, item) => sum + item.DatCoc, 0);

    // 2. Recent Bookings (limit 5)
    const recentBookings = [...db.dattiec]
        .sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat))
        .slice(0, 5);

    // 3. Monthly Revenue Data (for Chart.js)
    // Build array of last 6 months
    const monthlyRevenue = {};
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' }); // e.g. "07/2026"
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

    // Also include deposit of active bookings
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
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
