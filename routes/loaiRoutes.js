const express = require('express');
const router = express.Router();
const LoaiController = require('../controllers/loaiController');

router.get('/', LoaiController.getAll);
router.get('/:id', LoaiController.getById);
router.post('/', LoaiController.create);
router.put('/:id', LoaiController.update);
router.delete('/:id', LoaiController.delete);

module.exports = router;
