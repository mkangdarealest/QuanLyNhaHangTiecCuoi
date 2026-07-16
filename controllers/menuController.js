const MenuModel = require('../models/menuModel');

class MenuController {
    static getAll(req, res) {
        try {
            const list = MenuModel.getAll();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const item = MenuModel.getById(id);
            if (!item) {
                return res.status(404).json({ error: "Không tìm thấy món ăn/dịch vụ" });
            }
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static create(req, res) {
        try {
            const newItem = MenuModel.create(req.body);
            res.status(201).json(newItem);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static update(req, res) {
        try {
            const { id } = req.params;
            const updated = MenuModel.update(id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Không tìm thấy món ăn/dịch vụ" });
            }
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const success = MenuModel.delete(id);
            if (!success) {
                return res.status(404).json({ error: "Không tìm thấy món ăn/dịch vụ" });
            }
            res.json({ message: "Xóa món ăn/dịch vụ thành công" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = MenuController;
