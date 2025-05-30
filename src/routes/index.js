const express = require('express');
const router = express.Router();

router.use('/comandas', require('./comandaRoutes'));
router.use('/historico', require('./historicoRoutes'));

module.exports = router;