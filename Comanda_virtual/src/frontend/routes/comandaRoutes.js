const express = require('express');
const router = express.Router();
const controller = require('../controllers/comandaController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.post('/', controller.criarComanda);
router.get('/', controller.listarComandasAtivas);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware);

router.get('/:id', controller.buscarComanda);
router.put('/:id', controller.atualizarComanda);
router.delete('/:id', controller.finalizarComanda);
router.get('/periodo', controller.buscarPorPeriodo);

module.exports = router;