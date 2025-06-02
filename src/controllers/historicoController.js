const comandaService = require('../services/comandaService');

exports.listarHistorico = async (req, res) => {
  try {
    const historico = await comandaService.listarHistorico();
    res.json(historico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.limparHistorico = async (req, res) => {
  try {
    const resultado = await comandaService.limparHistorico();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};