const PaymentModel = require('../models/paymentModel');

class PaymentController {
    static getAll(req, res) {
        try {
            const list = PaymentModel.getAll();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const invoice = PaymentModel.getById(id);
            if (!invoice) {
                return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
            }
            res.json(invoice);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static create(req, res) {
        try {
            const newInvoice = PaymentModel.create(req.body);
            res.status(201).json(newInvoice);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = PaymentController;
