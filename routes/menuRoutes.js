const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menuController');

router.get('/', MenuController.getAll);
router.get('/:id', MenuController.getById);
router.post('/', MenuController.create);
router.put('/:id', MenuController.update);
router.delete('/:id', MenuController.delete);

module.exports = router;
