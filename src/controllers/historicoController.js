const comandaService = require('../services/comandaService');

exports.listarHistorico = (req, res) => {
  try {
    const historico = comandaService.listarHistorico();
    res.json(historico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};