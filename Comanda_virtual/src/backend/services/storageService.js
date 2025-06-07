const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data/comandas.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (error) {
    return { comandas: [], historico: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };