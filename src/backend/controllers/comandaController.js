const comandaService = require('../services/comandaService');

exports.criarComanda = async (req, res) => {
  try {
    const novaComanda = await comandaService.criarComanda(req.body);
    res.status(201).json({
      success: true,
      data: novaComanda,
      message: 'Comanda criada com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao criar comanda'
    });
  }
};

exports.buscarComanda = async (req, res) => {
  try {
    const comanda = await comandaService.buscarComandaPorId(req.params.id);
    if (comanda) {
      res.json({
        success: true,
        data: comanda
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Comanda não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar comanda'
    });
  }
};

exports.atualizarComanda = async (req, res) => {
  try {
    const comandaAtualizada = await comandaService.editarComanda(req.params.id, req.body);
    if (comandaAtualizada) {
      res.json({
        success: true,
        data: comandaAtualizada,
        message: 'Comanda atualizada com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Comanda não encontrada'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao atualizar comanda',
      details: error.errors || null
    });
  }
};

exports.fecharComanda = async (req, res) => {
  try {
    const comandaFechada = await comandaService.fecharComanda(req.params.id);
    if (comandaFechada) {
      res.json({
        success: true,
        data: comandaFechada,
        message: 'Comanda fechada com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Comanda não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao fechar comanda'
    });
  }
};

exports.listarComandasAtivas = async (req, res) => {
  try {
    const comandas = await comandaService.listarComandasAtivas();
    res.json({
      success: true,
      count: comandas.length,
      data: comandas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar comandas ativas'
    });
  }
};

exports.finalizarComanda = async (req, res) => {
  try {
    const comandaFinalizada = await comandaService.finalizarComanda(req.params.id);
    if (comandaFinalizada) {
      res.json({
        success: true,
        data: comandaFinalizada,
        message: 'Comanda finalizada com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Comanda não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao finalizar comanda'
    });
  }
};

// Método para buscar comandas por período (exemplo de nova funcionalidade)
exports.buscarPorPeriodo = async (req, res) => {
  try {
    const { inicio, fim } = req.query;
    const comandas = await comandaService.buscarComandasPorPeriodo(inicio, fim);
    
    res.json({
      success: true,
      count: comandas.length,
      periodo: { inicio, fim },
      data: comandas
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao buscar comandas por período'
    });
  }
};