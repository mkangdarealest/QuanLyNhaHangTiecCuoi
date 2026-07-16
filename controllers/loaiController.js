const LoaiModel = require('../models/loaiModel');

class LoaiController {
    static getAll(req, res) {
        try {
            const list = LoaiModel.getAll();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const item = LoaiModel.getById(id);
            if (!item) {
                return res.status(404).json({ error: "Không tìm thấy loại" });
            }
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static create(req, res) {
        try {
            const newItem = LoaiModel.create(req.body);
            res.status(201).json(newItem);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static update(req, res) {
        try {
            const { id } = req.params;
            const updated = LoaiModel.update(id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Không tìm thấy loại" });
            }
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const success = LoaiModel.delete(id);
            if (!success) {
                return res.status(404).json({ error: "Không tìm thấy loại" });
            }
            res.json({ message: "Xóa loại thành công" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = LoaiController;
