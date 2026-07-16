const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

router.get('/', BookingController.getAll);
router.get('/:id', BookingController.getById);
router.post('/', BookingController.create);
router.put('/:id', BookingController.update);
router.delete('/:id', BookingController.delete);

module.exports = router;
