const { readDB, writeDB } = require('./db');

class LoaiModel {
    static getAll() {
        const db = readDB();
        return db.loai || [];
    }

    static getById(id) {
        const db = readDB();
        return db.loai.find(item => item.MaLoai === id);
    }

    static create(data) {
        const db = readDB();
        const { TenLoai, MoTa } = data;

        if (!TenLoai) {
            throw new Error("Tên loại không được để trống");
        }

        // Generate unique MaLoai (e.g. L01, L02...)
        const lastId = db.loai.reduce((max, item) => {
            const num = parseInt(item.MaLoai.substring(1));
            return num > max ? num : max;
        }, 0);
        const MaLoai = 'L' + String(lastId + 1).padStart(2, '0');

        const newLoai = { MaLoai, TenLoai, MoTa: MoTa || "" };
        db.loai.push(newLoai);
        writeDB(db);
        return newLoai;
    }

    static update(id, data) {
        const db = readDB();
        const { TenLoai, MoTa } = data;

        const index = db.loai.findIndex(item => item.MaLoai === id);
        if (index === -1) {
            return null;
        }

        db.loai[index] = {
            ...db.loai[index],
            TenLoai: TenLoai || db.loai[index].TenLoai,
            MoTa: MoTa !== undefined ? MoTa : db.loai[index].MoTa
        };
        writeDB(db);
        return db.loai[index];
    }

    static delete(id) {
        const db = readDB();

        // Check if category is used in Menu_Dichvu
        const isUsed = db.menu_dichvu.some(item => item.Loai === id);
        if (isUsed) {
            throw new Error("Không thể xóa loại vì đang có món ăn/dịch vụ thuộc loại này");
        }

        const filtered = db.loai.filter(item => item.MaLoai !== id);
        if (filtered.length === db.loai.length) {
            return false;
        }

        db.loai = filtered;
        writeDB(db);
        return true;
    }
}

module.exports = LoaiModel;
