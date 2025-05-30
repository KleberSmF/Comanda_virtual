const express = require('express');
const router = express.Router();
const controller = require('../controllers/historicoController');

router.get('/', controller.listarHistorico);

module.exports = router;