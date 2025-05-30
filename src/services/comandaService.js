const { readData, writeData } = require('./storageService');

function criarComanda(novaComanda) {
  const data = readData();
  novaComanda.id = Date.now().toString();
  novaComanda.dataAbertura = new Date().toISOString();
  novaComanda.status = 'aberta';
  data.comandas.push(novaComanda);
  writeData(data);
  return novaComanda;
}

function buscarComandaPorId(id) {
  const data = readData();
  return data.comandas.find(c => c.id === id);
}

function editarComanda(id, comandaAtualizada) {
  const data = readData();
  const index = data.comandas.findIndex(c => c.id === id);
  if (index !== -1) {
    data.comandas[index] = { ...data.comandas[index], ...comandaAtualizada };
    writeData(data);
    return data.comandas[index];
  }
  return null;
}

function fecharComanda(id) {
  const data = readData();
  const index = data.comandas.findIndex(c => c.id === id);
  if (index !== -1) {
    const comanda = data.comandas[index];
    comanda.status = 'fechada';
    comanda.dataFechamento = new Date().toISOString();
    data.historico.push(comanda);
    data.comandas.splice(index, 1);
    writeData(data);
    return comanda;
  }
  return null;
}

function listarHistorico() {
  const data = readData();
  return data.historico;
}

module.exports = {
  criarComanda,
  buscarComandaPorId,
  editarComanda,
  fecharComanda,
  listarHistorico
};