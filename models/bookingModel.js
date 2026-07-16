const { readDB, writeDB } = require('./db');

class BookingModel {
    static getAll() {
        const db = readDB();
        return db.dattiec || [];
    }

    static getById(id) {
        const db = readDB();
        const booking = db.dattiec.find(item => item.IdDatTiec === id);
        if (!booking) return null;

        // Get details and resolve item names
        const details = db.chitietdattiec.filter(item => item.IdDatTiec === id).map(item => {
            const itemInfo = db.menu_dichvu.find(m => m.MaMenu_DV === item.MaMenu_DV);
            return {
                ...item,
                TenMenu_DV: itemInfo ? itemInfo.TenMenu_DV : "Món ăn/dịch vụ đã bị xóa",
                Loai: itemInfo ? itemInfo.Loai : ""
            };
        });

        return {
            ...booking,
            details
        };
    }

    static create(data) {
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
        } = data;

        if (!NgayThucHien || !TenKhach || !SDT || !items || !Array.isArray(items) || items.length === 0) {
            throw new Error("Thiếu thông tin tiệc cưới hoặc danh sách món chọn");
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
                throw new Error(`Sản phẩm ${orderItem.MaMenu_DV} không tồn tại`);
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

        return {
            ...newBooking,
            details: newDetails
        };
    }

    static update(id, data) {
        const db = readDB();
        const {
            NgayThucHien,
            TenNhanVien,
            TenKhach,
            SDT,
            DatCoc,
            GhiChu,
            items // Array of { MaMenu_DV, SoLuong }
        } = data;

        const index = db.dattiec.findIndex(item => item.IdDatTiec === id);
        if (index === -1) {
            return null;
        }

        // Check status
        if (db.dattiec[index].TrangThai === "Đã thanh toán") {
            throw new Error("Không thể chỉnh sửa đơn đặt tiệc đã thanh toán");
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
                    throw new Error(`Sản phẩm ${orderItem.MaMenu_DV} không tồn tại`);
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
        return db.dattiec[index];
    }

    static delete(id) {
        const db = readDB();
        const index = db.dattiec.findIndex(item => item.IdDatTiec === id);
        if (index === -1) {
            return false;
        }

        if (db.dattiec[index].TrangThai === "Đã thanh toán") {
            throw new Error("Không thể xóa đơn đặt tiệc đã hoàn tất thanh toán");
        }

        // Delete details and booking
        db.dattiec = db.dattiec.filter(item => item.IdDatTiec !== id);
        db.chitietdattiec = db.chitietdattiec.filter(item => item.IdDatTiec !== id);
        writeDB(db);
        return true;
    }
}

module.exports = BookingModel;
