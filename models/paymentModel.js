const { readDB, writeDB } = require('./db');

class PaymentModel {
    static getAll() {
        const db = readDB();
        return db.thanhtoan || [];
    }

    static getById(id) {
        const db = readDB();
        const invoice = db.thanhtoan.find(item => item.IdThanhtoan === id);
        if (!invoice) return null;

        // Get invoice details and resolve names
        const details = db.chitietthanhtoan.filter(item => item.IdThanhToan === id).map(item => {
            const itemInfo = db.menu_dichvu.find(m => m.MaMenu_DV === item.MaMenu_DV);
            return {
                ...item,
                TenMenu_DV: itemInfo ? itemInfo.TenMenu_DV : "Món ăn/dịch vụ đã bị xóa",
                Loai: itemInfo ? itemInfo.Loai : ""
            };
        });

        return {
            ...invoice,
            details
        };
    }

    static create(data) {
        const db = readDB();
        const {
            IdDatTiec,
            Ngaytt,
            TienPhaiNopThem,
            TienGiamGia,
            GhiChu
        } = data;

        if (!IdDatTiec) {
            throw new Error("Cần truyền mã đặt tiệc để thanh toán");
        }

        // Find booking
        const bIndex = db.dattiec.findIndex(b => b.IdDatTiec === IdDatTiec);
        if (bIndex === -1) {
            throw new Error("Không tìm thấy thông tin đặt tiệc");
        }

        const booking = db.dattiec[bIndex];
        if (booking.TrangThai === "Đã thanh toán") {
            throw new Error("Tiệc cưới này đã được thanh toán trước đó");
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
            ConLai: 0, // Fully paid
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

        return {
            ...newInvoice,
            details: invoiceDetails
        };
    }
}

module.exports = PaymentModel;
