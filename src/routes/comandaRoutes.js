const express = require('express');
const router = express.Router();
const controller = require('../controllers/comandaController');

router.post('/', controller.criarComanda);
router.get('/:id', controller.buscarComanda);
router.put('/:id', controller.atualizarComanda);
router.delete('/:id', controller.fecharComanda);

module.exports = router;