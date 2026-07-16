const BookingModel = require('../models/bookingModel');

class BookingController {
    static getAll(req, res) {
        try {
            const list = BookingModel.getAll();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const booking = BookingModel.getById(id);
            if (!booking) {
                return res.status(404).json({ error: "Không tìm thấy đơn đặt tiệc" });
            }
            res.json(booking);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static create(req, res) {
        try {
            const newBooking = BookingModel.create(req.body);
            res.status(201).json(newBooking);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static update(req, res) {
        try {
            const { id } = req.params;
            const updated = BookingModel.update(id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Không tìm thấy đơn đặt tiệc" });
            }
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const success = BookingModel.delete(id);
            if (!success) {
                return res.status(404).json({ error: "Không tìm thấy đơn đặt tiệc" });
            }
            res.json({ message: "Xóa đơn đặt tiệc thành công" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = BookingController;
