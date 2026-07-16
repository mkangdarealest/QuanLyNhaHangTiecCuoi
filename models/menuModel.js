const { readDB, writeDB } = require('./db');

class MenuModel {
    static getAll() {
        const db = readDB();
        // Resolve category name (TenLoai)
        return db.menu_dichvu.map(item => {
            const cat = db.loai.find(l => l.MaLoai === item.Loai);
            return {
                ...item,
                TenLoai: cat ? cat.TenLoai : "Chưa phân loại"
            };
        });
    }

    static getById(id) {
        const db = readDB();
        return db.menu_dichvu.find(item => item.MaMenu_DV === id);
    }

    static create(data) {
        const db = readDB();
        const { TenMenu_DV, MoTa, HinhAnh, DonGia, GiamGia, Loai } = data;

        if (!TenMenu_DV || DonGia === undefined || !Loai) {
            throw new Error("Thiếu thông tin bắt buộc (Tên, Đơn giá, Loại)");
        }

        // Check category exists
        if (!db.loai.some(l => l.MaLoai === Loai)) {
            throw new Error("Loại món ăn/dịch vụ không tồn tại");
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
            HinhAnh: HinhAnh || "images/default.svg",
            DonGia: Number(DonGia),
            GiamGia: Number(GiamGia || 0),
            Loai
        };

        db.menu_dichvu.push(newItem);
        writeDB(db);
        return newItem;
    }

    static update(id, data) {
        const db = readDB();
        const { TenMenu_DV, MoTa, HinhAnh, DonGia, GiamGia, Loai } = data;

        const index = db.menu_dichvu.findIndex(item => item.MaMenu_DV === id);
        if (index === -1) {
            return null;
        }

        if (Loai && !db.loai.some(l => l.MaLoai === Loai)) {
            throw new Error("Loại món ăn/dịch vụ không tồn tại");
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
        return db.menu_dichvu[index];
    }

    static delete(id) {
        const db = readDB();

        // Check if used in DatTiec details or ThanhToan details
        const isUsedInBookings = db.chitietdattiec.some(item => item.MaMenu_DV === id);
        const isUsedInInvoices = db.chitietthanhtoan.some(item => item.MaMenu_DV === id);

        if (isUsedInBookings || isUsedInInvoices) {
            throw new Error("Không thể xóa vì sản phẩm/dịch vụ này đã nằm trong đơn đặt tiệc hoặc hóa đơn");
        }

        const filtered = db.menu_dichvu.filter(item => item.MaMenu_DV !== id);
        if (filtered.length === db.menu_dichvu.length) {
            return false;
        }

        db.menu_dichvu = filtered;
        writeDB(db);
        return true;
    }
}

module.exports = MenuModel;
