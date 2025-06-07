const Comanda = require('../models/Comanda');

exports.criarComanda = async (comandaData) => {
  return await Comanda.create(comandaData);
};

exports.buscarComandaPorId = async (id) => {
  return await Comanda.findById(id);
};

exports.editarComanda = async (id, comandaData) => {
  return await Comanda.update(id, comandaData);
};

exports.fecharComanda = async (id) => {
  return await Comanda.close(id);
};

exports.listarComandasAtivas = async () => {
  return await Comanda.findAllActive();
};

exports.finalizarComanda = async (id) => {
  return await Comanda.close(id);
};

exports.buscarComandasPorPeriodo = async (inicio, fim) => {
  return await Comanda.findByPeriod(inicio, fim);
};