const comandaService = require('../services/comandaService');

exports.criarComanda = (req, res) => {
  try {
    const novaComanda = comandaService.criarComanda(req.body);
    res.status(201).json(novaComanda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.buscarComanda = (req, res) => {
  const comanda = comandaService.buscarComandaPorId(req.params.id);
  if (comanda) {
    res.json(comanda);
  } else {
    res.status(404).json({ error: 'Comanda não encontrada' });
  }
};

exports.atualizarComanda = (req, res) => {
  const comandaAtualizada = comandaService.editarComanda(req.params.id, req.body);
  if (comandaAtualizada) {
    res.json(comandaAtualizada);
  } else {
    res.status(404).json({ error: 'Comanda não encontrada' });
  }
};

exports.fecharComanda = (req, res) => {
  const comandaFechada = comandaService.fecharComanda(req.params.id);
  if (comandaFechada) {
    res.json(comandaFechada);
  } else {
    res.status(404).json({ error: 'Comanda não encontrada' });
  }
};